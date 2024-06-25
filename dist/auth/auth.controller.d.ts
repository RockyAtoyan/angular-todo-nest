/// <reference types="multer" />
/// <reference types="cookie-parser" />
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registration(file: Express.Multer.File, dto: RegistrationDto): Promise<{
        id: string;
        login: string;
        image: string;
    }>;
    login(res: Response, dto: LoginDto): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Response<any, Record<string, any>>;
    auth(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
