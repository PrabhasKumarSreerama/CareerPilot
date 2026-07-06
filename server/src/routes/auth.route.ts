import { Router } from "express";
import { 
    handleSignin, 
    handleSignout, 
    handleSignup, 
    handleMyDetails,
    handleForgotPassword,
    handleVerifyOtp,
    handleResetPassword
} from "../handlers/auth.handler";
import { authUser } from "../middlewares/auth.middleware";

const authRouter = Router()

/**
 * POST /auth/signup
 */
authRouter.post('/signup', handleSignup)

/**
 * POST /auth/signin
 */
authRouter.post('/signin', handleSignin)

/**
 * GET /auth/signout
 */
authRouter.get('/signout', handleSignout)

/**
 * POST /auth/forgot-password
 */
authRouter.post('/forgot-password', handleForgotPassword)

/**
 * POST /auth/verify-otp
 */
authRouter.post('/verify-otp', handleVerifyOtp)

/**
 * POST /auth/reset-password
 */
authRouter.post('/reset-password', handleResetPassword)

/**
 * GET /my-details
 */
authRouter.get('/my-details', authUser, handleMyDetails)



export default authRouter