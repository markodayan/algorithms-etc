// A trie (also known as a Prefix Tree) is tree where the letters of the alphabet can be stored in each node (each node can hold a character of the alphabet). By traversing down different tree paths we can retrieve different words stored in the trie.

interface IChildrenMap {
  [char: string]: Node;
}

interface ITrie {
  root: Node;
  insert(word: string): void;
  search(word: string): boolean;
}

class Node {
  public value: string | null;
  public end: boolean;
  public children: IChildrenMap;

  constructor(value: string | null) {
    this.value = value;
    this.end = false;
    this.children = {};
  }
}

class Trie implements ITrie {
  public root: Node;

  constructor() {
    this.root = new Node(null);
  }

  public insert(word: string) {
    const length = word.length;
    let node = this.root;

    for (let i = 0; i < length; i++) {
      const char = word[i];

      if (!node.children[char]) {
        node.children[char] = new Node(char);
      }

      node = node.children[char];
    }

    node.end = true;
  }

  public search(word: string): boolean {
    const length = word.length;
    let node = this.root;

    for (let i = 0; i < length; i++) {
      const char = word[i];

      if (!node.children[char]) {
        return false;
      }

      node = node.children[char];
    }

    if (node.end === true) {
      return true;
    }

    return false;
  }
}

// let trie = new Trie();

// trie.insert('orc');
// trie.insert('orange');

// console.log('or:', trie.search('or')); // false
// console.log('orc:', trie.search('orc')); // true
// console.log('ork:', trie.search('ork')); // false
// console.log('oran:', trie.search('oran')); // false
// console.log('orange:', trie.search('orange')); // true

export default Trie;
