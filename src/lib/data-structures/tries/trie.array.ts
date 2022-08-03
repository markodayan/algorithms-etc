// Alphanumeric trie using fixed array buckets of length 26 to children node storage (each letter of the alphabet represents an array index)

// Tries take up more memory/space compared to a hash table but they do not suffer from risks associated with hash collisions.

// Hash tables use arrays with linked lists while Tries use arrays with pointers.

// Downside of a trie is that it takes up a lof of memory and space with null pointers.

// As a trie grows in size, less work is needed to be done to add a value, since the intermediate nodes or brancheas of the trie have already been built up.

// There are great benefits to using tries. The bulk of the work in creating a trie happens early on. But as the trie grows in size, we have to do less work each time to add a value since it is likely we have already initialised nodes and their values and references.

// Another benefit is that each time we add a word's letter, we know that we will only ever have to look up 26 possible indexes in a nodes array.

// The amount of time it takes to create a trie is tied directly to how many words/keys the trie contains, and how long those keys could potentially be.
// Let m = longest key in the trie
// Let n = total number of keys in the trie
// The worst case runtime of creating a trie is thus O(mn)

// Time complexity of searching, inserting and deleting from a trie depends on the length of the word `a` that is being searched/inserted/deleted as well as the number of total words n. This makes the runtime of these operations O(an)

// A powerful aspect of tries is that it makes it easy to search for a subset of elements.

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

      node = node.children[i];
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
