import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LibService } from '../lib/lib.service';
import { DbService } from '../db/db.service';
import { RegistrationDto } from './dto/registration.dto';
import { hashSync, compareSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DbService,
    private lib: LibService,
  ) {}

  async registration(dto: RegistrationDto, image: Express.Multer.File) {
    const { login, password } = dto;
    const isExist = await this.prisma.user.findUnique({
      where: { login },
    });
    if (isExist) {
      throw new BadRequestException('User already exists!');
    }
    const id = uuid();
    const user = await this.prisma.user.create({
      data: {
        id,
        login,
        password: hashSync(password, 7),
        image:
          image && image.size
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

  async login(dto: LoginDto, res: Response) {
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
      throw new BadRequestException('User does not exist!');
    }
    const isCompare = compareSync(password, user.password);
    if (!isCompare) {
      throw new BadRequestException('Incorrect password!');
    }
    const { accessToken, refreshToken } = this.lib.generateTokens({
      login,
      id: user.id,
    });
    res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 48 });
    const { password: pass, ...rest } = user;
    return res.json({ user: rest, accessToken });
  }

  logout(res: Response) {
    res.clearCookie('refreshToken');
    return res.json('ok');
  }

  async auth(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const data = this.lib.verifyRefreshToken(refreshToken);
      if (!data) {
        throw new UnauthorizedException('refresh_token');
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
    } catch (e) {
      console.log(e.message);
      throw new UnauthorizedException('refresh_token');
    }
  }
}
