import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../utils/jwt";
import { hashPassword } from "../utils/auth";
import { logger } from "../utils/logger";

const prisma = new PrismaClient()

export class UserController {

    async post_signup(req:Request, res:Response) {
        //destructure request body
        let { email, firstName, lastName, password, phone} = req.body;
        // hash password
        const hashedPassword = await hashPassword(password)
        logger.info(`hashed password - ${hashedPassword}`)
        try {
            // Create User
            const user = await prisma.user.create({
                data: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    password: hashedPassword ,
                }
            });
            //Create jwt token
            const accessToken = generateToken({userId: user.userId, email: user.email});
            logger.info(`User created: ${email}`);

            //Create default organization
            const organisation = await prisma.organisation.create({
                data: {
                    name: `${firstName}'s Organisation`,
                    userId: user.userId
                }
            })
            logger.info(`Organization created - ${organisation.name}`)
            res.status(201).json({
                "status": "success",
                "message": "Registration successful",
                "data": {
                    "accessToken": accessToken,
                    "user": {
                        userId: user.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone
                    }
                }
            })
        } catch (error: any) {
            logger.error(`Error creating user: ${error.message}`)
            res.status(400).json({
                "status": "Bad request",
                "message": "Registration unsuccessful",
                "statusCode": 400
            })
        }
    }
}