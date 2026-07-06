import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useEffect } from "react";
import { signup, signin, signout, getCurrentUser, forgotPassword, verifyOtp, resetPassword } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const { user, loading, error, setUser, setLoading, setError } = context;
    // Check if the user is authenticated on mount
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await getCurrentUser();
            setUser(response.user);
        } catch (err) {
            console.error('Error fetching auth status:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Sign up a new user
    const handleSignup = async (name, email, password) => {
        setError(null);
        setLoading(true);
        try {
            const response = await signup(name, email, password);
            setUser(response.user);
            return { success: true, user: response.user };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message || 
                "Registration failed. Please try again."  
             };
        } finally {
            setLoading(false);
        }
    };

    // Sign in an existing user
    const handleSignin = async (email, password, rememberMe) => {
        setError(null);
        setLoading(true);
        try {
            const response = await signin(email, password, rememberMe);
            setUser(response.user);
            return { success: true, user: response.user };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Sign out user
    const handleSignout = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await signout();
            setUser(null);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Request reset password OTP
    const handleForgotPassword = async (email) => {
        setError(null);
        setLoading(true);
        try {
            const response = await forgotPassword(email);
            return { success: true, message: response.message, otp: response.otp };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (email, otp) => {
        setError(null);
        setLoading(true);
        try {
            const response = await verifyOtp(email, otp);
            return { success: true, message: response.message };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // Reset password with verified OTP
    const handleResetPassword = async (email, otp, newPassword) => {
        setError(null);
        setLoading(true);
        try {
            const response = await resetPassword(email, otp, newPassword);
            return { success: true, message: response.message };
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        handleSignup,
        handleSignin,
        handleSignout,
        handleForgotPassword,
        handleVerifyOtp,
        handleResetPassword,
        checkAuthStatus
    };
};