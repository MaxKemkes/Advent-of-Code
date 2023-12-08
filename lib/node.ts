// export type Node<T> = {
// 	value: T;
// 	left: Node<T>;
// 	right: Node<T>;
// };

export class Node<T> {
    public value: T;
    private left: Node<T>;
    private right: Node<T>

    constructor(node: string, left: T, right: T ){

    }
}