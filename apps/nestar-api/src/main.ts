import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import * as express from 'express';
import { WsAdapter } from '@nestjs/platform-ws';

//Global Integration
async function bootstrap() {
	const app = await NestFactory.create(AppModule); //EXPRESS + NEST
	app.useGlobalPipes(new ValidationPipe()); //global validation DTO
	app.useGlobalInterceptors(new LoggingInterceptor()); //integration LogginInterception
	app.enableCors({ origin: true, credentials: true }); //ixtiyoriy domain req. larni serverga kirib kelishiga ruxsat berish.
	app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 })); //serverga kirib kelayotgan filelarga limitation joriy etish mantigi
	app.use('/uploads', express.static('./uploads')); //upload folderni tashqariga ochiqlash
	app.useWebSocketAdapter(new WsAdapter(app)); //TCP aloqa urnatish(real-time).
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
