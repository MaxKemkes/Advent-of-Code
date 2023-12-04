import loadQuizzContent from "../lib/load-quizz";

const lines = loadQuizzContent("./cards.txt").split(/\r\n/)

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