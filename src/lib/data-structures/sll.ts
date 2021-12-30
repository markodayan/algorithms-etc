/**
 * Singly Linked List (SLL) Class Implementation
 */
 interface Node<T> {
  value: T | null;
  next: Node<T> | null;
}

interface SinglyLinkedList<T> {
  push(val: T): SinglyLinkedList<T>;
  pop(): SinglyLinkedList<T> | Node<T> | null;
  shift(): Node<T> | null;
  unshift(val: T): SinglyLinkedList<T>;
  get(index: number): Node<T> | null;
  set(index: number, val: T): boolean;
  insert(index: number, val: T): boolean;
  remove(index: number): SinglyLinkedList<T> | Node<T> | null;
  reverse(): SinglyLinkedList<T>;
  print(): Array<T>;
  find(val: T): Node<T> | null;
  search(comparator: (data: T) => boolean): Node<T> | null;
}

class Node<T> implements Node<T> {
  constructor(val: T) {
    this.value = val;
    this.next = null;
  }
}

class SinglyLinkedList<T = string> implements SinglyLinkedList<T> {
  public head: Node<T> | null = null;
  public tail: Node<T> | null = null;
  public length: number = 0;

  public push(val: T): SinglyLinkedList<T> {
    let newNode: Node<T> = new Node(val);

    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return this;
  }

  public pop(): SinglyLinkedList<T> | Node<T> | null {
    if (!this.head) return null;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      return this;
    }

    let current = this.head as Node<T>;
    let newTail = current;

    while (current.next !== null) {
      newTail = current;
      current = current.next;
    }

    this.tail = newTail;
    this.tail.next = null;
    this.length--;
    return current; // popped element
  }

  public shift(): Node<T> | null {
    if (!this.head) return null;

    let currentHead = this.head as Node<T>;
    this.head = currentHead.next;
    this.length--;
    return currentHead; // return shifted element
  }

  public unshift(val: T): SinglyLinkedList<T> {
    let newNode: Node<T> = new Node(val);

    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.length++;
    return this;
  }

  public get(index: number): Node<T> | null {
    if (index < 0 || index >= this.length) return null;

    let counter = 0;
    let current = this.head as Node<T> | null;

    while (counter !== index) {
      current = current!.next;
      counter++;
    }

    return current;
  }

  public set(index: number, val: T): boolean {
    let foundNode = this.get(index) as Node<T> | null;

    if (!foundNode) return false;

    foundNode.value = val;
    return true;
  }

  public insert(index: number, val: T): boolean {
    if (index < 0 || index > this.length) return false;
    if (index === this.length) return !!this.push(val);
    if (index === 0) return !!this.unshift(val);

    let newNode: Node<T> = new Node(val);
    let prev = this.get(index - 1) as Node<T>;
    let temp = prev.next;

    prev.next = newNode;
    newNode.next = temp;

    this.length++;
    return true;
  }

  public remove(index: number): SinglyLinkedList<T> | Node<T> | null {
    if (index < 0 || index >= this.length) return null;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    let prev = this.get(index - 1) as Node<T>;
    let removed = prev.next as Node<T>;
    prev.next = removed.next;

    this.length--;
    return removed;
  }

  public reverse(): SinglyLinkedList<T> {
    let node = this.head as Node<T> | null;
    this.head = this.tail;
    this.tail = node;

    let next;
    let prev = null;

    for (let i = 0; i < this.length; i++) {
      next = node!.next;
      node!.next = prev;
      prev = node;
      node = next;
    }

    return this;
  }

  public print(): Array<T> {
    let arr: Array<T> = [];
    let current = this.head as Node<T>;

    while (current) {
      arr.push(current.value as T);
      current = current.next as Node<T>;
    }

    return arr;
  }

  public search(comparator: (data: T) => boolean): Node<T> | null {
    const checkNext = (node: Node<T>): Node<T> | null => {
      if (comparator(node.value!)) {
        return node;
      }
      return node.next ? checkNext(node.next) : null;
    };

    return this.head ? checkNext(this.head) : null;
  }

  public find(val: T): Node<T> | null {
    if (!this.head) {
      return null;
    }

    let current = this.head as Node<T> | null;
    while (current) {
      if (current.value === val) {
        return current;
      }
      current = current.next;
    }

    return null;
  }
}

export default SinglyLinkedList;
export { Node };
