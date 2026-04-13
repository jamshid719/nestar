import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongooseObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) /*call MemberService*/ {}

	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		//console.log('input:', input);
		return await this.memberService.signup(input);
	}

	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return await this.memberService.login(input);
	}

	//Authenticated
	@UseGuards(AuthGuard)
	@Mutation(() => Member) //GraphQL schema(frontend un)
	public async updateMember(
		@Args('input') input: MemberUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		//Type safety (backend un)
		console.log('Mutation: updateMember');
		delete input._id; //inputdan kelayotgan _id uchiramiz, sababi id ni @AuthMember olishimz sababli
		return await this.memberService.updateMember(memberId, input);
	} //@AuthMember custom param decoratorning ishlatish maqsadi, auth bulgan userning malumotlari updateMember() methodini ichida bizga kk buladi.

	//for Test
	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');
		console.log('memberNick:', memberNick);
		return `Hi, ${memberNick}`;
	}

	//for Test(Roles)
	@Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => String)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('Query: checkAuthRoles');
		// console.log('memberNick:', authMember.memberNick);
		return `Hi, ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
	}

	@UseGuards(WithoutGuard) //Auth member(ixtiyoriy member) bulsa bulmasa kngi bosqichga utkaz degani.
	@Query(() => Member)
	public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Query: getMember');
		const targetId = shapeIntoMongooseObjectId(input);
		return await this.memberService.getMember(memberId, targetId);
	}

	@UseGuards(WithoutGuard) //ixtiyoriy member ishlata oladibu apini
	@Query(() => Members)
	public async getAgents(@Args('input') input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
		console.log('Query: getAgents');
		return await this.memberService.getAgents(memberId, input);
	}

	/**ADMIN */
	//admin ishlatadigan projectning api bu
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Members)
	public async getAllMemberByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
		//bu yerga Admin id si kk bulmaydi.
		return await this.memberService.getAllMemberByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Member)
	public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
		console.log('Mutation: updateMemberByAdmin');
		return await this.memberService.updateMemberByAdmin(input);
	}
}
