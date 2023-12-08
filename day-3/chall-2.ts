import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(
	path.resolve(__dirname, "schematic.txt"),
	"utf-8"
).split(/\r\n/);

function numberTuples(str: string) {
	const regEx = /\d*/g;

	const numTuple: [string, number][] = [...str.matchAll(regEx)]
		.filter((e) => e[0] !== "")
		.map((e) => [e[0], e.index]);

	return numTuple;
}

function specialCharTuples(str: string) {
	const regex = /\*/g;

	const specialCharTuple: [string, number][] = [...str.matchAll(regex)]
		.filter((e) => e[0] !== "")
		.map((e) => [e[0], e.index]);

	// console.log(specialCharTuple)
	return specialCharTuple;
}

const numTupleArray = lines.map((e) => numberTuples(e));
const starCharTupleArray = lines.map((e) => specialCharTuples(e));

// console.log(starCharTupleArray)

function calcGearFactor(
	nums: [string, number][][],
	specialChars: [string, number][][]
) {
	const maxLen = specialChars.length - 1;
	const adj: number[][] = [];
	for (let i = 0; i < specialChars.length; i++) {
		adj[i] = specialChars[i].map((e) => {
			var above: [string, number][] = [];
			var below: [string, number][] = [];
			if (i > 0)
				[
					(above = nums[Math.max(0, i - 1)].filter(
						(n) =>
							!(
								n[1] + n[0].length - 1 < e[1] - 1 ||
								n[1] > e[1] + 1
							)
					)),
				];
			// console.log(i)
			// console.log(nums[i])
			console.log(e);
			const inline = nums[i].filter(
				(n) => e[1] - 1 === n[1] + n[0].length - 1 || e[1] + 1 === n[1]
			);
			if (i < specialChars.length - 1) {
				below = nums[Math.min(maxLen, i + 1)].filter(
					(n) =>
						!(n[1] + n[0].length - 1 < e[1] - 1 || n[1] > e[1] + 1)
				);
			}

			console.log(above);
			console.log(inline);
			console.log(below);
			if (above.length + inline.length + below.length === 2) {
				const nums = [...above, ...inline, ...below];
				return nums.reduce((acc, curr) => {
					return acc * Number(curr[0]);
				}, 1);
			}
			return 0;
		});
	}
	return adj;
}

const gearFactor = calcGearFactor(numTupleArray, starCharTupleArray);
// const gearFactor = calcGearFactor(numTupleArray.slice(0,5), starCharTupleArray.slice(0,5))
console.log(gearFactor[1]);
console.log(gearFactor.slice(0, 5));
console.log(calcSum(gearFactor.slice(0, 5)));

function calcSum(nums: number[][]) {
	return nums.reduce((acc, curr) => {
		const lineSum = curr.reduce((acc1, curr1) => {
			return acc1 + curr1;
		}, 0);
		// console.log(lineSum);
		return acc + lineSum;
	}, 0);
}

const sum = calcSum(gearFactor);
console.log(sum);
