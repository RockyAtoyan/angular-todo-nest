import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class LibService {
  generateTokens(payload: any) {
    return {
      accessToken: sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: '1d',
      }),
      refreshToken: sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: '2d',
      }),
    };
  }

  verifyAccessToken(token) {
    if (!token) throw new Error('no token');
    try {
      const data = verify(token, process.env.ACCESS_SECRET);
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  verifyRefreshToken(token) {
    if (!token) return null;
    try {
      const data = verify(token, process.env.REFRESH_SECRET);
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  saveUserImage(image: Express.Multer.File) {}
}
