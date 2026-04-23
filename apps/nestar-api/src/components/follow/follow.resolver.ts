import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Follower, Followers, Following, Followings } from '../../libs/dto/follow/follow';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongooseObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';

@Resolver()
export class FollowResolver {
	constructor(private readonly followService: FollowService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Follower)
	public async subscribe(
		@Args('input') input: string, //kimga subscribe buladigan memberning id isi.
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Follower> {
		console.log('Mutation: subscribe');
		const followingId = shapeIntoMongooseObjectId(input);
		return await this.followService.subscribe(memberId, followingId);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Follower)
	public async unsubscribe(
		@Args('input') input: string, //kimga subscribe buladigan memberning id isi.
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Follower> {
		console.log('Mutation: unsubscribe');
		const followingId = shapeIntoMongooseObjectId(input);
		return await this.followService.unsubscribe(memberId, followingId);
	}

	//member uzi kimlarga follow bulgan, shularni(followings) ruyxatini olish mantigi
	@UseGuards(WithoutGuard)
	@Query((returns) => Followings)
	public async getMemberFollowings(
		@Args('input') input: FollowInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Followings> {
		console.log('Query: getMemberFollowings');
		const { followerId } = input.search; //bu follower member id
		input.search.followerId = shapeIntoMongooseObjectId(followerId);
		return await this.followService.getMemberFollowings(memberId, input);
	}

	//memberga follow bulgan memberlar(follower)ning ruyxatini olish mantigi
	@UseGuards(WithoutGuard)
	@Query((returns) => Followers)
	public async getMemberFollowers(
		@Args('input') input: FollowInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Followers> {
		console.log('Query: getMemberFollowers');
		const { followingId } = input.search; //follow bulingan member idisi
		input.search.followingId = shapeIntoMongooseObjectId(followingId);
		return await this.followService.getMemberFollowers(memberId, input);
	}
}
