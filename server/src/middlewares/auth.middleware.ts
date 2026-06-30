import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { UserPayload } from "../types/express"
import BlocklistTokenModel from "../models/blocklistoken.model"

const authUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }

    // check this token is in blocklist
    const blockedToken = await BlocklistTokenModel.findOne({token})
    if(blockedToken){
        return res.status(401).json({message: 'Token is blacklisted'})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
        if(!decodedToken){
            return res.status(401).json({message: 'Invalid token'})
        }
        req.user = decodedToken
        next()
    } catch (error) {
        console.error('Error in authUser middleware:', error)
        return res.status(401).json({message: 'Bad Request - Invalid token'})
    }
}

export { authUser }