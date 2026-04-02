import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//Global Integration
async function bootstrap() {
	const app = await NestFactory.create(AppModule); //EXPRESS + NEST
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
