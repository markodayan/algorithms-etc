// A patricia trie is a binary radix trie resulting from the application of the PATRICIA algorithm to alphanumeric data

// A patricia trie has nodes that can contain a maximum of 2 direct children

interface INode {
  end: boolean;
  children: IChildrenMap;
  getLongestMatch(str: string): IMatch;
}

interface IPatriciaTrie {
  root: Node;
  insert(word: string): void;
  search(word: string): boolean;
}

interface IMatch {
  prefix: string | null;
  suffix: string | null;
  key: string | null;
}

interface IChildrenMap {
  [char: string]: Node;
}

class Node implements INode {
  public end: boolean;
  public children: IChildrenMap;

  constructor(end: boolean = false) {
    this.end = false;
    this.children = {};
  }

  private longestPrefixMatch(key: string, match: string): IMatch {
    let i = 0;

    while (i < key.length && i < match.length && key[i] === match[i]) {
      i++;
    }

    const prefix = key.slice(0, i);
    const suffix = key.slice(i);
    const string = prefix.length > 0 ? key : null;

    return {
      prefix,
      suffix,
      key: string,
    };
  }

  public getLongestMatch(str: string): IMatch {
    const keys: string[] = Object.keys(this.children);

    // Iterate over each node name value
    for (let i = 0; i < keys.length; i++) {
      // key is a prefix candidate
      const prefix = keys[i];
      const match = this.longestPrefixMatch(prefix, str);

      // If a valid substring match is found
      if (match.key) {
        return match;
      }
    }

    // If no matches found
    return {
      prefix: null,
      suffix: null,
      key: null,
    };
  }
}

class PatriciaTrie implements IPatriciaTrie {
  public root: Node;

  constructor() {
    this.root = new Node();
  }

  public insert(word: string) {
    let node = this.root;
    let parentKey;

    while (word.length > 0) {
      let { prefix, suffix, key } = node.getLongestMatch(word);

      if (!prefix || !suffix || !key) {
        if (parentKey && Object.keys(node.children).length > 1) {
          // We have reached max edge limit (2) to branch from on this node
          // create new parent node pointing to existing child and append the new child as a sibling
          let newParent = new Node();
          newParent.children[parentKey] = node.children[parentKey];
          node.children[parentKey] = newParent;
          newParent.children[word] = new Node(true);

          delete node.children[parentKey];
        } else {
          node.children[word] = new Node(true);
        }

        return;
      } else {
        if (prefix.length === key.length) {
          // Full match of a key to an existing prefix edge - remove match (hence updating word) and continue with letter insertion
          node = node.children[key];
          parentKey = key;
          word = word.slice(key.length);
        } else {
          let newNode = new Node();
          newNode.children[suffix] = node.children[key];
          newNode.children[word.slice(prefix.length)] = new Node(true);
          delete node.children[key];
          node.children[prefix] = newNode;
          return;
        }
      }
    }

    node.end = true;
  }

  public search(word: string) {
    let node = this.root;

    while (word.length > 0) {
      let { prefix, suffix, key } = node.getLongestMatch(word);
      let match = prefix || suffix || key;

      if (!match || prefix?.length !== key?.length) {
        return false;
      }

      if (key) {
        node = node.children[key];
        word = word.slice(key.length);
      }
    }

    return node.end;
  }
}

export { PatriciaTrie };
