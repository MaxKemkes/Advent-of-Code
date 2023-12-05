import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function loadQuizzContent(fileName: string) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return readFileSync(path.resolve(__dirname, fileName), "utf-8");
}

const dict: {[key:string]: string[]} = {}

const position: number[] = []
loadQuizzContent("./puzzle.txt").split(/\r\n\r\n/g).forEach(e => {
    const [key, val] = e.split(":")

    if (key === "seeds"){
        position.push(...val.split(" ").map(n => Number(n)))
        return
    }

    dict[key] = val.split(/\r\n/g).filter(e => e !=="");

    // return dict
})

// .split(/\r\n/g);
function translatePosition(map: string[], position: number[]){

    
    for (let i = 0; i < position.length; i++){
        let changed = false
        for (let j = 0; j < map.length && !changed; j++){
            const [destination, start, range] = map[j].split(" ").map(n => Number(n)) as [number, number, number]
            if (position[i] >= start && position[i] < (start + range)){
                position[i] = destination + position[i] - start
                // console.log("new Pos ", position[i])
                changed = true
            }
        } 
    }
        // console.log(position)

    return position
}

for (const [key, value] of Object.entries(dict)){
    console.log(key)
    const newPos = translatePosition(value, position)
    console.log(newPos)
}

console.log("Min:", Math.min(...position))