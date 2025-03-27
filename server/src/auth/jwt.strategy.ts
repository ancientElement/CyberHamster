import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtBlacklistService } from './jwt-blacklist.service';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET_KEY } from 'src/const';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'cyberhamster-jwt') {
  private readonly allowedAlgorithms = ['RS256'];

  constructor(
    private readonly jwtBlacklistService: JwtBlacklistService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_SECRET_KEY)!,
      algorithms: ['HS256'], // 只允许使用HS256算法
    });
  }

  async validate(payload: any, token: string) {
    // 检查token是否在黑名单中
    if (this.jwtBlacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token已被吊销');
    }

    // 检查算法是否在白名单中
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    if (!this.allowedAlgorithms.includes(decodedToken.alg)) {
      throw new UnauthorizedException('不支持的签名算法');
    }

    return { userId: payload.sub, username: payload.username };
  }
}