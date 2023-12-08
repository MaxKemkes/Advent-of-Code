import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

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


let found = false
let steps = 0
let node = "AAA"


const pathTaken = [node]
while(!found){
    const [left, right] = nodes_and_turns[node]

    const turn = instruction[ steps % instruction.length]

    if(turn === "L"){
        node = left
    }

    if (turn === "R"){
        node = right
    }

    steps++;

    pathTaken.push(node);
    if (node === "ZZZ"){
        found = true
    }
}

console.log(steps, pathTaken);


