import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(
	path.resolve(__dirname, "quizz.txt"),
	"utf-8"
).split(/\r\n/).map(e => e.split(" ").map(n => Number(n)));

console.log(lines)

function returnNext(arr: number[]){
    const slope: number[] = []
    let allZeros = true

    for (let i  = 1; i < arr.length; ++i){
        const diff = arr[i] - arr[i-1]
        allZeros &&= (diff === 0)
        slope.push(arr[i] - arr[i-1])
    }

    if (allZeros) return arr[0]

    console.log("Slope", slope)
    return arr[0] - returnNext(slope)
}

const results:number[] = []
lines.forEach(e => {
    console.log(e)

    const result = returnNext(e)
    results.push(result)
    console.log("Res", result)
})

const sum = results.reduce((acc, curr) => {
    return acc + curr
}, 0)

console.log("Sum", sum)