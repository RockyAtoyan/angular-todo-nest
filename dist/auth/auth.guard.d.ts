import { CanActivate, ExecutionContext } from '@nestjs/common';
import { LibService } from '../lib/lib.service';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: LibService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
