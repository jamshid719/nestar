import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ViewGroup } from '../../enums/view.enum';

@ObjectType()
export class View {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => ViewGroup)
	viewGroup: ViewGroup; //nima view bulayapti(membermi,articlemi, propertymi)

	@Field(() => String)
	viewRefId: ObjectId; //view bulayotgan (member yo article yoki property) id si

	@Field(() => String)
	memberId: ObjectId; //view qilayotgan memberning id si

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
