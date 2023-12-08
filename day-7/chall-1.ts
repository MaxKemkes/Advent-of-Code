import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const hands = readFileSync(path.resolve(__dirname, "puzzle.txt"), "utf-8").split(
	/\r\n/
    )
    .map(e => e.split(" "))
    .map(e => [e[0], Number(e[1])] as [string, number])

console.log(hands)

function returnCardRank(card: "A" | "K" | "Q" | "J" | "T" | string){

    if (card === "A") return 14
    if (card === "K") return 13
    if (card === "Q") return 12 
    if (card === "J") return 11 
    if (card === "T") return 10 

    return Number(card)
}

function returnHandScore(hand: string){
    const occurences: {[card: string]: number}  = {}

    for (let i = 0; i < hand.length; i++){
        if (!occurences[hand[i]]){
            occurences[hand[i]] = 0
        }
        occurences[hand[i]] += 1
    }

    // console.log(occurences)

    const values = Object.values(occurences)

    if (values.length === 1) return 6
    if (values.length === 2){
        if (values[0] === 4 || values[1] === 4) return 5
        return 4
    }
    if (values.length === 3){
        if (values[0] === 3 || values[1] === 3 ||  values[2] === 3) return 3;
        return 2
    }
    if (values.length ===4) return 1
    return 0
}

const score = returnHandScore(hands[0][0])
console.log(score)

const sorted = hands.sort((a, b) => {
    const aScore = returnHandScore(a[0])
    const bScore = returnHandScore(b[0])

    if (aScore > bScore) return 1
    if (aScore < bScore) return -1

    for (let i = 0; i < a[0].length; ++i){
        if (returnCardRank(a[0][i]) > returnCardRank(b[0][i])) return 1
        if (returnCardRank(a[0][i]) < returnCardRank(b[0][i])) return -1
    }

    return 0
})


const result = sorted.reduce((acc, curr, idx) => {
    return acc + (curr[1] * (idx +1 ))
}, 0)

console.log(result)