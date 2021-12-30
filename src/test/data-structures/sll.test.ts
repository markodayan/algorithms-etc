import { SinglyLinkedList, Node } from '@lib/data-structures/index';

function generateLinkedList(arr: number[]): SinglyLinkedList<number> {
  const linkedList = new SinglyLinkedList<number>();
  arr.forEach((item) => linkedList.push(item));
  return linkedList;
}

describe('#SinglyLinkedList', () => {
  it('should create a singly linked list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list).toBeInstanceOf(SinglyLinkedList);
  });

  it('should return the correct head and tail values of the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.head).toBeInstanceOf(Node);
    expect(list.head!.value).toBe(1);
    expect(list.tail).toBeInstanceOf(Node);
    expect(list.tail!.value).toBe(4);
  });

  it('should have length of 4', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.length).toBe(4);
  });

  it('should push a new node to the end of the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.push(5)).toBeInstanceOf(SinglyLinkedList);
    expect(list.length).toBe(5);
    expect(list.print()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should pop off last node from the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.pop()).toBeInstanceOf(Node);
    expect(list.length).toBe(3);
    expect(list.print()).toEqual([1, 2, 3]);
  });

  it('should shift the head from the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.shift()).toBeInstanceOf(Node);
    expect(list.length).toBe(3);
    expect(list.print()).toEqual([2, 3, 4]);
  });

  it('should unshift a new node as the head of the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.unshift(0)).toBeInstanceOf(SinglyLinkedList);
    expect(list.length).toBe(5);
    expect(list.print()).toEqual([0, 1, 2, 3, 4]);
  });

  it('should get a node at a specified index in the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.get(2)).toBeInstanceOf(Node);
    expect(list.get(2)!.value).toBe(3);
  });

  it('should set a value at a specified index in the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.set(2, 5)).toBeTruthy();
    expect(list.print()).toEqual([1, 2, 5, 4]);
  });

  it('should insert a value at a specified index in the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    list.insert(2, 5);
    expect(list.print()).toEqual([1, 2, 5, 3, 4]);
  });

  it('should remove a value at a specified index in the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    list.remove(2);
    expect(list.print()).toEqual([1, 2, 4]);
  });

  it('should reverse a linked list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    const reversedList: SinglyLinkedList<number> = list.reverse();
    expect(reversedList.print()).toEqual([4, 3, 2, 1]);
  });

  it('should print the correct node values in the list', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.print()).toEqual([1, 2, 3, 4]);
  });

  it('should find a value specified and return the node', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.find(3)).toBeInstanceOf(Node);
    expect(list.find(3)!.value).toBe(3);
  });

  it('should search for a value and return the node', () => {
    const list: SinglyLinkedList<number> = generateLinkedList([1, 2, 3, 4]);
    expect(list.search((val) => val === 3)).toBeInstanceOf(Node);
    expect(list.search((val) => val === 3)!.value).toBe(3);
  });
});
