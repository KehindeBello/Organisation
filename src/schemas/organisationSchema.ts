import Joi from "joi";

export const organisationSchema =Joi.object({
    name: Joi.string().required(),
    description: Joi.string()
}).options({abortEarly: false})
