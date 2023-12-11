import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Queue from "../lib/queue";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(path.resolve(__dirname, "quizz.txt"), "utf-8")
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
        console.log(value)
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

console.log(graph)
console.log(start)

function walk(graph: GraphNode[][], curr: GraphNode, steps: number, dist: number[][], queue: GraphQueue){
    console.log(curr)

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

function search(graph: GraphNode[][], start:GraphNode){
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
            return maxSteps
        }
        maxSteps = steps
        walk(graph, node, steps, dist, queue)
    }

    return maxSteps
}

const maxSteps = search(graph, start)
console.log(maxSteps)