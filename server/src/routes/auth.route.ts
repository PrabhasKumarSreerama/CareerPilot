import { Router } from "express";
import { handleSignin, handleSignout, handleSignup, handleMyDetails } from "../handlers/auth.handler";
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
 * GET /my-details
 */
authRouter.get('/my-details', authUser, handleMyDetails)



export default authRouter