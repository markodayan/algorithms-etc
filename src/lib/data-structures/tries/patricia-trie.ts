// A patricia trie is a binary radix trie resulting from the application of the PATRICIA algorithm to alphanumeric data

// A patricia trie has nodes that can contain a maximum of 2 direct children

import { binary, alphanumeric } from '@lib/utils/conversion';

class Node {
  public end: boolean;
  public children: Node[];
  public value?: string;

  constructor() {
    this.end = false;
    this.children = new Array(2).fill(null);
  }
}

class PatriciaTrie {
  public root: Node;

  constructor() {
    this.root = new Node();
  }

  public insert(word: string) {
    const bin = binary(word);
    let node = this.root;

    for (let bit of bin) {
      let i = bit === '0' ? 0 : 1;

      if (node.children[i] === null) {
        node.children[i] = new Node();
      }

      node = node.children[i];
    }

    node.end = true;
    node.value = bin;
  }

  public search(word: string): boolean {
    const bin = binary(word);
    let node = this.root;

    for (let bit of bin) {
      let i = bit === '0' ? 0 : 1;

      if (node.children[i] === null) {
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
    const bin = binary(word);
    const lastBinIndex = parseInt(bin[bin.length - 1]);

    let node = this.root;
    let candidate: { parent: Node | null; index: number | null } = {
      parent: null,
      index: null,
    };

    if (!word) return false;

    let prev = { ...candidate };

    for (let bit of bin) {
      const i = bit === '0' ? 0 : 1;

      if (node.children[i] === null) {
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
      if (candidate.parent && candidate.index !== null) {
        candidate.parent.children[candidate.index] = null as never;
      } else if (prev.parent) {
        prev.parent.children[lastBinIndex] = null as never;
      }

      return true;
    }

    return false;
  }
}

let trie = new PatriciaTrie();

// let alphabet = new Array(26).fill(null).map((_, i) => String.fromCharCode(65 + i));

// for (let letter of alphabet) {
//   trie.insert(letter);
// }

// for (let letter of alphabet) {
//   let search = trie.search(letter);
//   console.log(`${letter} found: ${search}`);
// }

// trie.remove('A');
// trie.remove('B');
// trie.remove('C');
// trie.remove('X');
// trie.remove('Y');
// trie.remove('Z');

// for (let letter of alphabet) {
//   let search = trie.search(letter);
//   console.log(`${letter} found: ${search}`);
// }

let smileWords = ['smile', 'smiled', 'smiles'];

for (let word of smileWords) {
  trie.insert(word);
}

console.log('hello');

export { PatriciaTrie };

// 0111 0011 0110 1101 0110 1001 0110 1100 0110 0101 // smile
// |||| |||| |||| |||| |||| |||| |||| |||| |||| |||| 0110 0100 // smiled
// |||| |||| |||| |||| |||| |||| |||| |||| |||| |||| 0111 0011 // smiles
