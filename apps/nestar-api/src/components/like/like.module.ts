import { Module } from '@nestjs/common';
import LikeSchema from '../../schemas/Like.model';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }])],
	providers: [LikeService],
	//Bu modelning xususiyati shundan iboratki, faqat likeService modeli buladi, resolveri bulmaydi, sababi Like modulega tegishli bulgan tugridan tugri graphQL apilar kk bulmaydi(uni urniga , agar memberlarga oid like buladigan bulsa, uni memberServicening ichida graphql apilarni hosil qilamiz.). Bular bowqa modullarning mantigi un xizmatga keladi.
	exports: [LikeService],
})
export class LikeModule {}
