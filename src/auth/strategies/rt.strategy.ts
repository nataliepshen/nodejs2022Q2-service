import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types/JwtPayload.type";
import { Request } from 'express';


@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_REFRESH_KEY,
            passReqToCallback: true,
        });
    }
    validate(req: Request, payload: JwtPayload) {
        const refreshToken = req
          ?.get('authorization')
          ?.replace('Bearer', '')
          .trim();
    
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    
        return {
          ...payload,
          refreshToken,
        };
      }
}