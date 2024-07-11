import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(422).json({
                "errors": error.details.map((detail: { path: Array<any>,  message: string; }) => ({
                    field: detail.path.join(','),
                    message: detail.message.replace(/\"/g, '')
                }))
            })
        }
        next();
    }
}