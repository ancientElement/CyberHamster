import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AuthController } from './auth/auth.controller';

async function bootstrap() {
  if (process.argv.includes('--secretKey')) {
    const _secretKey = process.argv[process.argv.indexOf('--secretKey') + 1];
    console.log('secretKey:', _secretKey);
  } else {
    console.error('secretKey is not set, please set it with --secretKey <secretKey>');
    return;
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:8081', 'http://10.152.119.107:8081','http://47.101.61.188:6531'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  let port = 3000;
  if (process.argv.includes('--port')) {
    port = Number(process.argv[process.argv.indexOf('--port') + 1]);
  }
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);

  const authController = app.get(AuthController);
  if (process.argv.includes('--register')) {
    const username = process.argv[process.argv.indexOf('--register') + 1];
    const password = process.argv[process.argv.indexOf('--register') + 2];
    try {
      await authController.register({ username, password });
      console.log(`User ${username} registered successfully.`);
    } catch (error) {
      console.error(`Failed to register user ${username}:`, error);
    }
  }
}

bootstrap();
