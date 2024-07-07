import jwt, { SignOptions, Secret } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || 'secret'

interface JwtPayload {
    userId: string;
    email: string;
}

//function to generate a JWT token
export const generateToken = (payload: JwtPayload, expiresIn: string = '1h') => {
    const optons: SignOptions = {expiresIn};
    return jwt.sign(payload, secretKey, optons)
}

// function to verify tokem
export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, secretKey) as JwtPayload
    } catch (error) {
        throw new Error('Invalid Token');
    }
};