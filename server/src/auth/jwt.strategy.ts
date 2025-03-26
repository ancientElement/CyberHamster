import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'cyberhamster-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.argv[process.argv.indexOf('--secretKey') + 1], // 在生产环境中应该使用环境变量
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}