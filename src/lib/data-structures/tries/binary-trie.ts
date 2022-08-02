// A binary trie is search tree used for locating alphanumeric keys where nodes are limited to having a maximum of 2 children.
// While somewhat impractical this is an exercise in designing binary tries to prepare for implementation of patricia tries which are binary radix trees.

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

class ExtensionNode extends Node {
  public end: boolean;
  public children: IChildren;

  constructor() {
    super();
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
        if (Object.keys(node.children).length > 1) {
        } else {
          node.children[letter] = new Node();
        }
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

    // Check if the word matched is a complete word registered in the trie (not just a prefix)
    if (node.end === true) {
      return true;
    }

    return false;
  }
}

export { Trie };
