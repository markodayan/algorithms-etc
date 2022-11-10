// Merkle Trie
// The importance of Merkle Tries is in its ability to verify data with efficiency. O(h) time complexity due to us not needing the entire trie for verification.

// Assumptions made: All tries are binary, balanced, and the number of transactions to be stored are an exponent of two.
import createKeccakHash from 'keccak';

abstract class MerkleNode<T> {
  public hash: string;

  public compare(node: MerkleNode<T>): boolean {
    return this.hash === node.hash;
  }
}

/* This node contains the data payload */
class LeafNode<T> extends MerkleNode<T> {
  public hash: string;

  constructor(data: T) {
    super();
    this.hash = createKeccakHash('keccak256').update(JSON.stringify(data)).digest('hex');
  }
}

/* This node contains children and its hash is determined via concatenation and SHA-3 hashing applied after */
class ExtensionNode<T> extends MerkleNode<T> {
  public hash: string;

  constructor(left: MerkleNode<T>, right: MerkleNode<T>) {
    super();
    this.hash = createKeccakHash('keccak256')
      .update(left.hash + right.hash)
      .digest('hex');
  }
}

class MerkleTrie<T> {
  public root: MerkleNode<T>;
  public leaves: LeafNode<T>[];

  constructor(entries: T[]) {
    this.leaves = [];
    let nodes: MerkleNode<T>[] = entries.map((x) => {
      let leaf = new LeafNode<T>(x);
      this.leaves.push(leaf);
      return leaf;
    });

    while (nodes.length > 1) {
      nodes = this.generateLevel(nodes);
    }

    this.root = nodes[0];
  }

  private generateLevel<T>(nodes: MerkleNode<T>[]) {
    const result: MerkleNode<T>[] = [];

    while (nodes.length > 1) {
      const first = nodes.shift() as MerkleNode<T>;
      const second = nodes.shift() as MerkleNode<T>;
      result.push(new ExtensionNode<T>(first, second));
    }

    if (nodes.length === 1) {
      const last = nodes.shift() as MerkleNode<T>;
      result.push(new ExtensionNode<T>(last, undefined!));
    }

    return result;
  }

  // Given a transaction/data root, generate the list of required hashes needed to verify the transaction (compare against the merkle root)
  public getMerkleProof(leaves: string[], idx: number): string[] {
    return [];
  }

  public verify(calculatedMerkleRoot: string): boolean {
    return this.root.hash === calculatedMerkleRoot;
  }
}

const first = new MerkleTrie<string>(['one', 'two', 'three', 'four']);

function hash(data: string): string {
  return createKeccakHash('keccak256').update(JSON.stringify(data)).digest('hex');
}

function hashChildren(left: string, right: string) {
  return createKeccakHash('keccak256')
    .update(left + right)
    .digest('hex');
}

// // these are okay
let calcOne = hash('one');
let calcTwo = hash('two');
let calcThree = hash('three');
let calcFour = hash('four');

let calc12 = hashChildren(calcOne, calcTwo);
let calc34 = hashChildren(calcThree, calcFour);

let calcMerkleRoot = hashChildren(calc12, calc34);
console.log('valid merkle proof:', first.verify(calcMerkleRoot));

console.log('Merkle Root: ', first.root.hash);
console.log('Calculated Root:', calcMerkleRoot);

const second = new MerkleTrie<string>(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven']);

let h_00 = hash('zero');
let h_01 = hash('one');
let h_02 = hash('two');
let h_03 = hash('three');

let h_04 = hash('four');
let h_05 = hash('five');
let h_06 = hash('six');
let h_07 = hash('seven');

let h_10 = hashChildren(h_00, h_01);
let h_11 = hashChildren(h_02, h_03);
let h_12 = hashChildren(h_04, h_05);
let h_13 = hashChildren(h_06, h_07);

let h_20 = hashChildren(h_10, h_11);
let h_21 = hashChildren(h_12, h_13);

let h_30 = hashChildren(h_20, h_21);

console.log('[0] h_00', h_00);
console.log('[1] h_01', h_01);
console.log('[2] h_02', h_02);
console.log('[3] h_03', h_03);

console.log('[4] h_04', h_04);
console.log('[5] h_05', h_05);
console.log('[6] h_06', h_06);
console.log('[7] h_07', h_07);

console.log('----');
console.log('[8] h_10', h_10);
console.log('[9] h_11', h_11);
console.log('[10] h_12', h_12);
console.log('[11] h_13', h_13);

console.log('----');
console.log('[12] h_20', h_20);
console.log('[13] h_21', h_21);

console.log('-----');
console.log('[14] h_30 (merkle root)', h_30);
console.log('8 tx merkle root: ', second.root.hash);

// Scenario - I receive transaction 'two' from an untrusted source, I want to verify that it is a valid transaction. What I currently have is a Merkle Tree. I can verify transaction 'two' by hashing all the nodes that lead to the Merkle root of the tree. This involves calculating the hash of transaction 'two', calculating the hash of the parent node by hashing this transaction node with its neightbour, Recursively do this until we reach the root. Compare the calculated root with that of the Merkle root, if they are the same then transaction 'two' is valid. In a Merkle Trie, the data can be verified in O(logn) time since we only calculate logn hashes.

export default MerkleTrie;
