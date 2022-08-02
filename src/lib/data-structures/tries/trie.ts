// Tries are tree structures in which elements are represented by paths (not by individual nodes).

// Trie is derived from the word 'retrieval'.

interface ITrie {
  root: Node;
  insert(word: string): void;
  search(word: string): boolean;
}

interface IChildren {
  [char: string]: Node;
}

class Node {
  public end: boolean;
  public children: IChildren;

  constructor() {
    this.end = false;
    this.children = {};
  }
}

class Trie implements ITrie {
  public root: Node;

  constructor() {
    this.root = new Node();
  }

  public insert(word: string) {
    let node = this.root;

    for (let letter of word) {
      if (!node.children[letter]) {
        node.children[letter] = new Node();
      }

      node = node.children[letter];
    }

    node.end = true;
  }

  public search(word: string): boolean {
    let node = this.root;

    for (let letter of word) {
      if (!node.children[letter]) {
        return false;
      }

      node = node.children[letter];
    }

    if (node.end === true) {
      return true;
    }

    return false;
  }

  public remove(word: string): boolean {
    let node = this.root;
    let candidate: any = {
      parent: null,
      label: null,
    };

    if (!word) return false;

    let prev = { ...candidate };

    for (let letter of word) {
      if (!node.children[letter]) {
        return false;
      }

      const parentWithOneChild = Object.keys(node.children).length === 1;

      if (parentWithOneChild && !candidate.parent) {
        candidate = { ...prev };
      } else if (parentWithOneChild === false) {
        candidate.parent = null;
        candidate.label = null;
      }

      // cache parent node and its corresponding edge label from its grandparent
      prev.parent = node;
      prev.label = letter;

      node = node.children[letter];
    }

    if (node.end === true) {
      node.end = false;
      if (candidate.parent && candidate.label) {
        delete candidate.parent.children[candidate.label];
      } else {
        delete node.children[word.slice(word.length - 1)];
      }

      return true;
    }

    return false;
  }

  public findPrefixed(word: string): string[] {
    return [];
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

export { Trie };
