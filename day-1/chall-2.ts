
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const numDict = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    zero:"0"
} as const

const replaceFirst = (str: string, subStr: keyof typeof numDict, replace: typeof numDict[keyof typeof numDict]) => {
    return str.replace(subStr, replace)
}

const replaceLast = (str: string, subStr: keyof typeof numDict, replace: typeof numDict[keyof typeof numDict]) => {
	let list = str.split(subStr)
    var lastList = list.pop()

    return list.join(subStr) + replace + lastList
}

var __dirname = path.dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(path.resolve(__dirname,"lines.txt"), "utf-8")
	.split(/\r\n/)
	.map((e) => {
		let str = e;
        let firstIndex: [number, keyof typeof numDict, typeof numDict[keyof typeof numDict]]  = [9999999, null, null];
        let lastIndex: [number, keyof typeof numDict, typeof numDict[keyof typeof numDict]] = [-1, null, null];

		for (const [key, value] of Object.entries(numDict)) {
            if (str.indexOf(key) < firstIndex[0] && str.indexOf(key) !== -1){
                firstIndex = [str.indexOf(key), key as keyof typeof numDict, value]
            }
		}
        
        const indexes = str.match(/\d/g)
        if (Number(str.indexOf(indexes[0])) > firstIndex[0]) {
			str = replaceFirst(str, firstIndex[1], firstIndex[2]);
		}

        if (str === "sgeightwo3") {
			console.log(str);
			console.log(firstIndex);
			console.log(lastIndex);
            console.log(indexes)
            console.log(
				"First number:",
				Number(str.indexOf(indexes[0])) > firstIndex[0]
			);
		}

        for (const [key, value] of Object.entries(numDict)) {
            if (
                str.lastIndexOf(key) > lastIndex[0] &&
                str.indexOf(key) !== -1
            ) {
                lastIndex = [
                    str.lastIndexOf(key),
                    key as keyof typeof numDict,
                    value,
                ];
            }
        }
        
        const _indexes = str.match(/\d/g);
        
        if (Number(str.lastIndexOf(_indexes[_indexes.length - 1])) < lastIndex[0]){
            str = replaceLast(str, lastIndex[1], lastIndex[2])
        }

        return str;
	})
	.map((e) => e.replace(/([A-Za-z])/g, ""));

console.log(lines)


const nums: number[] = lines.map(e => {
    let left: number | null = null;
    let right: number | null = null
    const len = e.length
    for (let i = 0; i < len; i++){
        if (left && right){
            return left + right
        }

        if (!left){
			//@ts-ignore
			if (!isNaN(e[i])) left = e[i];
		}
        
        if (!right) {
            // console.log(i, e[-i])
            //@ts-ignore
            if (!isNaN(e[len-1 -i])) right = e[len - 1-i];
        }
    }

    //@ts-ignore
    return left + right
})

console.log(nums)

const sum = nums.reduce((acc, curr) => {
    return acc += curr * 1
}, 0)

console.log(sum)