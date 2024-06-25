/// <reference types="multer" />
export declare class RegistrationDto {
    login: string;
    password: string;
    image?: Express.Multer.File;
}
