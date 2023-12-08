import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(path.resolve(__dirname, "input.txt"), "utf-8").split(
	/\r\n/
);

// console.log(lines)

const time = lines[0].split(/(\ )/g).map(n => Number(n)).filter(n => n > 0)
const distance = lines[1].split(/(\ )/g).map(n => Number(n)).filter(n => n > 0)
console.log(time)
console.log(distance)

const possibilities: number[] = []

//function for getting same time is d = x (t -x) => d = -x² + tx
// ==> solve for 0 = (-t ± SQRT(t² -4d))/(-2)

function solveMitternachtFormula(time:number, distance:number){

    const x1 = (-time - Math.sqrt(Math.pow(time, 2) - 4*distance))/(-2)
    const x2 = (-time + Math.sqrt(Math.pow(time, 2) - 4*distance))/(-2)

    return [x1, x2]
}

for (let i = 0; i < time.length; ++i){
    const [x1, x2] = solveMitternachtFormula(time[i], distance[i])

    //how many integers are between x1 and x2 => RoundUp(x1 -1) - RoundDown(x2+1) +1
    possibilities.push((Math.ceil(x1 -1) - Math.floor(x2 + 1) + 1))
}

console.log(possibilities)

const product = possibilities.reduce((acc, curr) => {
    return acc * curr
}, 1)

console.log(product)