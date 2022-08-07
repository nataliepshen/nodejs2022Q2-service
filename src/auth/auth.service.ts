import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as argon from 'argon2';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService) {}

  async signup(createUserDto: CreateUserDto): Promise<string> {
    const hash = await argon.hash(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: hash,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    return 'Signup was successful';
  }

  async login(createUserDto: CreateUserDto): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: {
        login: createUserDto.login,
      },
    });
    if (!user) throw new ForbiddenException('Access denied');

    const passwordMatches = await argon.verify(user.password, createUserDto.password);
    if (!passwordMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRtHash(userId: string, rt:string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getTokens(userId: string, login: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
        userId: userId,
        login,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          userId: userId,
          login,
          },
          {
            secret: process.env.JWT_SECRET_REFRESH_KEY,
            expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
          },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    }
  }
}