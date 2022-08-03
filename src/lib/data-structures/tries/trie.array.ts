// Alphanumeric trie using fixed array buckets of length 26 to children node storage (each letter of the alphabet represents an array index)
// Tradeoffs: Larger Size -> Faster access

// Tries are tree structures in which elements are represented by paths (not by individual nodes).

// Trie is derived from the word 'retrieval'.

class Node {
  public end: boolean;
  public children: Node[];

  constructor() {
    this.end = false;
    this.children = new Array(26).fill(null);
  }
}

class Trie {
  public root: Node;

  constructor() {
    this.root = new Node();
  }

  public insert(word: string) {
    let node = this.root;

    for (let letter of word) {
      const i = letter.charCodeAt(0) - 65;

      if (!node.children[i]) {
        node.children[i] = new Node();
      }

      if (node.children[i] && node) {
        node = node.children[i];
      }
    }

    node.end = true;
  }

  public search(word: string): boolean {
    let node = this.root;

    for (let letter of word) {
      const i = letter.charCodeAt(0) - 65;

      if (!node.children[i]) {
        return false;
      }

      node = node.children[i];
    }

    if (node.end === true) {
      return true;
    }

    return false;
  }

  public remove(word: string): boolean {
    const lastLetterIndex = word.charCodeAt(word.length - 1) - 65;
    let node = this.root;
    let candidate: { parent: Node | null; index: number | null } = {
      parent: null,
      index: null,
    };

    if (!word) return false;

    let prev = { ...candidate };

    for (let letter of word) {
      const i = letter.charCodeAt(0) - 65;

      if (!node.children[i]) {
        return false;
      }

      const childCount = node.children.reduce((acc, v) => (v !== null ? acc + 1 : acc), 0);
      const parentWithOneChild = childCount === 1;

      if (parentWithOneChild && !candidate.parent) {
        candidate = { ...prev };
      } else if (parentWithOneChild === false) {
        candidate.parent = null;
        candidate.index = null;
      }

      prev.parent = node;
      prev.index = i;

      node = node.children[i];
    }

    if (node.end === true) {
      node.end = false;

      if (candidate.parent && candidate.index !== null) {
        // if multiple nodes need to be dereferenced
        candidate.parent.children[candidate.index] = null as never;
      } else if (prev.parent) {
        // If only one node needs to be dereferenced
        prev.parent.children[lastLetterIndex] = null as never;
      }

      return true;
    }

    return false;
  }
}

let trie = new Trie();

trie.insert('CAT');
trie.insert('CART');
trie.insert('RAT');
trie.insert('ROAD');
trie.insert('ROCK');

trie.remove('ROAD');
trie.remove('RAT');
trie.remove('CAT');

export {};
