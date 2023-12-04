import loadQuizzContent from "../lib/load-quizz";

const lines = loadQuizzContent("./games.txt")
	.split(/\r\n/)
	.map((e) => {
		const list = e.split(": ");

		const num = Number(list[0].replace("Game ", ""));

		const sets = list[1].split("; ");

		return [num, sets] as [number, string[]];
	});

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

type Color = "red" | "green" | "blue";

const filterFunc = (list: string[]): boolean => {
	let cubes: [number, number, number] = [0, 0, 0];

	list.forEach((el) => {
		const gameSet = el.split(", ");

		gameSet.forEach((game) => {
			const [num, color] = game.split(" ") as [string, Color];

			if (color === "red") cubes[0] = Math.max(cubes[0], Number(num));
			if (color === "green") cubes[1] = Math.max(cubes[1], Number(num));
			if (color === "blue") cubes[2] = Math.max(cubes[2], Number(num));
		});
	});
	if (cubes[0] > maxRed || cubes[1] > maxGreen || cubes[2] > maxBlue)
		return false;

	return true;
};

const filtered = lines.filter((e) => filterFunc(e[1]));

const sum = lines.reduce((acc, curr) => {
	let cubes: [number, number, number] = [0, 0, 0];

	curr[1].forEach((el) => {
		const gameSet = el.split(", ");

		gameSet.forEach((game) => {
			const [num, color] = game.split(" ") as [string, Color];

			if (color === "red") cubes[0] = Math.max(cubes[0], Number(num));
			if (color === "green") cubes[1] = Math.max(cubes[1], Number(num));
			if (color === "blue") cubes[2] = Math.max(cubes[2], Number(num));
		});
	});

	return acc + cubes[0] * cubes[1] * cubes[2];
}, 0);
console.log(sum);
