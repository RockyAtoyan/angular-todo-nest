/// <reference types="multer" />
export declare class LibService {
    generateTokens(payload: any): {
        accessToken: string;
        refreshToken: string;
    };
    verifyAccessToken(token: any): any;
    verifyRefreshToken(token: any): any;
    saveUserImage(image: Express.Multer.File): void;
}
