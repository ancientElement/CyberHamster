import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { AuthController } from './auth/auth.controller';

export let secretKey = 'your-secret-key';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:8081','http://10.152.119.107:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  secretKey = process.env.SECRETKEY ?? secretKey;
  await app.listen(process.env.PORT ?? 3000);

  const authController = app.get(AuthController);
  if (process.env.REGISTERNAME && process.env.REGISTERPASSWORD) {
    const username = process.env.REGISTERNAME;
    const password = process.env.REGISTERPASSWORD;
    try {
      await authController.register({ username, password });
      console.log(`User ${username} registered successfully.`);
    } catch (error) {
      console.error(`Failed to register user ${username}:`, error);
    }
  }
}

bootstrap();
