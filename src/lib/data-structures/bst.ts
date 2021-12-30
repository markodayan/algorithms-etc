interface Node<T> {
  value: T | null;
  right: Node<T> | null;
  left: Node<T> | null;
}

interface BinarySearchTree<T> {
  root: Node<T> | null;
  size: number;
  insert(val: T): BinarySearchTree<T> | null;
  insert2(val: T): BinarySearchTree<T> | null;
  contains(val: T): boolean;
  find(val: T): Node<T> | null;
  findMin(): T;
  findMax(): T;
  isPresent(val: T): boolean;
  remove(val: T): BinarySearchTree<T> | null;
  BFS(): T[];
  DFSPreOrder(): T[];
  DFSPostOrder(): T[];
  DFSInOrder(): T[];
}

class Node<T> {
  constructor(val: T) {
    this.value = val;
    this.right = null;
    this.left = null;
  }
}

class BinarySearchTree<T> implements BinarySearchTree<T> {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  public insert(val: T): BinarySearchTree<T> | null {
    let newNode: Node<T> = new Node(val);

    if (this.root === null) {
      this.root = newNode;
      this.size++;
      return this;
    } else {
      let current = this.root as Node<T>;
      while (true) {
        if (val === current.value) return null;
        if (val < (current.value as T)) {
          if (current.left === null) {
            current.left = newNode;
            this.size++;
            return this;
          } else {
            current = current.left;
          }
        } else if (val > (current.value as T)) {
          if (current.right === null) {
            current.right = newNode;
            this.size++;
            return this;
          } else {
            current = current.right;
          }
        }
      }
    }
  }

  /*
   * Recursive solution insert
   */
  public insert2(val: T): BinarySearchTree<T> | null {
    let newNode: Node<T> = new Node(val);

    if (this.root === null) {
      this.root = newNode;
      this.size++;
      return this;
    } else {
      const searchTree = (node: Node<T>): BinarySearchTree<T> | null => {
        // if val < node.value, go left
        if (val < (node.value as T)) {
          // if no left child, append new node
          if (!node.left) {
            node.left = newNode;
            this.size++;
            return this;
            // if left child, look left again
          } else {
            return searchTree(node.left);
          }
          // if val > node.value, go right
        } else if (val > (node.value as T)) {
          // if no right child, append new node
          if (!node.right) {
            node.right = newNode;
            this.size++;
            return this;
            // if right child, look right again
          } else {
            return searchTree(node.right);
          }
        } else {
          return null;
        }
      };

      return searchTree(this.root);
    }
  }

  public contains(val: T): boolean {
    if (this.root === null) return false;

    let current = this.root as Node<T>;

    while (current) {
      if (val < (current.value as T)) {
        current = current.left as Node<T>;
      } else if (val > (current.value as T)) {
        current = current.right as Node<T>;
      } else {
        return true;
      }
    }

    return false;
  }

  public find(val: T): Node<T> | null {
    if (this.root === null) return null;

    let current = this.root as Node<T>;
    let found: boolean = false;

    while (!found && current) {
      if (val < (current.value as T)) {
        current = current.left as Node<T>;
      } else if (val > (current.value as T)) {
        current = current.right as Node<T>;
      } else {
        found = true;
      }
    }

    if (!found) return null;
    return current;
  }

  public findMin(): T {
    let current = this.root as Node<T>;

    while (current.left) {
      current = current.left;
    }

    return current.value as T;
  }

  public findMax(): T {
    let current = this.root as Node<T>;

    while (current.right) {
      current = current.right;
    }

    return current.value as T;
  }

  public isPresent(val: T): boolean {
    if (this.root === null) return false;

    let current = this.root as Node<T>;
    let found: boolean = false;

    while (!found && current) {
      if (val < (current.value as T)) {
        current = current.left as Node<T>;
      } else if (val > (current.value as T)) {
        current = current.right as Node<T>;
      } else {
        found = true;
      }
    }

    return found;
  }

  public remove(val: T): BinarySearchTree<T> | null {
    if (this.root === null) return null;

    let current = this.root as Node<T>;
    let parent: Node<T> | null = null;
    let found: boolean = false;

    while (!found && current) {
      if (val < (current.value as T)) {
        parent = current;
        current = current.left as Node<T>;
      } else if (val > (current.value as T)) {
        parent = current;
        current = current.right as Node<T>;
      } else {
        found = true;
      }
    }

    if (!found) return null;

    if (current.left === null && current.right === null) {
      if (parent === null) {
        this.root = null;
      } else if (val < (parent.value as T)) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    } else if (current.left === null) {
      if (parent === null) {
        this.root = current.right;
      } else if (val < (parent.value as T)) {
        parent.left = current.right;
      } else {
        parent.right = current.right;
      }
    } else if (current.right === null) {
      if (parent === null) {
        this.root = current.left;
      } else if (val < (parent.value as T)) {
        parent.left = current.left;
      } else {
        parent.right = current.left;
      }
    } else {
      let successor = this.findMin();
      current.value = successor;
      this.remove(successor);
    }

    this.size--;
    return this;
  }

  /**
   * Breadth First Search -> level by level
   * @returns {Array<T>}
   */
  public BFS(): T[] {
    let data: T[] = [];
    let queue: Node<T>[] = [];
    let current = this.root as Node<T>;

    queue.push(current);

    while (queue.length) {
      current = queue.shift() as Node<T>;
      data.push(current.value as T);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return data;
  }

  /**
   * Depth First Search (Pre Order) -> DFS = branch by branch
   * root, left, right
   * @returns {T[]}
   */
  public DFSPreOrder(): T[] {
    let data: T[] = [];
    let current = this.root as Node<T>;

    function traverse(node: Node<T>) {
      // capture root node value
      data.push(node.value as T);
      // if left child exists, go left again
      if (node.left) traverse(node.left);
      // if right child exists, go right again
      if (node.right) traverse(node.right);
    }

    traverse(current);
    return data;
  }

  /**
   * Depth First Search (Post Order) -> DFS = branch by branch
   * left, right, root
   * @returns {T[]}
   */
  public DFSPostOrder(): T[] {
    let data: T[] = [];
    let current = this.root as Node<T>;

    function traverse(node: Node<T>) {
      // if left child exists, go left again
      if (node.left) traverse(node.left);
      // if right child exists, go right again
      if (node.right) traverse(node.right);
      // capture root node value
      data.push(node.value as T);
    }

    traverse(current);
    return data;
  }

  /**
   * Depth First Search (In Order) -> DFS = branch by branch
   * left, root, right
   * @returns {T[]}
   */
  public DFSInOrder(): T[] {
    let data: T[] = [];
    let current = this.root as Node<T>;

    function traverse(node: Node<T>) {
      // if left child exists, go left again
      if (node.left) traverse(node.left);
      // capture root node value
      data.push(node.value as T);
      // if right child exists, go right again
      if (node.right) traverse(node.right);
    }

    traverse(current);
    return data;
  }
}

function generateBinarySearchTree<T>(arr: T[]): BinarySearchTree<T> {
  const tree = new BinarySearchTree<T>();
  arr.forEach((item) => tree.insert(item));
  return tree;
}

export default BinarySearchTree;
export { Node };
