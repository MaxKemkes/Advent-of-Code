import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { lcm } from "../lib/math";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(
	path.resolve(__dirname, "quizz.txt"),
	"utf-8"
).split(/\r\n/);

const instruction = lines[0]
const nodes_and_turns = lines.splice(2).reduce((acc: {
    [value: string]: [string, string]
}, curr) => {
    const node = curr.split(" = ") as [string, string]

    const [left, right] = node[1].replace(/(\(|\))/g, "").split(", ") as [string, string]

    acc[node[0]] = [left, right]
    return acc
}, {})

console.log(nodes_and_turns);


const startNodes = Object.keys(nodes_and_turns).filter((e) => e[2] === "A");
const stepsToZ: number[] = []

const pathsTaken: string[][] = []


for (let i = 0; i < startNodes.length; i++){
    let found = false
    let node = startNodes[i]
    let steps = 0
    const pathTaken = []
    while (!found) {

		const [left, right] = nodes_and_turns[node];

		const turn = instruction[steps % instruction.length];

		if (turn === "L") {
			node = left;
		}

		if (turn === "R") {
			node = right;
		}

		steps++;

		pathTaken.push(node);
		if (node[2] === "Z") {
            stepsToZ.push(steps)
			found = true;
		}
	}
    pathsTaken.push(pathTaken)
}


console.log(stepsToZ)

const solution = stepsToZ.reduce((acc, curr) => {
    return lcm(acc, curr)
}, 1)

console.log(solution)