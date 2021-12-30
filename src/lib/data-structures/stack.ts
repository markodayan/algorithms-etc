// Stack - Last In First Out (LIFO)
// You can implement this with an array or linked list (linked list is more efficient)
interface Node<T> {
  value: T | null;
  next: Node<T> | null;
}

interface Stack<T> {
  size: number;
  first: Node<T> | null;
  last: Node<T> | null;
  push(val: T): void;
  pop(): T | null;
}

class Node<T> implements Node<T> {
  constructor(val: T) {
    this.value = val;
    this.next = null;
  }
}

// Giving a default generic type value
class Stack<T = string> implements Stack<T> {
  constructor() {
    this.size = 0;
    this.first = null;
    this.last = null;
  }

  push(val: T): number {
    let newNode: Node<T> = new Node(val);

    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      let temp = this.first;
      this.first = newNode;
      this.first.next = temp;
    }

    return ++this.size;  
  }

  pop(): T | null {
    if (!this.first) return null;

    let removedNode = this.first as Node<T>;
    if (this.first === this.last) {
      this.first = null;
      this.last = null;
    } else {
      this.first = this.first.next;
    }

    this.size--;
    return removedNode.value;
  }
}

export default Stack;