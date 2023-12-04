import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Queue from "../lib/queue";

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


// console.log(games[0])


function processDeck(deck: [number[], number[]][]){
    const queue = new Queue<[number, [number[],number[]]]>()
    deck.forEach((el, idx) => queue.enqueue([idx, el]))
    const result: number[] = [] 
    const cache: { [game: number]: [number, [number[], number[]]][] } = {};
    let scratchards = 0;

    function scorePerGame(game: [number[], number[]]) {

        const [nums, winning] = game;

        const winningCards = nums.filter(n => winning.find(e => e === n))

        // console.log(winningCards);
        return winningCards.length
    }

    while(queue.length > 0){
        const [idx, game] = queue.deque();
        // console.log("iterations", iterations)
        // console.log(stack)
        // console.log(idx, game)
        result[idx] = result[idx] ? result[idx] + 1 : 1;
        if (idx === undefined){
            break
        }

        // if (idx === 13) console.log(scorePerGame(game))

        scratchards += 1;
        if (scratchards % 10_000 === 0) console.log(".".repeat(Math.floor(scratchards / 10_000) ))
        if (!cache[idx]){
            const winnings = scorePerGame(game)
            const results = []
            for (let i = 1; i <= winnings; i++){
                if (deck[idx +i]){

                    results.push([idx + i, deck[idx+i]])
                }
            }

            cache[idx] = results
            // console.log(results);
        } 
        
        if (cache[idx]){
            // console.log("pushing to stack")
            queue.enqueue(...cache[idx])
        }
        

    }

    console.log(result)
    console.log(scratchards)
};

processDeck(games)