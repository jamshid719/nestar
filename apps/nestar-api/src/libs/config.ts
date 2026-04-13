import { ObjectId } from 'bson';

export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank']; //memberAgentlarni shular buyicha sort qilish mexanizmi

export const availablMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];

export const shapeIntoMongooseObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
