//greatest commong denominator
export function gcd(a: number, b: number){
    while(b!== 0){
        console.log("Print before", a, b)
        let temp = b
        b = a % b
        a = temp
    }

    return a
}

//least common multiple
export function lcm(a: number, b:number){
    return ( a * b) / gcd(a,b)
}

