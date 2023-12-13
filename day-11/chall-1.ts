import { writeFileSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fileName = "example.txt"
var __dirname = path.dirname(fileURLToPath(import.meta.url));
let lines = readFileSync(path.resolve(__dirname, fileName), "utf-8").split(
	/\r\n/
);

const multiplier = 2
console.log(lines)

for (let i = 0; i < lines.length; ++i){
    if (/^(\.+)$/.test(lines[i])){
        const temp: string[] = new Array(multiplier).fill(lines[i])
        // console.log(temp.length)
        const linesTemp = lines.slice(i + 1)
        lines = lines
			.slice(0, i)
			.concat(temp)
			.concat(linesTemp);
        // console.log(lines.length)
        i += multiplier -1;
    }
}


for (let i = 0; i < lines[0].length; ++i){
    const check = lines.every(e => e[i] === ".")
    console.log(i, lines[0].length)
    if (check){
        for (let j = 0; j < lines.length; ++j){
                const str =
                    lines[j].slice(0, i) +
                    ".".repeat(multiplier) +
                    lines[j].slice(i + 1);
                // console.log(str)
                lines[j] =
                    str
            
            // console.log("Line #", j, lines[j])
            // console.log("i:", i, "j:",j)
        }
        i += multiplier -1;
    }
}

writeFileSync(
	path.resolve(__dirname, "step1_" + fileName),
	lines.join("\r\n")
);

const positions: [number, number][] = []

for (let i = 0; i < lines.length; ++i){
    for (let j = 0; j < lines[i].length; ++j){
        if (lines[i][j] === "#") positions.push([i, j])
    }
}

console.log(positions)
const distances:number[] = []

for (let i = 0; i < positions.length; i++){
    for (let j = i; j < positions.length; j++){
        if (i === j) continue
        const dist =
			Math.abs(positions[i][0] - positions[j][0]) +
			Math.abs(positions[i][1] - positions[j][1]);
        distances.push(dist);
        console.log(`Dist Point ${i+1} to Point ${j+1} = ${dist}`)
    }
}

const distSum = distances.reduce((acc, curr) => (acc+curr), 0)

console.log("Sum of distances:", distSum)