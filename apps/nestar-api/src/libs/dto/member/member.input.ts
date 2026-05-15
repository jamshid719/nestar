import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { availableAgentSorts, availableMemberSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

/**SIGNUP_input */
@InputType() // FR => Backend ga kirayotgan datalar
export class MemberInput {
	@IsNotEmpty()
	@Length(3, 12) //min 3 letters, max 12 letters
	@Field(() => String) // string qaytaradi
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;

	@IsNotEmpty()
	@Field(() => String)
	memberPhone: string;

	@IsOptional()
	@Field(() => MemberType, { nullable: true }) //faqat uzida bor enumlarni qabul qila oladi, hamda optinal bulganligi un ham null bulishi mumkin.
	memberType?: MemberType;

	@IsOptional()
	@Field(() => MemberAuthType, { nullable: true })
	memberAuthType?: MemberAuthType;
}

/**LOGIN_input */
@InputType()
export class LoginInput {
	@IsNotEmpty()
	@Length(3, 12)
	@Field(() => String)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;
}

/**GETAGENT_input */
//shu qolip asnosida query va search mantiqlarni tawkil etish shart.
@InputType()
class AISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class AgentsInquiry {
	@IsNotEmpty()
	@Min(1) //berilgan qiymat 1 dan kichik bo‘lmasligini kk
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional() //agentlarni qaysi parametrlar orqali sorting mexanizmini amalga oshirish
	@IsIn(availableAgentSorts) //Isin degani shu arrayni ichidagi qiymatlarni qabul qiladi degani
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true }) //enum
	direction?: Direction;

	@IsNotEmpty() //search mantigi
	@Field(() => AISearch)
	search: AISearch;
}

/**ADMIN => getAllMemberByAdmin()*/
@InputType()
class MISearch {
	@IsOptional()
	@Field(() => MemberStatus, { nullable: true })
	memberStatus?: MemberStatus; // Admin har qanday memberStatusli memberlarni chaqirishi mumkin.

	@IsOptional()
	@Field(() => MemberType, { nullable: true })
	memberType?: MemberType; // Admin har qanday memberTypeli memberlarni chaqirishi mumkin.

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class MembersInquiry {
	@IsNotEmpty()
	@Min(1) //berilgan qiymat 1 dan kichik bo‘lmasligini kk
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn([availableMemberSorts])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => MISearch)
	search: MISearch;
}
