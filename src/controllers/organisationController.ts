import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient()

export class OrganisationController {

    async create_organisation(req: Request, res: Response) {
        
        const userId = req.user?.userId as string
        logger.info(`User id from token - ${userId}`);
        const {name, description} = req.body;
        try {
            const organisation = await prisma.organisation.create({
                data: {
                    name: name,
                    description: description,
                    userId: userId
                }
            });
            logger.info(`${name} Organisation Created`);

            return res.status(201).json({
                "status": "success",
                "message": "Organisation created successfully",
                "data": {
                    "orgId": organisation.orgId,
                    "name": organisation.name,
                    "description": organisation.description
                }
            })

        } catch(error:any) {
            return res.status(400).json({
                "status":"Bad Request",
                "message": "Client error",
                "statusCode": 400
            })
        }
        
    }

}