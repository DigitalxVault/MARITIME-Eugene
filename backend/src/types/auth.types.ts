import { Request } from 'express';
import { JWTPayload } from '../services/jwt.service';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}