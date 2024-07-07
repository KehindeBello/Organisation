import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient()

export class UserController {

    async user_record(req: Request, res: Response) {

        const userId = req.params.id
        try {
            const user = await prisma.user.findUnique({
                where: {userId}
            });
            logger.info(`${user?.email} fetched`);

            return res.status(200).json({
                "status": "success",
                "message": "User fetched",
                "data": {
                    "userId": user?.userId,
                    "firstName": user?.firstName,
                    "lastName": user?.lastName,
                    "email": user?.email,
                    "phone": user?.phone
                }
            })
        } catch (error: any) {
            return res.status(400).json({
                "messgae": `${error.message}`,
                "status": 'Failed',
                "statusCode": 400
            })
        }

    }
}