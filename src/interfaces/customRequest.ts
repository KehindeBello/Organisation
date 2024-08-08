import { UserJwtPayload } from './userJwtPayload';

declare module 'express' {
  interface Request {
    user?: UserJwtPayload;
  }
}