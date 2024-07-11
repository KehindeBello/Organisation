import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/auth";
import { logger } from "../utils/logger";

const prisma = new PrismaClient()

export class AuthController {

    async post_signup(req:Request, res:Response) {
        //destructure request body
        let { email, firstName, lastName, password, phone} = req.body;
        // hash password
        const hashedPassword = await hashPassword(password)
        logger.info(`hashed password - ${hashedPassword}`)
        try {
            const userExists = await prisma.user.findUnique({where: {email}})
            if (userExists) {
                return res.status(422).json({
                    "status": "Bad Request",
                    "message": "Email already exists",
                    "statusCode": 422
                })
            }
            // Create User and Default Organisation
            const user = await prisma.user.create({
                data: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    password: hashedPassword,
                    organisations: {
                        create: {
                            Organisation: {
                                create: {
                                    name: `${firstName}'s Organisation`
                                }
                            }
                        }
                    }
                }
            });
            //Create jwt token
            const accessToken = generateToken({userId: user.userId, email: user.email});
            logger.info(`User - ${email} and Organisation created`);
    
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
    
    async login_user(req:Request, res:Response) {
        
        const {email, password} = req.body;
        try {
            const user = await prisma.user.findUnique({ where: {email}});
            
            if (!user) {
                logger.warn('Failed Login Attempt!')
                return res.status(401).json({
                    "status": "Bad request",
                    "message": "Authentication Failed",
                    "statusCode": 401
                });
            }
    
            const correctPassword = await comparePassword(password, user.password);
    
            if (!correctPassword) {
                logger.warn(`Incorrect password for - ${email}`)
                return res.status(401).json({
                    "status": "Bad request",
                    "message": "Authentication Failed",
                    "statusCode": 401
                });
            }
    
            //create access token
            const accessToken = generateToken({userId: user.userId, email: user.email});
            logger.info(`${email} logged in successfully!`);
    
            return res.status(200).json({
                "stats": "success",
                "message": "Login successful",
                "data": {
                    "accessToken": accessToken,
                    "user": {
                        "userId": user.userId,
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "email": user.email,
                        "phone": user.phone
                    }
                }
            });
        } catch (error:any) {
            logger.error(`Error during login: ${error.message}`);
            return res.status(401).json({
                "status": "Bad request",
                "message": "Authentication Failed",
                "statusCode": 401
            });
        }
    
    }
    
}
