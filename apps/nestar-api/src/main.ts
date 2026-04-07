import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//Global Integration
async function bootstrap() {
	const app = await NestFactory.create(AppModule); //EXPRESS + NEST
	app.useGlobalPipes(new ValidationPipe()); //global validation DTO
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
