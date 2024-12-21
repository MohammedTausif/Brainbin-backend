import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'



dotenv.config()
export const UserMiddleware = (req: Request, res: Response, next: NextFunction) => {
const header = req.headers["authorization"];
const decoded = jwt.verify(header as string, process.env.JWT_SECRET)


if (decoded){
    if(typeof decoded === "string"){
        res.status(403).json({
            message : "your are not logged in"
        }) 
        return;
    }

    req.userId = (decoded as JwtPayload).id;
    next();
}
else{
    res.status(403).json({
        message: "your not logged in"
    })
}

}