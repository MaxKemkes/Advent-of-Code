import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lines = readFileSync(
	path.resolve(__dirname, "./cards.txt"),
	"utf-8"
).split(/\r\n/);


const games = lines.map(e => {
    const game =   e.substring(e.indexOf(": ")+ 2)

    const [_nums, _winning] = game.split(" | ")

    const nums = _nums.split(" ").map(n => Number(n)).filter(n => n > 0)
    const winning = _winning.split(" ").map((n) => Number(n)).filter(n => n > 0);

    return [nums, winning] as [number[], number[]]
})

function scorePerGame(game: [number[], number[]]) {
	const [nums, winning] = game;

    const winningCards = nums.filter(n => winning.find(e => e === n))

    // console.log(winningCards);

    const score = winningCards.length > 0 
        ? Math.pow(2, winningCards.length - 1)
        : 0

    return score
}
// console.log(games[0])

const sum = games.reduce((acc, curr) => {
    return acc + scorePerGame(curr)
}, 0)

console.log(sum)