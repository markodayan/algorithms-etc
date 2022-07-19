// A Radix Tree is a compressed form of a trie (memory-optimised trie/compressed trie).

// Each internal node has atleast 2 children combining the nodes that only have a single child in a standard trie with their parents.

// Therefore bottom nodes of a radix tree can either hold single characters or strings. This means that all descendants of a node hold the part of a string that they have a difference in, while their parent holds their common prefix.

// 3 variations of radix trees
// (1) Hat Radix Tree (array hash table used in the leaf nodes as containers)
// (2) Patricia Radix Tree (the position of the first bit of every key is stored instead of the entire key, the bit is used to distiguish between the two sub-trees)
// (3) Adaptive Radix Tree (keys are stored in an alphabetical order)

interface IMatch {
  prefix: string;
  suffix: string;
  string: string | null;
}

class Node {
  public value: string;
  public end: boolean;
  public children: { [key: string]: Node };

  constructor(end: boolean = false) {
    this.children = {};
    this.end = end;
  }

  private longestPrefixMatch(key: string, match: string): IMatch {
    let i = 0;

    while (i < key.length && i < match.length && key[i] === match[i]) {
      i++;
    }

    const prefix = key.slice(0, i); // prefix is the longest common match we found (left side of key)
    const suffix = key.slice(i); // suffix is the part of the key that was not common (right side of the key)
    const string = prefix.length > 0 ? key : null; // string is k

    return {
      prefix,
      suffix,
      string,
    };
  }

  public getLongestPrefix(str: string): IMatch | null {
    const keys: string[] = Object.keys(this.children);

    // Iterate over each node name value
    for (let i = 0; i < keys.length; i++) {
      // key is a prefix candidate
      const prefix = keys[i];
      const match = this.longestPrefixMatch(prefix, str);

      // If a valid substring match is found
      if (match.string) {
        return match;
      }
    }

    // If no matches found
    return null;
  }

  public isLeaf(): boolean {
    return Object.keys(this.children).length === 0;
  }
}

class RadixTree {
  public root: Node;
  public size: number;

  constructor() {
    this.root = new Node();
    this.size = 0;
  }

  public insert(word: string) {
    let node = this.root;
    let match;

    while (word.length > 0) {
      match = node.getLongestPrefix(word);

      // if no there are no matches against the current node keys, create Node with entire word as key
      if (!match) {
        node.children[word] = new Node(true);
        this.size++;
        return;
      } else {
        // If key candidate was completely matched, traverse deeper down the tree (else create new node corresponding to prefix and add suffixed children)
        if (match.prefix.length === match.string!.length) {
          // point to next node of completely matched key (corresponding to matched prefix)
          node = node.children[match.string!];
          // slice prefix as we have no traversed to a node corresponding to our prefix term
          word = word.slice(match.string!.length);
        } else {
          // Create new node to replace current node with new common prefix and children representing suffixes (matched string suffix, new word suffix)
          let newNode = new Node();

          newNode.children[match.suffix] = node.children[match.string!]; // key = suffix of matched string, value = Node corresponding to matched key
          newNode.children[word.slice(match.prefix.length)] = new Node(true); // key = prefix of word calculated, value = empty new Node

          delete node.children[match.string!]; // delete key-matched Node
          node.children[match.prefix] = newNode; // replace removed node with new common prefix node

          this.size++;
          return;
        }
      }
    }

    // current node should exist
    node.end = true;
  }
}

let radixTree = new RadixTree();

radixTree.insert('JOHN');
radixTree.insert('ADAM');
radixTree.insert('ALEX');
radixTree.insert('JANE');
radixTree.insert('ALAN');
// radixTree.insert('ADAMA');
// radixTree.insert('ELLEN');
// radixTree.insert('ERIC');
console.log('yehaw');

export default RadixTree;
