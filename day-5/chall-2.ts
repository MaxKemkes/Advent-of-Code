import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function loadQuizzContent(fileName: string) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return readFileSync(path.resolve(__dirname, fileName), "utf-8");
}

const dict: {[key:string]: string[]} = {}

const position: [number, number][] = []
const minFinalPos: number[]  =[]

loadQuizzContent("./puzzle.txt").split(/\r\n\r\n/g).forEach(e => {
    const [key, val] = e.split(":")

    if (key === "seeds"){
        const _seeds = val.split(" ").map(n => Number(n))
        for (let i = 0; i < _seeds.length; i=i+2){
            position.push([_seeds[i], _seeds[i+1]])
        }
        return
    }

    dict[key] = val.split(/\r\n/g).filter(e => e !=="");

    // return dict
})

function translatePosition(map: string[], position: ([number, number] | null)[]){
    const _position:[number, number][] = []

    const _map = map.map(e => e.split(" ").map(n => Number(n)) as [number, number, number])
    _map.sort((prev, next) => {
        if (prev[1] < next[1]){
            return -1
        }

        if (prev[1] > next[1]){
            return 1
        }
        
        return 0
    })

    console.log(_map)
    
    for (let i = 0; i < position.length; i++){
        
        for (let j = 0; j < _map.length && position[i] !== null; j++){
            const [destination, start, range] = _map[j]
            
            //complete range inbound
            if (
				position[i][0] >= start &&
				position[i][0] + position[i][1] <= start + range
			) {
				//move complete range
                if (destination === 0 || start === 0) {
                    console.log("Inside bound");
                    console.log(position[i], map[j]);
                }
				_position.push([
                    destination + position[i][0] - start,
					position[i][1],
				]);
				position[i] = null
                console.log("New Position", position[i]);
                continue
			}
            
            //start outbound and end inbound
            if (
                position[i][0] < start &&
                position[i][0] + position[i][1] -1 >= start &&
				position[i][0] + position[i][1] <= start + range
                ){
                // console.log("start out end in")
                //split beginning until new start
                //move rest to new position
                if (destination === 0 || start === 0) {
                    console.log("start out end in");
                    console.log(position[i], map[j]);
                }
                _position.push([destination, position[i][0] + position[i][1] - start]);
                position[i] = [position[i][0], start - position[i][0] ];
                // _position.push([position[i][0], start - position[i][0] ]);
                // position[i] = null;
                console.log("New Position", position[i]);
                continue
            }
            
            //start inbound and end outbound
            if (
                position[i][0] >= start &&
                position[i][0] < start + range &&
				position[i][0] + position[i][1] > start + range
                ) {
                    // console.log("start in end out")
                    // console.log(start, range, destination)
                    //split beginning until new start
                    if (destination === 0 || start === 0) {
                        console.log("start in end out");
                        console.log(position[i], map[j]);
                    }
                    _position.push([destination + position[i][0] - start, start + range - position[i][0]]);
                    //move rest to old position
                    position[i] =[
                        start + range,
					position[i][0] + position[i][1] - (start + range),
			    	];
                    // _position.push([
                    //     start + range,
					// position[i][0] + position[i][1] - (start + range),
			    	// ]);
                    // position[i] =null;
                    console.log("New Position", position[i])
                    continue
			}

            // console.log("new Pos ", position[i])
            
        }
        if (!!position[i])  _position.push(position[i])
    }
        // console.log(position)

    return _position
}

console.log(position)
const sumRange = position.reduce((acc, curr) => {
    return acc + curr[1]
},0)

let newPos = position
for (const [key, value] of Object.entries(dict)){
    console.log(key)

    newPos = translatePosition(value, newPos);
    console.log(newPos)
    // console.log("Sum Range new" ,newPos.reduce((acc, curr) => {
    //     return acc + curr[1]
    // },0), sumRange)
    // console.log(Math.min(...newPos.map(e => e[0])))
    minFinalPos.push(Math.min(...newPos.map(e => e[0])))
}


console.log("Final min", minFinalPos[minFinalPos.length-1])

// console.log("Min:", Math.min(...minFinalPos))