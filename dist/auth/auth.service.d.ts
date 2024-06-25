/// <reference types="multer" />
/// <reference types="cookie-parser" />
import { LibService } from '../lib/lib.service';
import { DbService } from '../db/db.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
export declare class AuthService {
    private prisma;
    private lib;
    constructor(prisma: DbService, lib: LibService);
    registration(dto: RegistrationDto, image: Express.Multer.File): Promise<{
        id: string;
        login: string;
        image: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Response<any, Record<string, any>>;
    auth(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
