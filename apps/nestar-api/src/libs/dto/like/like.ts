import { Field, ObjectType } from '@nestjs/graphql';
import { LikeGroup } from '../../enums/like.enum';
import { ObjectId } from 'mongoose';

@ObjectType() //member malum birnarsaga like bosgan bosmaganligini tekshirish un ishlatiladigan DTO
export class MeLiked {
	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	likeRefId: ObjectId;

	@Field(() => Boolean)
	myFavorite: boolean;
}

@ObjectType() //bu like hosil bulganda ishlatiladigan DTO
export class Like {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => LikeGroup)
	likeGroup: LikeGroup;

	@Field(() => String)
	likeRefId: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
