// A hash table (also hash map) is a data structure that is used to store key-value pairs
// Given a key, you can associate a value with it and enable fast lookup

// TLDR (we have key-value pairs -> we hash the keys (resolves to an index of a fixed-array length) -> insert value at that array index)
// we can search by providing a key which then is hashed and tells us which index the value we are looking for corresponding to the supplied key is at

// To handle hash collisions we will make use of linked lists to manage common hashed indexes

class HashTable {
  table: Bucket[];
  size: number;

  constructor(size: number) {
    this.size = size;
    this.table = [...Array(size)].map((v) => new Bucket());
  }

  private hash(key: string): number {
    const total = key.split('').reduce((acc, _, i) => acc + key.charCodeAt(i), 0);
    return total % this.size;
  }

  public get(key: string): string | number {
    const index = this.hash(key);
    const value = this.table[index].get(key);

    if (!value) throw new Error(`${key} not found in hash table`);

    return value;
  }

  public search(key: string): boolean {
    const index = this.hash(key);
    return this.table[index].search(key);
  }

  public set(key: string, value: string | number) {
    let index = this.hash(key);
    this.table[index].insert(key, value);
  }

  public delete(key: string) {
    const index = this.hash(key);
    this.table[index].delete(key);
  }

  public display() {
    this.table.map((v, i) => console.log(i, v));
  }
}

class BucketNode {
  public key: string;
  public value: string | number;
  public next: BucketNode | null;

  constructor(key: string, value: string | number) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class Bucket {
  public head: BucketNode | null;

  constructor() {
    this.head = null;
  }

  public insert(key: string, value: string | number) {
    if (!this.search(key)) {
      let newNode = new BucketNode(key, value);
      newNode.next = this.head;
      this.head = newNode;
    } else {
      console.log(`${key} already exists`);
    }
  }

  public get(key: string): string | number | null {
    let currentNode = this.head;

    while (currentNode != null) {
      if (currentNode.key === key) {
        return currentNode.value;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  public search(key: string): boolean {
    let currentNode = this.head;

    while (currentNode != null) {
      if (currentNode.key === key) {
        return true;
      }

      currentNode = currentNode.next;
    }

    return false;
  }

  public delete(key: string) {
    // special case: key to delete is the head of the linked list
    if (this.head && this.head.key == key) {
      this.head = this.head.next;
      return;
    }

    let previousNode = this.head;

    while (previousNode?.next !== null) {
      if (previousNode?.next.key === key) {
        // delete (point previous node to the node after our specified one)
        previousNode.next = previousNode.next.next;
      }

      previousNode = previousNode?.next as BucketNode | null;
    }
  }
}

// let table = new HashTable(50);
// table.set('name', 'Bruce');
// table.set('age', 25);
// table.set('mane', 'Clark');
// // table.display();
// console.log(table.get('mane')); // Clark
// console.log(table.search('madne')); // false
// console.log(table.get('age'));

export default HashTable;
