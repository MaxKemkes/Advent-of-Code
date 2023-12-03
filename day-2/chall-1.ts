import {readFileSync} from "fs"

const lines = readFileSync("day-2/games.txt", "utf-8")
	.split(/\r\n/)
	.map((e) => {
        const list = e.split(": ")

        const num = Number(list[0].replace("Game ", ""))

        const sets = list[1].split("; ")

        return [num, sets]
    });


const filterFunc = ( list: string[]): boolean => {
    let cubes: [number, number, number] = [0 , 0, 0]

    list.forEach(el => {
        const gameSet = el.split(", ")

        gameSet.forEach(game = {
            if 
        })
    });
}
console.log(lines)
