import jwt, { SignOptions} from "jsonwebtoken";
import { UserJwtPayload } from "../../interfaces/customRequest";

const secretKey = process.env.JWT_SECRET || 'secret'

//function to generate a JWT token
export const generateToken = (payload: UserJwtPayload, expiresIn: string = '1h') => {
    const optons: SignOptions = {expiresIn};
    return jwt.sign(payload, secretKey, optons)
}

// function to verify tokem
export const verifyToken = (token: string): UserJwtPayload => {
    try {
        return jwt.verify(token, secretKey) as UserJwtPayload
    } catch (error) {
        throw new Error('Invalid Token');
    }
};