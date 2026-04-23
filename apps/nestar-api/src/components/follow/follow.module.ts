import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import FollowSchema from '../../schemas/Follow.model';
import { AuthModule } from '../auth/auth.module';

import { MemberModule } from '../member/member.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]), AuthModule, MemberModule],
	providers: [FollowResolver, FollowService],
	exports: [FollowService],
})
export class FollowModule {}

//Circular dependency(modullarni bir-biriga chaqirgan holdagi) xatoligini oldini olish un forwardRef foydalanib, forwardRef(() => MemberModule) qilib import qilamiz. lekin bu yuldan ketmaymiz, va biz mefollowed mantigini memberServiceda ishlatish un follow schema modelini tugridan tugri memberServicega integratisiyani amalga oshiramiz.
