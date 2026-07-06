import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlocklistTokenModel from "../models/blocklistoken.model";

// POST /api/auth/signup for registering a user
const handleSignup = async (req: Request, res: Response) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        const loginToken = jwt.sign({_id: user._id, name: user.name, email: user.email}, process.env.JWT_SECRET! , {expiresIn: '1d'})

        res.cookie('token', loginToken, { httpOnly: true, maxAge: 1 * 24 * 60 * 60 * 1000})

        return res.status(201).json({ message: 'User created successfully', user: {
            _id: user._id,
            name: user.name,
            email: user.email
        } });
    } catch (error) {
        console.error('Error in signup handler:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

// POST /api/auth/signin for logging in a user
const handleSignin = async (req: Request, res: Response) => {

    try {
        const {email, password, rememberMe} = req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and password are required'})
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(401).json({message: 'Invalid credentials'})
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({message: 'Password is not valid'})
        }

        const expiresIn = rememberMe ? '30d' : '1d';
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000;

        const loginToken = jwt.sign({_id: user._id, name: user.name, email: user.email}, process.env.JWT_SECRET! , {expiresIn})

        res.cookie('token', loginToken, { httpOnly: true, maxAge})

        return res.status(200).json({message: 'User logged in successfully', user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }});
    } catch (error) {
        console.error('Error in signin handler:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

const handleSignout = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: 'You are not logged in'})
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!)
        if(!decodedToken){
            return res.status(401).json({message: 'Invalid token'})
        }

        await BlocklistTokenModel.create({token})
        res.clearCookie('token')
        return res.status(200).json({message: 'User logged out successfully'})
    } catch (error) {
        console.error('Error in signout handler:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const handleMyDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        if(!userId){
            return res.status(401).json({message: 'You are not logged in'})
        }

        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        return res.status(200).json({message: 'User details fetched successfully', user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }})
    } catch (error) {
        console.error('Error in my-details handler:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const handleForgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6 digit random number
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiry in 10 minutes
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOtp = otp;
        user.resetOtpExpires = otpExpires;
        await user.save();

        // Print to console for development testing
        console.log(`[DEVELOPMENT] Password Reset OTP for ${email}: ${otp}`);

        return res.status(200).json({ 
            success: true, 
            message: 'Verification code sent successfully',
            otp: otp 
        });
    } catch (error) {
        console.error('Error in forgot-password handler:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const handleVerifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (user.resetOtpExpires && new Date() > user.resetOtpExpires) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        return res.status(200).json({ success: true, message: 'Verification code verified successfully' });
    } catch (error) {
        console.error('Error in verify-otp handler:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const handleResetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, verification code, and new password are required' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (user.resetOtpExpires && new Date() > user.resetOtpExpires) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        
        // Clear OTP fields
        user.resetOtp = null as any;
        user.resetOtpExpires = null as any;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error in reset-password handler:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
 
export { 
    handleSignup, 
    handleSignin, 
    handleSignout, 
    handleMyDetails,
    handleForgotPassword,
    handleVerifyOtp,
    handleResetPassword
}