import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { app } from '../src';


const prisma = new PrismaClient();


describe('POST /auth/register', () => {
    beforeAll(async () => {
        await prisma.userOrganisation.deleteMany();
        await prisma.organisation.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should register user successfully with default organization', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            phone: '1234567'
          };

        const res = await request(app)
            .post('/auth/register')
            .send(userData);
        
        expect(res.status).toBe(201);
        expect(res.body.data.user.email).toBe('john@example.com');
        expect(res.body.data.user.userId).toBeDefined()
        expect(res.body.data.user.firstName).toBe('John');
        expect(res.body.data.user.lastName).toBe('Doe');
        expect(res.body.data.user.phone).toBe('1234567');
        expect(res.body.data.accessToken).toBeDefined();
        
    });

    it('should log the user in successfully', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(200);
        expect(res.body.data.user.email).toBe('john@example.com');
        expect(res.body.data.user.userId).toBeDefined()
        expect(res.body.data.user.firstName).toBe('John');
        expect(res.body.data.user.lastName).toBe('Doe');
        expect(res.body.data.user.phone).toBe('1234567');
        expect(res.body.data.accessToken).toBeDefined();
    });

    it('should fail registration if firstName is missing', async () => {
        const userData = {
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        };
    
        const response = await request(app)
          .post('/auth/register')
          .send(userData);
    
        expect(response.status).toBe(422);
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].field).toBe('firstName');
        expect(response.body.errors[0].message).toBe('firstName is required');
      });
    
      it('should fail registration if lastName is missing', async () => {
        const userData = {
          firstName: 'John',
          email: 'john.doe@example.com',
          password: 'password123',
        };
    
        const response = await request(app)
          .post('/auth/register')
          .send(userData);
    
        expect(response.status).toBe(422);
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].field).toBe('lastName');
        expect(response.body.errors[0].message).toBe('lastName is required');
      });
    
      it('should fail registration if email is missing', async () => {
        const userData = {
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        };
    
        const response = await request(app)
          .post('/auth/register')
          .send(userData);
    
        expect(response.status).toBe(422);
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].field).toBe('email');
        expect(response.body.errors[0].message).toBe('email is required');
      });
    
      it('should fail registration if password is missing', async () => {
        const userData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        };
    
        const response = await request(app)
          .post('/auth/register')
          .send(userData);
    
        expect(response.status).toBe(422);
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].field).toBe('password');
        expect(response.body.errors[0].message).toBe('password is required');
      });

    it("should fail if there is a duplicate email", async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe("Email already exists");
    });
});

