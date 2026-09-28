import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-only-secret-change-me',
    });
  }

  validate(payload: { sub: string; email: string }) {
    if (!this.userService.existById(payload.sub)) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
