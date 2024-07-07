import { genSalt, hash, compare } from "bcrypt";
const salt_rounds: number = 10


export const hashPassword = async ( password: string ): Promise<string> => {
    const salt = await genSalt(salt_rounds)
    return await hash(password,salt)
}

//compare password
export const comparePassword = async (password: string, hashedPassword: string) => {
    return await compare( password, hashedPassword)
}