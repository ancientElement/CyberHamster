import { Controller, Post, Body, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { ALLOW_REGISTER, REGISTER_PASSWORD, REGISTER_USER } from 'src/const';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private configService: ConfigService
  ) { }

  async onModuleInit() {
    const username = this.configService.get(REGISTER_USER);
    const password = this.configService.get(REGISTER_PASSWORD);
    if (username && password) {
      try {
        await this._register({ username, password });
        console.log(`User ${username} registered successfully.`);
      } catch (error) {
        console.error(`Failed to register user ${username}:`, error);
      }
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.databaseService.db.get<{ id: number, username: string, password: string }>('SELECT * FROM users WHERE username = ?', [body.username]);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!await this.authService.comparePassword(body.password, user.password)) {
      throw new UnauthorizedException('Incorrect password');
    }
    return this.authService.generateToken(user.id, user.username);
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    if (!this.configService.get<boolean>(ALLOW_REGISTER, false)) {
      throw new UnauthorizedException('Server not allowed to register');
    }
    await this._register(body);
  }

  private async _register(body: { username: string; password: string }) {
    const existingUser = await this.databaseService.db.get('SELECT * FROM users WHERE username = ?', [body.username]);
    if (existingUser) {
      throw new ConflictException('Username is already used');
    }
    const hashedPassword = await this.authService.hashPassword(body.password);
    await this.databaseService.db.run('INSERT INTO users (username, password) VALUES (?, ?)', [body.username, hashedPassword]);
    return { message: 'User registered successfully' };
  }
}