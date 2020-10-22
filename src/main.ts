import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from "config";

async function bootstrap() {
  const {port, origin} = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin });
    logger.log(`Accepting requests from origin "${origin}"`);
  }
  const serverport = process.env.PORT || port;
  await app.listen(port);
  logger.log(`Application listening on port ${serverport}`)
}
bootstrap();
