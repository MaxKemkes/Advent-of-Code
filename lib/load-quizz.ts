import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function loadQuizzContent(fileName: string){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return readFileSync(path.resolve(__dirname, fileName),	"utf-8")
}