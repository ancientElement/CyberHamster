import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private databaseService: DatabaseService) { }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.databaseService.db.get<{ id:number,username: string, password: string }>('SELECT * FROM users WHERE username = ?', [body.username]);
    if (user && await this.authService.comparePassword(body.password, user.password)) {
      return this.authService.generateToken(user.id, user.username);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const hashedPassword = await this.authService.hashPassword(body.password);
    await this.databaseService.db.run('INSERT INTO users (username, password) VALUES (?, ?)', [body.username, hashedPassword]);
    return { message: 'User registered successfully' };
  }
}