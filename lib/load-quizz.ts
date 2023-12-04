import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function loadQuizzContent(fileName: string){
    return readFileSync(path.resolve(__dirname, "./cards.txt"),	"utf-8")
}