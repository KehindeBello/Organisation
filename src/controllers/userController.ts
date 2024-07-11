import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient()

export class UserController {

    async user_record(req: Request, res: Response) {

        const userId = req.params.id
        const loggedInUserId = req.user?.userId

        try {
            //check if logged-in user is requesting their own data
            if (userId === loggedInUserId) {
                const user = await prisma.user.findUnique({
                    where: {userId},
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    }
                });
                // logger.info(`${user?.email} fetched`);
                if (!user) {
                    return res.status(404).json({
                        "status": "error",
                        "message": "User not found"
                    });
                }
                return res.status(200).json({
                    "status": "success",
                    "message": "User fetched",
                    "data": user
                });
            }
            //get organisation of logged in user
            const organisationOfLoggedInUser = await prisma.userOrganisation.findMany({
                where: {userId: loggedInUserId },
                select: {orgId: true}
            });
            logger.info(`Organisations of LoggedInUser - ${organisationOfLoggedInUser}`);
            const orgIds = organisationOfLoggedInUser.map(org => org.orgId);
            logger.info(`Org Ids- ${orgIds}`);

            // check if logged-in user is part of same organisation as the requested user
            const userInSameOrganisation = await prisma.user.findFirst({
                where: {
                    userId: userId,
                    organisations: {
                        some: {
                            orgId: {
                                in: orgIds
                            }
                        }
                    }
                },
                select: {
                    userId: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true
                }
            });

            if (!userInSameOrganisation) {
                return res.status(403).json({
                    "status": "error",
                    "message": "Access denied",
                    "statusCode": 403
                });
            }
            logger.info(`User - ${userInSameOrganisation}`)
            return res.status(200).json({
                "status": "success",
                "message": "User Fetched",
                "data": userInSameOrganisation
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