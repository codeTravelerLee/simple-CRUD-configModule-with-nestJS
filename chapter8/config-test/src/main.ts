import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? port);
  console.log(`server is running on port:${process.env.PORT || port}`);
}
bootstrap();
