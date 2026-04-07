import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

//Global Integration
async function bootstrap() {
	const app = await NestFactory.create(AppModule); //EXPRESS + NEST
	app.useGlobalPipes(new ValidationPipe()); //global validation DTO
	app.useGlobalInterceptors(new LoggingInterceptor()); //integration LogginInterception
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
