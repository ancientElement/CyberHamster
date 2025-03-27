import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtBlacklistService } from './jwt-blacklist.service';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET_KEY } from 'src/const';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'cyberhamster-jwt') {
  private readonly allowedAlgorithms = ['HS256'];
  constructor(
    private readonly jwtBlacklistService: JwtBlacklistService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_SECRET_KEY)!,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    const user = await this.databaseService.db.get<{ id: number, username: string, password: string }>('SELECT * FROM users WHERE id = ?', [payload.sub]);
    if (!user) {
      throw new UnauthorizedException('token invalid');
    }
    return { userId: payload.sub, username: payload.username };
  }
}