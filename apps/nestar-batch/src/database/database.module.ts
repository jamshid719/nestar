import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

//database connection
@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: () => ({
				uri: process.env.NODE_ENV === 'production' ? process.env.MONGO_PROD : process.env.MONGO_DEV,
			}), //NODE_ENV=production => package.json da yozilgan
		}),
	],
	exports: [MongooseModule],
})
export class DatabaseModule {
	constructor(@InjectConnection() private readonly connection: Connection) {
		if (connection.readyState === 1) {
			console.log(
				`MongoDB is connected into ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} db`,
			);
		} else {
			console.log('DB is not connected');
		}
	}
}
