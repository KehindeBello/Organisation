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
    async get_Organisation(req: Request, res:Response) {
        
        const userId = req.user?.userId;
        const { orgId } = req.params;

        logger.info(`Organisation ID - ${orgId}`);
        try {
            if (orgId) {
                //Fetch a single organisation
                const organisation = await prisma.organisation.findFirst({
                    where: {
                        orgId: orgId,
                        users: {
                            some: {
                                userId: userId
                            }
                        }
                    },
                    select: {
                        orgId: true,
                        name: true,
                        description: true
                    }

                });

                if (!organisation) {
                    return res.status(400).json({
                        "status": "Bad Request",
                        "message": "Client error",
                        "statusCode": 400
                    });
                }

                return res.status(200).json({
                    "status": "success",
                    "message": "Organisation fetched successfully",
                    "data": organisation
                });
            } else {
                //Fetch all organisations the user belongs to
                const organisations = await prisma.organisation.findMany({
                    where: {
                        users: {
                            some: {
                                userId: userId
                            }
                        }
                    },
                    select: {
                        orgId: true,
                        name: true,
                        description: true
                    }
                })
                logger.info(`Organizations fetched`);
    
                return res.status(200).json({
                    "status":"success",
                    "message":" Fetched Organisation",
                    "data": {
                        organisations
                    }
                })
            }
        } catch(error: any) {

            return res.status(400).json({
                "status":"Bad Request",
                "message": "Client error",
                "statusCode": 400
            })
        }
    }
    
    async addUser(req: Request, res: Response) {
        
        try {
            const { orgId } = req.params;
            const {userId} = req.body;

        //check if user exists
        const user = await prisma.user.findUnique({
            where: {userId}
        });

        if (!user) {
            return res.status(400).json({
                "status":"Bad Request",
                "message": "User does not exist",
                "statusCode": 400
            });
        }

        //check if organisation exists
        const organisation = await prisma.organisation.findUnique({
            where: { orgId }
        });

        if (!organisation) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Organisation not found",
                "statusCode": 400
            });
        }

        //create the relatioship in the UserOrganisation table
        await prisma.userOrganisation.create({
            data: {
                userId,
                orgId
            }
        });

        return res.status(200).json({
            "status": "Success",
            "message": "User added to organisation successfully"
        })
        
        } catch (error:any) {
            return res.status(400).json({
                "status": "error",
                "message": error.message,
                "statusCode": 400
            })
        }
    }
}