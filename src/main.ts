import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'process';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const DOC_API = await readFile(resolve(cwd(), 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);

  SwaggerModule.setup('doc', app, document);

  await app.listen(4000);
}
bootstrap();

