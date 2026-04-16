import { ObjectId } from 'mongoose';

export interface T {
	[key: string]: any;
}

//Memberning datalarini tashqaridan manupulate qilish mantigi un.
export interface StatisticModifier {
	_id: ObjectId;
	targetKey: string;
	modifier: number;
} // BU interface ning ahamaiyat shundan iboratki, DB dagi ixtiyoriy collectionning documentini uzgartiriw un kk. Yani, _id => bu yerda documentning id si | targetKey => nimani uzgartirmoqchimiz(dataset ning nome) | modifier qanday qiymatda uzgartirmoqchimz.
