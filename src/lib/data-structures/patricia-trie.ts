import createKeccakHash from 'keccak';

// Patricia tries are modified trie data structures
// NOTE: this is not a modified merkle patricia trie which is used by the Ethereum protocol to encode storage + world state (there are further complex changes made to traditional merkle trie design to optimise the storage structure)

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

type Hash = string;

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

class PatriciaTrie {
  public root: any;

  constructor() {
    this.root = {};
  }

  public add(tx: Transaction) {
    let node = this.root;
    let hash = tx.hash;

    for (let i = 0; i < hash.length; i++) {
      // char = current character of the transaction hash
      let char = hash[i];

      // if char node doesn't exist create a new one
      if (node[char] == undefined) {
        node[char] = {};
      }

      // traverse to char node
      node = node[char];
    }

    // node of final character of tx hash points to transaction data object
    node.data = tx;
  }

  public get(hash: Hash): Transaction | null {
    let node = this.root;

    // Traverse down tx hash string path (if any part of path is non-existent return null because transaction hash does not exist)
    for (let i = 0; i < hash.length; i++) {
      const char = hash[i];

      if (node) {
        node = node[char];
      } else {
        return null;
      }
    }

    return node.data ? node.data : null;
  }

  public remove(hash: Hash): boolean {
    let node = this.root;

    // Traverse down tx hash string path (return false if path doesnt exist)
    for (let i = 0; i < hash.length; i++) {
      const char = hash[i];

      if (node) {
        node = node[char];
      } else {
        return false;
      }
    }

    // if there is data pointed to by final character of tx hash, delete the data else return false for invalid delete operation
    if (node.data) {
      delete node.data;
      return true;
    } else {
      return false;
    }
  }
}

class TransactionList {
  public list: ITransaction[];

  constructor() {
    this.list = [];
  }

  public add(t: ITransaction) {
    this.list.push(t);
  }
}

const trie = new PatriciaTrie();
let transactionList = new TransactionList();

mockTransactions.forEach((v: any, i: number) => {
  transactionList.add(new Transaction(v.to, v.from, v.amount, v.id));
  trie.add(transactionList.list[i]);
});

console.log(trie.get('e89799872416a62940a671d2617fca8be0977d1f52289bc3bc94933421343c70')); // returns transaction object
console.log(trie.get('ee9799872416a62940a671d2617fca8be0977d1f52289bc3bc94933421343c70')); // returns null (non-existent transaction hash)

console.log(trie.remove('e89799872416a62940a671d2617fca8be0977d1f52289bc3bc94933421343c70')); // returns true
console.log(trie.remove('e89799872416a62940a671d2617fca8be0977d1f52289bc3bc94933421343c70')); // returns false (because tx no longer in trie)

export default PatriciaTrie;
