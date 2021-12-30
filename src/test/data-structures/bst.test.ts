import { BinarySearchTree, BSTNode as Node } from '@lib/data-structures/index';

//            10
//     6              15
//  3    8               20

function generateBinarySearchTree<T>(arr: T[]): BinarySearchTree<T> {
  const tree = new BinarySearchTree<T>();
  arr.forEach((item) => tree.insert(item));
  return tree;
}

function generateBinarySearchTreeRecursive<T>(arr: T[]): BinarySearchTree<T> {
  const tree = new BinarySearchTree<T>();
  arr.forEach((item) => tree.insert2(item));
  return tree;
}

describe('#BinarySearchTree', () => {
  it('should create a binary search tree', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.root!.value).toBe(10);
    expect(tree.root!.left!.value).toBe(6);
    expect(tree.root!.right!.value).toBe(15);
    expect(tree.root!.left!.left!.value).toBe(3);
    expect(tree.root!.left!.right!.value).toBe(8);
    expect(tree.root!.right!.right!.value).toBe(20);
    expect(tree.size).toBe(6);
  });

  it('should create a binary search tree (recursive insert)', () => {
    const tree = generateBinarySearchTreeRecursive([10, 6, 15, 3, 8, 20]);
    expect(tree.root!.value).toBe(10);
    expect(tree.root!.left!.value).toBe(6);
    expect(tree.root!.right!.value).toBe(15);
    expect(tree.root!.left!.left!.value).toBe(3);
    expect(tree.root!.left!.right!.value).toBe(8);
    expect(tree.root!.right!.right!.value).toBe(20);
    expect(tree.size).toBe(6);
  });

  it('should determine whether the binary search tree contains a certain value', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.contains(10)).toBeTruthy();
    expect(tree.contains(6)).toBeTruthy();
    expect(tree.contains(15)).toBeTruthy();
    expect(tree.contains(3)).toBeTruthy();
    expect(tree.contains(8)).toBeTruthy();
    expect(tree.contains(20)).toBeTruthy();
    expect(tree.contains(21)).toBeFalsy();
  });

  it('should return the node or null when searching for a binary search tree value', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.find(10)).not.toBeNull();
    expect(tree.find(10)!.value).toBe(10);
    expect(tree.find(6)).not.toBeNull();
    expect(tree.find(15)).not.toBeNull();
    expect(tree.find(3)).not.toBeNull();
    expect(tree.find(8)).not.toBeNull();
    expect(tree.find(20)).not.toBeNull();
    expect(tree.find(21)).toBeNull();
  });

  it('should find the min node value of the binary search tree', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.findMin()).toBe(3);
  });

  it('should find the max node value of the binary search tree', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.findMax()).toBe(20);
  });

  it('should determine whether a value is present or not in a binary search tree', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.isPresent(3)).toBe(true);
    expect(tree.isPresent(5)).toBe(false);
  });

  it('should remove a value from the binary search tree', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    tree.remove(3);
    //            10
    //        6              15
    //  null    8               20
    expect(tree.root!.left!.left).toBe(null);
    expect(tree.root!.left!.right!.value).toBe(8);
    expect(tree.size).toBe(5);

    tree.remove(6);
    //            10
    //        8              15
    //  null    null           20
    expect(tree.root!.left!.left).toBe(null);
    expect(tree.root!.left!.right).toBe(null);
    expect(tree.root!.left!.value).toBe(8);
    expect(tree.root!.right!.value).toBe(15);
    expect(tree.root!.right!.left).toBe(null);
    expect(tree.root!.right!.right!.value).toBe(20);
    expect(tree.size).toBe(4);
  });

  it('should print out the depth first search in-order result in the expected order', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.DFSInOrder()).toEqual([3, 6, 8, 10, 15, 20]);
  });

  it('should print out the depth first search pre-order result in the expected order', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.DFSPreOrder()).toEqual([10, 6, 3, 8, 15, 20]);
  });

  it('should print out the depth first search post-order result in the expected order', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.DFSPostOrder()).toEqual([3, 8, 6, 20, 15, 10]);
  });

  it('should print out the breadth first search result in the expected order', () => {
    const tree = generateBinarySearchTree([10, 6, 15, 3, 8, 20]);
    expect(tree.BFS()).toEqual([10, 6, 15, 3, 8, 20]);
  });
});
