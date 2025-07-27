import { NextFunction,Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();
const JWT_SECRET = "IloveKiara";



export const usermiddleware = (req: Request , res: Response, next: NextFunction)=>{
    const header = req.headers.authorization;

    if (!header) {
        return res.status(403).json({
            message: "Token not provided"
        });
    }

    const decoded = jwt.verify(header as string,JWT_SECRET)

    

    if(decoded){
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }else{
        res.status(403).json({
            message: "You are not logged In"
        })
    }
}
