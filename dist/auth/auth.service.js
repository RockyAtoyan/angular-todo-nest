"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const lib_service_1 = require("../lib/lib.service");
const db_service_1 = require("../db/db.service");
const bcrypt_1 = require("bcrypt");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(prisma, lib) {
        this.prisma = prisma;
        this.lib = lib;
    }
    async registration(dto, image) {
        const { login, password } = dto;
        const isExist = await this.prisma.user.findUnique({
            where: { login },
        });
        if (isExist) {
            throw new common_1.BadRequestException('User already exists!');
        }
        const id = (0, uuid_1.v4)();
        const user = await this.prisma.user.create({
            data: {
                id,
                login,
                password: (0, bcrypt_1.hashSync)(password, 7),
                image: image && image.size
                    ? process.env.BASE_URL +
                        `/${id}.${image.originalname.split('.').slice(-1)[0]}`
                    : null,
            },
        });
        if (image) {
            this.lib.saveUserImage(image);
        }
        const { password: pass, ...rest } = user;
        return rest;
    }
    async login(dto, res) {
        const { login, password } = dto;
        const user = await this.prisma.user.findUnique({
            where: { login },
            include: {
                todos: {
                    where: {
                        roomId: null,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        tasks: {
                            orderBy: {
                                order: 'desc',
                            },
                            include: {
                                todo: true,
                            },
                        },
                        user: true,
                    },
                },
                rooms: true,
                adminRooms: true,
                orders: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        invited: true,
                        room: {
                            include: {
                                admin: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('User does not exist!');
        }
        const isCompare = (0, bcrypt_1.compareSync)(password, user.password);
        if (!isCompare) {
            throw new common_1.BadRequestException('Incorrect password!');
        }
        const { accessToken, refreshToken } = this.lib.generateTokens({
            login,
            id: user.id,
        });
        res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 48 });
        const { password: pass, ...rest } = user;
        return res.json({ user: rest, accessToken });
    }
    logout(res) {
        res.clearCookie('refreshToken');
        return res.json('ok');
    }
    async auth(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const data = this.lib.verifyRefreshToken(refreshToken);
            if (!data) {
                throw new common_1.UnauthorizedException('refresh_token');
            }
            const { accessToken } = this.lib.generateTokens({
                login: data.login,
                id: data.id,
            });
            const user = await this.prisma.user.findUnique({
                where: { id: data.id },
                include: {
                    todos: {
                        where: {
                            roomId: null,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                        include: {
                            tasks: {
                                orderBy: {
                                    order: 'desc',
                                },
                                include: {
                                    todo: true,
                                },
                            },
                            user: true,
                        },
                    },
                    rooms: true,
                    adminRooms: true,
                    orders: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        include: {
                            invited: true,
                            room: {
                                include: {
                                    admin: true,
                                },
                            },
                        },
                    },
                },
            });
            const { password, ...rest } = user;
            return res.json({ user: rest, accessToken });
        }
        catch (e) {
            console.log(e.message);
            throw new common_1.UnauthorizedException('refresh_token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService,
        lib_service_1.LibService])
], AuthService);
//# sourceMappingURL=auth.service.js.map