import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { logger } from "../utils/logger";
import { UserJwtPayload } from "../interfaces/userJwtPayload";


export const protectRoute = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        logger.error(`Bearer token missing!`);
        return res.status(401).json({
            "message": "Unauthorized, Bearer token missing!"
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded: UserJwtPayload = verifyToken(token);
        req.user = decoded
        logger.info(`log req user - ${decoded}`)
        next();
    } catch (error: any) {
        logger.error(`Token verification failed: ${error.message}`);
        return res.status(401).json({
            "message": "Unauthorized, invalid token!"
        })
    }
}