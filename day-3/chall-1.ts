import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(path.resolve(__dirname,"schematic.txt"), "utf-8")
    .split(/\r\n/);

function numberTuples(str: string) {
	const regEx = /\d*/g;

	const numTuple: [string, number][] = [...str.matchAll(regEx)]
		.filter((e) => e[0] !== "")
		.map((e) => [e[0], e.index]);

	return numTuple;
}

function specialCharTuples(str: string) {
	const regex = /[^\.|\d]/g;

	const specialCharTuple: [string, number][] = [...str.matchAll(regex)]
		.filter((e) => e[0] !== "")
		.map((e) => [e[0], e.index]);

	// console.log(specialCharTuple)
	return specialCharTuple;
}

const numTupleArray = lines.map((e) => numberTuples(e));
const specialCharTupleArray = lines.map((e) => specialCharTuples(e));

function checkAdjacecncy(
	nums: [string, number][][],
	specialChars: [string, number][][]
) {
	const maxLen = nums.length - 1;
	const adj: [string, number][][] = [];
	for (let i = 0; i < nums.length; i++) {
		adj[i] = nums[i].filter((e) => {
			const above = specialChars[Math.max(0, i - 1)].some(
				(char) =>
					Math.max(e[1] - 1, 0) <= char[1] &&
					char[1] <= e[1] + e[0].length
			);
			const inline = specialChars[i].some(
				(char) => e[1] - 1 === char[1] || char[1] === e[1] + e[0].length
			);
			const below = specialChars[Math.min(maxLen, i + 1)].some(
				(char) =>
					Math.max(e[1] - 1, 0) <= char[1] &&
					char[1] <= e[1] + e[0].length
			);

			return above || inline || below;
		});
	}
	return adj;
}

const adjacentNumbers = checkAdjacecncy(numTupleArray, specialCharTupleArray);
// console.log(adjacentNumbers.slice(0,5))
// console.log(calcSum(adjacentNumbers.slice(0,5)))

function calcSum(nums: [string, number][][]) {
	return nums.reduce((acc, curr) => {
		const lineSum = curr.reduce((acc1, curr1) => {
			return acc1 + Number(curr1[0]);
		}, 0);
		console.log(lineSum);
		return acc + lineSum;
	}, 0);
}

const sum = calcSum(adjacentNumbers);
console.log(sum);
