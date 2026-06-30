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
        const {email, password} = req.body;

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

        const loginToken = jwt.sign({_id: user._id, name: user.name, email: user.email}, process.env.JWT_SECRET! , {expiresIn: '1d'})

        res.cookie('token', loginToken, { httpOnly: true, maxAge: 1 * 24 * 60 * 60 * 1000})

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
 
export { handleSignup, handleSignin, handleSignout, handleMyDetails }