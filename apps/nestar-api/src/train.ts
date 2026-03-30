console.log('TRAIN');
// TASK ZJ:
// Shunday function yozing, u berilgan array ichidagi
// raqamlarni qiymatini hisoblab qaytarsin.
// MASALAN: reduceNestedArray([1, [1, 2, [4]]]); return 8;
// Yuqoridagi misolda, array nested bo'lgan holdatda ham,
// bizning function ularning yig'indisini hisoblab qaytarmoqda.

type NestedArray = (number | NestedArray)[];

function reduceNestedArray(a: (number | NestedArray)[]): number {
	return a.reduce<number>((total, curValue) => {
		if (Array.isArray(curValue)) {
			return total + reduceNestedArray(curValue); // recursion
		}
		return total + curValue;
	}, 0);
}

console.log('MITASK-ZJ:', reduceNestedArray([1, [1, 2, [4]]]));
