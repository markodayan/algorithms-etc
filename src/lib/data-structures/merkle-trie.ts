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

  constructor(entries: T[]) {
    let nodes: MerkleNode<T>[] = entries.map((x) => new LeafNode<T>(x));

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
  public merkleProofRequirements(dataHash: string): string[] {
    return [];
  }

  public verifyMerkleProof(calculatedMerkleRoot: string): boolean {
    return this.root.hash === calculatedMerkleRoot;
  }
}

const first = new MerkleTrie<string>(['one', 'two', 'three', 'four']);

// function hash(data: string): string {
//   return createKeccakHash('keccak256').update(JSON.stringify(data)).digest('hex');
// }

// function hashChildren(left: string, right: string) {
//   return createKeccakHash('keccak256')
//     .update(left + right)
//     .digest('hex');
// }

// // these are okay
// let calcOne = hash('one');
// let calcTwo = hash('two');
// let calcThree = hash('three');
// let calcFour = hash('four');

// let calc12 = hashChildren(calcOne, calcTwo);
// let calc34 = hashChildren(calcThree, calcFour);

// let calcMerkleRoot = hashChildren(calc12, calc34);
// console.log('valid merkle proof:', first.verifyMerkleProof(calcMerkleRoot));

// console.log('Merkle Root: ', first.root.hash);
// console.log('Calculated Root:', calcMerkleRoot);

// Scenario - I receive transaction 'two' from an untrusted source, I want to verify that it is a valid transaction. What I currently have is a Merkle Tree. I can verify transaction 'two' by hashing all the nodes that lead to the Merkle root of the tree. This involves calculating the hash of transaction 'two', calculating the hash of the parent node by hashing this transaction node with its neightbour, Recursively do this until we reach the root. Compare the calculated root with that of the Merkle root, if they are the same then transaction 'two' is valid. In a Merkle Trie, the data can be verified in O(logn) time since we only calculate logn hashes.

export default MerkleTrie;
