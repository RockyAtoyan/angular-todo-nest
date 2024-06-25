"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibService = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
let LibService = class LibService {
    generateTokens(payload) {
        return {
            accessToken: (0, jsonwebtoken_1.sign)(payload, process.env.ACCESS_SECRET, {
                expiresIn: '10s',
            }),
            refreshToken: (0, jsonwebtoken_1.sign)(payload, process.env.REFRESH_SECRET, {
                expiresIn: '2d',
            }),
        };
    }
    verifyAccessToken(token) {
        if (!token)
            throw new Error('no token');
        try {
            const data = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_SECRET);
            return typeof data === 'string' ? JSON.parse(data) : data;
        }
        catch (e) {
            console.log(e.message);
            throw new Error(e.message);
        }
    }
    verifyRefreshToken(token) {
        if (!token)
            return null;
        try {
            const data = (0, jsonwebtoken_1.verify)(token, process.env.REFRESH_SECRET);
            return typeof data === 'string' ? JSON.parse(data) : data;
        }
        catch (e) {
            console.log(e.message);
            return null;
        }
    }
    saveUserImage(image) { }
};
exports.LibService = LibService;
exports.LibService = LibService = __decorate([
    (0, common_1.Injectable)()
], LibService);
//# sourceMappingURL=lib.service.js.map