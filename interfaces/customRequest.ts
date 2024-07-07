import { UserJwtPayload } from './userJwtPayload';


declare module 'express-serve-static-core' {
  interface Request {
    user?: UserJwtPayload;
  }
}

export { UserJwtPayload };
