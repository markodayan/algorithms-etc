import createKeccakHash from 'keccak';

interface TXBodyType {
  to: number;
  from: number;
  amount: number;
  id: number;
  hash: string;
}

const mockTransactions = [
  {
    to: 111,
    from: 222,
    amount: 500,
    id: 0,
  },
  {
    to: 333,
    from: 444,
    amount: 40,
    id: 1,
  },
  {
    to: 555,
    from: 666,
    amount: 29,
    id: 2,
  },
  {
    to: 777,
    from: 888,
    amount: 42,
    id: 3,
  },
  {
    to: 999,
    from: 2022,
    amount: 13,
    id: 4,
  },
];

function transactionAdapter(t: TXBodyType): Transaction {
  return new Transaction(t.to, t.from, t.amount, t.id, t.hash);
}

interface ITransaction {
  to: number;
  from: number;
  amount: number;
  id: number;
  hash: string;
  getHash(): string;
}

class Transaction implements ITransaction {
  public to: number;
  public from: number;
  public amount: number;
  public hash: string;
  public id: number;

  constructor(to: number, from: number, amount: number, id: number, hash?: string) {
    this.to = to;
    this.from = from;
    this.amount = amount;
    this.hash = hash ? hash : createKeccakHash('keccak256').update(to.toString()).digest('hex');
    this.id = id;
  }

  public getHash(): string {
    return this.hash;
  }
}

class TransactionList {
  public list: (ITransaction | string)[];

  constructor() {
    this.list = [];
  }

  public add(t: ITransaction) {
    this.list.push(t);
  }
}

type Hash = string;

class MerkleTrie {
  public root: (ITransaction[] | Hash[])[];

  constructor() {
    this.root = [];
  }

  public createTrie(transactionList: any) {
    this.root.unshift(transactionList); // add transaction array to merkle array
    this.root.unshift(transactionList.map((t: any) => t.hash)); // add array of the transaction hashes to merkle root array

    // While first element of the merkle array is not the single merkle root
    while (!this.haveMerkleRoot()) {
      let temp = [];
      let levelNodeCount = this.root[0].length;

      for (let i = 0; i < levelNodeCount; i += 2) {
        let hasHashPartner = i % 2 === 0;

        if (i < this.root[0].length - 1) {
          const child1: Hash = this.root[0][i] as string;
          const child2: Hash = this.root[0][i + 1] as string;

          const parent: Hash = createKeccakHash('keccak256')
            .update(child1 + child2)
            .digest('hex');

          temp.push(parent);
        } else {
          temp.push(this.root[0][i]);
        }
      }

      this.root.unshift(temp as any);
    }
  }

  private haveMerkleRoot(): boolean {
    return this.root[0].length <= 1;
  }

  public verify(transaction: ITransaction | TXBodyType) {
    let position = this.root.slice(-1)[0].findIndex((t: any) => t.hash == transaction.hash);

    const txIndex = position;
    const leafHashLevel = this.root.length - 2;

    if (position !== -1) {
      const valid = ['to', 'from', 'amount', 'hash', 'id'].reduce(
        (acc: boolean, v: string) =>
          acc === false ? false : (this.root.slice(-1)[0][position] as any)[`${v}`] === (transaction as any)[`${v}`],
        true
      );

      if (!valid) {
        console.log('Invalid: correct tx hash - invalid tx body)');
        return;
      }

      let verifyHash = transaction.hash;

      for (let level = leafHashLevel; level > 0; level--) {
        let neighbour = null;

        // position = index of the level node (we want to find its neighbour to help compute its parent)
        if (position % 2 == 0) {
          neighbour = this.root[level][position + 1];

          // if no right neigbour
          if (!neighbour) {
            neighbour = verifyHash;
          } else {
            verifyHash = createKeccakHash('keccak256')
              .update(verifyHash + neighbour)
              .digest('hex');
          }

          // Update position corresponding to computed level node
          position = Math.floor(position / 2);
        } else {
          // our current node is a right neighbour, hence we need to find a left neighbour
          neighbour = this.root[level][position - 1];
          position = Math.floor((position - 1) / 2);

          verifyHash = createKeccakHash('keccak256')
            .update(neighbour + verifyHash)
            .digest('hex');
        }
      }

      console.log(verifyHash == this.root[0][0] ? `Valid [transaction index = ${txIndex}]` : 'Not Valid');
    } else {
      console.log('Invalid: Data not found with the id');
    }
  }
}

let transactionList = new TransactionList();

mockTransactions.forEach((v: any) => {
  transactionList.add(new Transaction(v.to, v.from, v.amount, v.id));
});

const trie = new MerkleTrie();
trie.createTrie(transactionList.list);

const fakeTx = new Transaction(123, 567, 100, 3);

const existingTx = {
  to: 333,
  from: 444,
  amount: 40,
  hash: 'b8af24a884ce251f7b69c435d70b26b4d69041695ff24aab1b55d194a3fdd883',
  id: 1,
};

const ExistingHashInvalidInformation = {
  to: 555,
  from: 666,
  amount: 29.1, // meant to be 29
  hash: '22615f586e4a86b23ead367df957a03709c50c3e9f8d9d951d77eb93984a0744',
  id: 2,
};

// trie.verify(transactionList.list[3] as ITransaction); // Valid
// trie.verify(fakeTx as ITransaction); // Invalid (Data not found with the id)
// trie.verify(existingTx); // Valid
// trie.verify(transactionAdapter(ExistingHashInvalidInformation)); // Invalid Transaction (Existing Hash - Invalid TX)

// trie.verify(transactionList.list[0] as ITransaction); // Valid
// We have the hash for transaction 0 (hash_0)
// 1. hash against hash_1 (to produce hash_01)
// 2. hash against hash_23 (to produce hash_0123)
// 3. hash against hash_4 (to produce the merkle root hash_01234)

// trie.verify(transactionList.list[1] as ITransaction); // Valid
// We have the hash for transaction 1 (hash_1)
// 1. hash against hash_0 (to produce hash_01)
// 2. hash against hash_23 (to produce hash_0123)
// 3. hash against hash_4 (to produce the merkle root hash_01234)

trie.verify(transactionList.list[2] as ITransaction); // Valid
// We have the hash for transaction 2 (hash_2)
// 1. hash against hash_3 (to produce hash_23)
// 2. hash against hash_01 (to produce hash_0123 )
// 3. hash against hash_4 (to produce the merkle root hash_01234)

// trie.verify(transactionList.list[3] as ITransaction); // Valid
// We have the hash for transaction 2 (hash_3)
// 1.
// 2.
// 3.

// trie.verify(transactionList.list[4] as ITransaction); // Valid
// We have the hash for transaction 2 (hash_4)
// 1.
// 2.
// 3.

export default MerkleTrie;
