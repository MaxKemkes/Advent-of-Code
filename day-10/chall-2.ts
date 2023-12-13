import fs, { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Queue from "../lib/queue";

const file = "quizz.txt"

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(path.resolve(__dirname, file), "utf-8")
  .split(/\r\n/)

type NodeValue = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S" 

type GraphNode = {
    value: NodeValue,
    position: [number, number],
    to: [number, number][]
}
const graph: GraphNode[][] = []
let start:GraphNode;
for(let i = 0; i < lines.length; ++i){
    const row:GraphNode[] = []
    for (let j = 0; j < lines[i].length; ++j){
        const value = lines[i][j] as NodeValue
        // console.log(value)
        const to:[number, number][] = []

        switch(value){
            case "|":
                if(i > 0 && i < lines.length -1 ){
                    to.push([i-1, j])
                    to.push([i+1, j])
                }
                break;
            case "-":
                if(j > 0 && j < lines[i].length -1){
                    to.push([i, j-1])
                    to.push([i, j+1])
                }
                break;
            case "L":
                if (i > 0 && j < lines[i].length-1){
                    to.push([i-1, j])
                    to.push([i, j +1])
                }
                break;
            case "J":
                if (i > 0 && j > 0){
                    to.push([i-1, j])
                    to.push([i, j - 1])
                }
                break;
            case "7":
                if (i < lines.length - 1 && j > 0){
                    to.push([i, j-1])
                    to.push([i +1, j])
                }
                break;
            case "F":
                if(i < lines.length - 1 && j < lines[i].length -1){
                    to.push([i, j+1])
                    to.push([i +1, j])
                }
                break;
            case ".":
                break;
            case "S":
                //check nort
                if(i > 0){
                    console.log("North")
                    if (lines[i-1][j] === "|" && i > 1){
                        to.push([i - 1, j])
                    }
                    if (lines[i-1][j] === "F" && j < lines[i].length-1){
                        to.push([i -1, j])
                    }
                    if (lines[i-1][j] === "7" && j > 0){
                        to.push([i -1, j])
                    }
                }
                //check south
                if(i < lines.length- 2){
                    console.log("South")
                    if (lines[i + 1][j] === "|" && i < lines.length - 2){
                        to.push([i + 1, j])
                    }
                    if (lines[i+1][j] === "L" && j < lines[i].length- 1){
                        to.push([i + 1, j])
                    }
                    if (lines[i+1][j] === "J" && j > 0){
                        to.push([i + 1, j])
                    }
                }
                //check west
                if (j > 0){
                    console.log("Wesst")
                    if (lines[i][j -1] === "-" && j > 1){
                        to.push([i, j -1])
                    }
                    if (lines[i][j -1] === "L" && i > 0){
                        to.push([i, j -1])
                    }
                    if (lines[i][j -1] === "F" && i < lines.length - 1){
                        to.push([i, j -1])
                    }
                }
                //check east
                if (j < lines[i].length - 1){
                        console.log("East")
                    if (lines[i][j + 1] === "-" && j < lines[i].length - 2){
                        to.push([i, j +1])
                    }
                    if (lines[i][j + 1] === "J" && i > 0){
                        to.push([i, j +1])
                    }
                    if (lines[i][j + 1] === "7" && i < lines.length - 1){
                        to.push([i, j +1])
                    }
                }
                start = {value: value, position: [i,j], to: to}
                break;
        }
        row.push({value: value, position:[i,j], to: to})
    }
    graph.push(row)
}

// console.log(graph)
// console.log(start)

function walk(graph: GraphNode[][], curr: GraphNode, steps: number, dist: number[][], queue: GraphQueue){
    // console.log(curr)

    if (dist[curr.position[0]][curr.position[1]] > -1){
        return
    }

    dist[curr.position[0]][curr.position[1]] = steps

    for (let i = 0; i < curr.to.length; ++i){
        if (dist[curr.to[i][0]][curr.to[i][1]] === - 1){
            const next = graph[curr.to[i][0]][curr.to[i][1]]
            queue.enqueue({...next, steps: steps + 1 })

        }
    }
        
    
}

type GraphQueue = Queue<GraphNode & {steps: number}>

function search(graph: GraphNode[][], start:GraphNode): ("L" | "?" | "O")[][]{
    const dist:number[][] = graph.map(e => new Array(e.length).fill(-1))
    const queue: GraphQueue = new Queue()
    let maxSteps = 0
    let maxFound = false
    
    queue.enqueue({...start, steps: 0})

    while(queue.length > 0 && !maxFound){
        const next = queue.deque()
        const {steps, ...node} = next

        if (maxSteps > steps){
            maxFound = true
        }
        maxSteps = steps
        walk(graph, node, steps, dist, queue)
    }

    return dist.map(e => e.map(n => n > -1 ? "L" : "?"))
}

const graphMap = search(graph, start)

console.log(graphMap)
for (let i = 0; i < graphMap.length; ++i){
    for (let j = 0; j < graphMap[i].length; ++j){
        //start 2 times, 1. top-left go from left-to-right top-to-bottom,
        // 2nd time go from right-to-left, bottom-to-top
        ["top-left", "bot-right"].forEach(e => {
            const row = e === "top-left" ? i : graphMap.length - 1 -i
            const col = e === "top-left" ? j : graphMap[i].length - 1 -j
            const value = graphMap[row][col]
            if (value === "?"){
                if (row === 0 || row === graphMap.length - 1 || col === 0 || col === graphMap[row].length -1){
                    graphMap[row][col] = "O"
                }
        
                if (row > 0){
                    if(graphMap[row -1][col] === "O") graphMap[row][col] = "O"; 
                }
        
                if (row < graphMap.length -1){
                    if(graphMap[row + 1][col] === "O") graphMap[row][col] = "O"
                }
        
                if (col > 0 ){
                    console.log(row, col)
                    if (graphMap[row][col - 1] === "O") graphMap[row][col] = "O"
                }
        
                if (col < graphMap[row].length -1){
                    if (graphMap[row][col + 1] === "O") graphMap[row][col] = "O"
                }
            }
        })
    }
}


// console.log("Marked Os")
// console.log(graphMap);

fs.writeFileSync(
	path.resolve(__dirname, "zwischen_" + file),
	graphMap.map((e) => e.join("")).join("\r\n")
);

for (let j = 0; j < graphMap[0].length; ++j) {
    let [hasOTop, has0Bot] = [false, false]
    let [botLeftCorner, botRightCorner] = [false, false]
    let [topLeftCorner, topRightCorner] = [false, false]
    for (let i = 0; i < graphMap.length; ++i) {
        const valueTop = graphMap[i][j];
        const valueBot = graphMap[graphMap.length - i - 1][j]
        //check if something is outside in between
        if (valueTop === "O") hasOTop = true
        if (valueBot === "O") has0Bot = true

        const nodeTop = graph[i][j]
        const nodeTopLeft = graphMap[i][Math.max(0, j - 1)];
        const nodeTopRight =
          graphMap[i][
            Math.min(graphMap[i].length - 1, j + 1)
          ];
        const nodeBot = graph[ graphMap.length -i - 1][j]
        const nodeBotLeft =
          graphMap[graphMap.length - i - 1][Math.max(0, j - 1)];
        const nodeBotRight =
          graphMap[graphMap.length - i - 1][
            Math.min(graphMap[i].length - 1, j + 1)
          ];

        // kill Outside boolean if separated
        if (valueTop === "L"){
            if (nodeTop.value === "J" || nodeTop.value === "7") topLeftCorner = true
            if (nodeTop.value === "F" || nodeTop.value === "L") topRightCorner = true
            if (nodeTop.value === "-" || (topLeftCorner && topRightCorner)){
                hasOTop = false
                topLeftCorner = false
                topRightCorner = false
            }
        }
        if(valueBot === "L"){
            if (nodeBot.value === "J" || nodeBot.value === "7")
              botLeftCorner = true;
            if (nodeBot.value === "F" || nodeBot.value === "L")
              botRightCorner = true;
            if (nodeBot.value === "-"|| (botLeftCorner && botRightCorner)){
                has0Bot = false
                botLeftCorner = false
                botRightCorner = false
            }
        }

        if(hasOTop){
            if (valueTop === "?" ) graphMap[i][j] = "O"
            if (topRightCorner && !topLeftCorner && nodeTopLeft === "?") {
                graphMap[i][Math.max(0, j-1)] = "O"
                // console.log(nodeTopLeft)
            }
            if (!topRightCorner && topLeftCorner && nodeTopRight === "?"){
                graphMap[i][Math.min(graphMap[i].length - 1, j + 1)] = "O";
                // console.log(nodeTopRight)
            } 
        }
        
        if(has0Bot){
            if (valueBot === "?" ) graphMap[i][j] = "O"
            if (botRightCorner && !botLeftCorner && nodeBotLeft === "?") {
                graphMap[graphMap.length -1 - i][Math.max(0,  j-1)] = "O"
                // console.log(nodeBotLeft)
            }
            if (!botRightCorner && botLeftCorner && nodeBotRight === "?") {
                graphMap[graphMap.length - 1 - i][
					Math.min(graphMap[i].length - 1, j + 1)
				] = "O";
                // console.log(nodeBotLeft)
            }
        }
        
  }
}

// console.log("O Marked 2")
// console.log(graphMap)

for (let i = 0; i < graphMap.length; ++i) {
	for (let j = 0; j < graphMap[i].length; ++j) {
		//start 2 times, 1. top-left go from left-to-right top-to-bottom,
		// 2nd time go from right-to-left, bottom-to-top
		["top-left", "bot-right"].forEach((e) => {
			const row = e === "top-left" ? i : graphMap.length - 1 - i;
			const col = e === "top-left" ? j : graphMap[i].length - 1 - j;
			const value = graphMap[row][col];
			if (value === "?") {
				if (
					row === 0 ||
					row === graphMap.length - 1 ||
					col === 0 ||
					col === graphMap[row].length - 1
				) {
					graphMap[row][col] = "O";
				}

				if (row > 0) {
					if (graphMap[row - 1][col] === "O")
						graphMap[row][col] = "O";
				}

				if (row < graphMap.length - 1) {
					if (graphMap[row + 1][col] === "O")
						graphMap[row][col] = "O";
				}

				if (col > 0) {
					console.log(row, col);
					if (graphMap[row][col - 1] === "O")
						graphMap[row][col] = "O";
				}

				if (col < graphMap[row].length - 1) {
					if (graphMap[row][col + 1] === "O")
						graphMap[row][col] = "O";
				}
			}
		});
	}
}

for (let j = 0; j < graphMap[0].length; ++j) {
	let [hasOTop, has0Bot] = [false, false];
	let [botLeftCorner, botRightCorner] = [false, false];
	let [topLeftCorner, topRightCorner] = [false, false];
	for (let i = 0; i < graphMap.length; ++i) {
		const valueTop = graphMap[i][j];
		const valueBot = graphMap[graphMap.length - i - 1][j];
		//check if something is outside in between
		if (valueTop === "O") hasOTop = true;
		if (valueBot === "O") has0Bot = true;

		const nodeTop = graph[i][j];
		const nodeTopLeft = graphMap[i][Math.max(0, j - 1)];
		const nodeTopRight =
			graphMap[i][Math.min(graphMap[i].length - 1, j + 1)];
		const nodeBot = graph[graphMap.length - i - 1][j];
		const nodeBotLeft =
			graphMap[graphMap.length - i - 1][Math.max(0, j - 1)];
		const nodeBotRight =
			graphMap[graphMap.length - i - 1][
				Math.min(graphMap[i].length - 1, j + 1)
			];

		// kill Outside boolean if separated
		if (valueTop === "L") {
			if (nodeTop.value === "J" || nodeTop.value === "7")
				topLeftCorner = true;
			if (nodeTop.value === "F" || nodeTop.value === "L")
				topRightCorner = true;
			if (nodeTop.value === "-" || (topLeftCorner && topRightCorner)) {
				hasOTop = false;
				topLeftCorner = false;
				topRightCorner = false;
			}
		}
		if (valueBot === "L") {
			if (nodeBot.value === "J" || nodeBot.value === "7")
				botLeftCorner = true;
			if (nodeBot.value === "F" || nodeBot.value === "L")
				botRightCorner = true;
			if (nodeBot.value === "-" || (botLeftCorner && botRightCorner)) {
				has0Bot = false;
				botLeftCorner = false;
				botRightCorner = false;
			}
		}

		if (hasOTop) {
			if (valueTop === "?") graphMap[i][j] = "O";
            const onlyRightCorner = (topRightCorner && !topLeftCorner)
            const onlyLeftCorner = (topLeftCorner && !topRightCorner)
			if ((onlyLeftCorner || onlyRightCorner) && nodeTopLeft === "?") {
				graphMap[i][Math.max(0, j - 1)] = "O";
				// console.log(nodeTopLeft)
			}
			if ((onlyLeftCorner || onlyRightCorner) && nodeTopRight === "?") {
				graphMap[i][Math.min(graphMap[i].length - 1, j + 1)] = "O";
				// console.log(nodeTopRight)
			}
		}

		if (has0Bot) {
			if (valueBot === "?") graphMap[i][j] = "O";
            const onlyRightCorner = botRightCorner && !botLeftCorner;
			const onlyLeftCorner = botLeftCorner && !botRightCorner;
			if ((onlyLeftCorner || onlyRightCorner) && nodeBotLeft === "?") {
				graphMap[graphMap.length - 1 - i][Math.max(0, j - 1)] = "O";
				// console.log(nodeBotLeft)
			}
			if ((onlyLeftCorner || onlyRightCorner) && nodeBotRight === "?") {
				graphMap[graphMap.length - 1 - i][
					Math.min(graphMap[i].length - 1, j + 1)
				] = "O";
				// console.log(nodeBotLeft)
			}
		}
	}
}

for (let i = 0; i < graphMap.length; ++i) {
	for (let j = 0; j < graphMap[i].length; ++j) {
		//start 2 times, 1. top-left go from left-to-right top-to-bottom,
		// 2nd time go from right-to-left, bottom-to-top
		["top-left", "bot-right"].forEach((e) => {
			const row = e === "top-left" ? i : graphMap.length - 1 - i;
			const col = e === "top-left" ? j : graphMap[i].length - 1 - j;
			const value = graphMap[row][col];
			if (value === "?") {
				if (
					row === 0 ||
					row === graphMap.length - 1 ||
					col === 0 ||
					col === graphMap[row].length - 1
				) {
					graphMap[row][col] = "O";
				}

				if (row > 0) {
					if (graphMap[row - 1][col] === "O")
						graphMap[row][col] = "O";
				}

				if (row < graphMap.length - 1) {
					if (graphMap[row + 1][col] === "O")
						graphMap[row][col] = "O";
				}

				if (col > 0) {
					console.log(row, col);
					if (graphMap[row][col - 1] === "O")
						graphMap[row][col] = "O";
				}

				if (col < graphMap[row].length - 1) {
					if (graphMap[row][col + 1] === "O")
						graphMap[row][col] = "O";
				}
			}
		});
	}
}


const notOs = graphMap.reduce((acc, curr) => {
    return acc + curr.reduce((acc2, curr2) => {
        return acc2 + (curr2 === "?" ? 1 : 0)
    }, 0)
},0)

// console.log()
fs.writeFileSync(path.resolve(__dirname, "output_"+ file), graphMap.map(e => e.join("")).join("\r\n"))
console.log(notOs)