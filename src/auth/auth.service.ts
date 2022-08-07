import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './types/JwtPayload.type';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService) {}

  async signup(createUserDto: CreateUserDto): Promise<string> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
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

  async login(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        login: createUserDto.login,
      },
    });
    if (!user) throw new ForbiddenException('Access denied');

    const passwordMatches = await bcrypt.compare(createUserDto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(rt: string) {
    const decoded = this.jwtService.decode(rt);
    const userId = decoded['userId'];
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRtHash(userId: string, rt:string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getTokens(userId: string, login: string) {
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
    };
  }
}