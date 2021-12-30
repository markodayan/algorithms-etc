// Queue - First In First Out (FIFO)
// list-based queue is more performant than array-based queue
interface Node<T> {
  value: T | null;
  next: Node<T> | null;
}

interface Queue<T> {
  size: number;
  first: Node<T> | null;
  last: Node<T> | null;
  enqueue(val: T): void;
  dequeue(): T | null;
  isEmpty(): boolean;
}

class Node<T> implements Node<T> {
  constructor(val: T) {
    this.value = val;
    this.next = null;
  }
}

class Queue<T = string> implements Queue<T> {
  constructor() {
    this.size = 0;
    this.first = null;
    this.last = null;
  }

  // insert new node as last element
  enqueue(val: T): number {
    let newNode: Node<T> = new Node(val);

    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last!.next = newNode;
      this.last = newNode;
    }

    return ++this.size;
  }

  // remove first element
  dequeue(): T | null {
    if (!this.first) return null;

    let temp = this.first as Node<T>;

    if (this.first === this.last) {
      this.last = null;
    }

    this.first = this.first.next;
    this.size--;
    return temp.value;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}

export default Queue;
