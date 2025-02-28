import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { SESSION_MAX_AGE } from 'src/libs/common/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);

  app.use(
    session({
      name: 'user_session',
      secret: configService.get<string>('session_secret_key') ?? '',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: SESSION_MAX_AGE,
        httpOnly: false,
        sameSite: 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const PORT = configService.get<number>('port') ?? 3001;

  const config = new DocumentBuilder()
    .setTitle('HOTEL MANAGEMENT BACKEND')
    .setDescription('Introduction to Software Engineering Project.')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1', app, documentFactory);

  await app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
});
