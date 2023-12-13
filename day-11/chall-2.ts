import { writeFileSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fileName = "puzzle.txt"
var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(path.resolve(__dirname, fileName), "utf-8").split(
	/\r\n/
);

// console.log(lines)
const expansionMultiplier = (1_000_000 - 1);
const rowExpansions: number[] = []
const colExpansions: number[] = []

for (let i = 0; i < lines.length; ++i){
    if (/^(\.+)$/.test(lines[i])){
        rowExpansions.push(i)
    }
}

for (let i = 0; i < lines[0].length; ++i){
    const check = lines.every(e => e[i] === ".")
    if (check){
        colExpansions.push(i)
    }
}

console.log(colExpansions)

// writeFileSync(
// 	path.resolve(__dirname, "step2_" + fileName),
// 	lines.join("\r\n")
// );

const positions: [number, number][] = []

for (let i = 0; i < lines.length; ++i){
    for (let j = 0; j < lines[i].length; ++j){
        if (lines[i][j] === "#") positions.push([i, j])
    }
}

// console.log(positions)
const distances:number[] = []

function calcDistance(pointA: [number, number], pointB: [number, number]): number{
    const expansionRows = rowExpansions.filter(e => {
        const betweenALargerB = (e < pointA[0] && e > pointB[0])
        const betweenBLargerA = (e > pointA[0] && e < pointB[0])

        return betweenALargerB || betweenBLargerA;
    }).length
    const expansionCols = colExpansions.filter(e => {
        const betweenALargerB = (e < pointA[1] && e > pointB[1])
        const betweenBLargerA = (e > pointA[1] && e < pointB[1])
        return betweenALargerB || betweenBLargerA;
    }).length
    const dist =
		Math.max(
			Math.abs(pointA[0] - pointB[0]),
			Math.abs(pointB[0] - pointA[0])
		) +
		Math.max(
			Math.abs(pointA[1] - pointB[1]),
			Math.abs(pointB[1] - pointA[1])
		) +
		(expansionRows + expansionCols) * expansionMultiplier;

    return dist
}

for (let i = 0; i < positions.length; i++){
    for (let j = i; j < positions.length; j++){
        if (i === j) continue
        const dist = calcDistance(positions[i], positions[j]);
        distances.push(dist);
        console.log(`Dist Point ${i+1} to Point ${j+1} = ${dist}`)
    }
}

const distSum = distances.reduce((acc, curr) => (acc+curr), 0)

console.log("Sum of distances:", distSum)