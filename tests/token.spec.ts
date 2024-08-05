import { UserJwtPayload } from "../src/interfaces/userJwtPayload"
import { generateToken, verifyToken } from "../src/utils/jwt";


describe('Token Generation', () => {

    const user: UserJwtPayload = {
        userId: '123456',
        email: 'test@example.com'
    };
    

    it('should contain correct user details in the token', () => {
        const token = generateToken(user)
        const decoded = verifyToken(token) 

        expect(decoded).toMatchObject(user);
    });

    it('should expire at the right time', () => {

        const token = generateToken(user, '2h');
        const decoded = verifyToken(token)
        
        const now = Math.floor(Date.now() / 1000);
        expect(decoded.exp).toBeGreaterThan(now + 1 * 60 * 60); // 1 hour from now
        expect(decoded.exp).toBeLessThanOrEqual(now + 2 * 60 * 60) //2hrs from now
    })
})