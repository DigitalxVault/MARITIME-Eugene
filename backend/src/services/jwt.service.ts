import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class JWTService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'default-access-secret';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '24h'; // Default 24 hours
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // Default 7 days

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.warn('⚠️  WARNING: Using default JWT secrets. Set JWT_SECRET and JWT_REFRESH_SECRET in production!');
    }
  }

  /**
   * Generate access token and refresh token pair
   */
  generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = jwt.sign(
      payload,
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiry } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      payload,
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiry } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token: string): JWTPayload | null {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  }
}

export const jwtService = new JWTService();
