import createKeccakHash from 'keccak';

class MerkleTree {
  public root: MerkleTree;
  public hashes: string[];
  public leafCount: number;

  constructor(_leaves: string[]) {
    this.hashes = [];
    this.leafCount = _leaves.length;

    _leaves = hashTxValues(_leaves);
    let nodes = _leaves.map((x) => {
      this.hashes.push(x);
      return x;
    });

    while (nodes.length > 1) {
      let levelNodes = [];

      while (nodes.length > 1) {
        const first = nodes.shift();
        const second = nodes.shift();
        levelNodes.push(concatHash(first, second));
      }

      if (nodes.length === 1) {
        const last = nodes.shift();
        levelNodes.push(last, undefined!);
      }

      this.hashes = [...this.hashes, ...levelNodes];
      nodes = levelNodes;
    }
  }

  public getMerkleProof(idx: number): string[] {
    let proof = [];
    let hashPtr = 0;

    // n = the index on the respective level
    let n = idx;

    // load leaf hashes as current array
    let level = [...this.hashes.slice(0, this.leafCount)];

    while (level.length > 1) {
      if (level.length % 2) {
        level.push(undefined!);
      }

      if (n % 2 === 0) {
        // if current index is even, point to value right of it
        proof.push(level[n + 1]);
      } else {
        // if current index is odd, point to value left of it
        proof.push(level[n - 1]);
      }

      n = Math.floor(n / 2); // index (on the next level array) of next required hash
      hashPtr = hashPtr + level.length;
      level = [...this.hashes.slice(hashPtr, hashPtr + Math.pow(2, Math.log2(level.length) - 1))]; // array of next level nodes
    }

    return proof;
  }

  public verify(proof: string[], hash: string, root: string): boolean {
    let calculated = proof.reduce((acc, v) => {
      return concatHash(acc, v);
    }, hash);

    return calculated === root;
  }
}

function hashTxValues(arr: string[]): string[] {
  return arr.map((data) => keccak256(data));
}

function keccak256(data: string): string {
  return createKeccakHash('keccak256').update(JSON.stringify(data)).digest('hex');
}

function concatHash(left: string, right: string) {
  return createKeccakHash('keccak256')
    .update(left + right)
    .digest('hex');
}

let txArr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
let tree = new MerkleTree(txArr);

// verify inclusion of 'zero' in the Merkle tree
// proof = [h_01, h_11, h_21]
// hash (of 'zero') = 0231a2b550e3adcb6db5c7846099bb95b9400bfde9dd4acba7aabf1d526a65fc
// Merkle root = '5b78ea637f887072bb1f8f1cdcb7cbd60ef15f34678ae5dfe6f8f2d59a1f8bb6'

console.log('proof[0]: ', tree.getMerkleProof(0));
console.log('proof[1]: ', tree.getMerkleProof(1));
console.log('proof[2]: ', tree.getMerkleProof(2));
console.log('proof[3]: ', tree.getMerkleProof(3));
console.log('proof[4]: ', tree.getMerkleProof(4));
console.log('proof[5]: ', tree.getMerkleProof(5));
console.log('proof[6]: ', tree.getMerkleProof(6));
console.log('proof[7]: ', tree.getMerkleProof(7));

// let isZeroInTree = tree.verify(
//   [
//     '5ec1c62f24d95bdac9fdcb8c7db092e28ebcb12cb08da968fd3e5d918c0fea68',
//     'f01152de4eb22a632e3d7edb31b4e43466b4c36e4f70e647b8f93a9bd6c7ffeb',
//     'b9a82abd0d0a702183e0e3e2a6a88eb7481430e6eaca2ee0f35967b17e0cbf43',
//   ],
//   '0231a2b550e3adcb6db5c7846099bb95b9400bfde9dd4acba7aabf1d526a65fc',
//   '5b78ea637f887072bb1f8f1cdcb7cbd60ef15f34678ae5dfe6f8f2d59a1f8bb6'
// );

// console.log('zero in Merkle tree?', isZeroInTree);

// keccak256 of 'eight' = d4f4a2cfefbb804f85e6015f708170184e2b72298d1e747772e914a9c2867dbc
// console.log(keccak256('eight'));

export {};
