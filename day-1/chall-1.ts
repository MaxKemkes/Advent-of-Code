import loadQuizzContent from "../lib/load-quizz";

const lines = loadQuizzContent("./lines.txt")
	.split(/\r\n/)
	.map((e) => e.replace(/([A-Za-z])/g, ""));

// console.log(lines)


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