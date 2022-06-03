// left child: i * 2 + 1
// right child: i * 2 + 2
// parent (i - 1) / 2

import Heap from './abstract/heap';

class MinHeap extends Heap {
  public constructor(arr: number[]) {
    super(arr);
  }

  /* Insert value into correct position in heap */
  public insert(value: number) {
    this.arr.push(value);

    if (this.arr.length > 1) {
      let i = this.arr.length - 1; // index of last element
      let parentIndex = Math.floor((i - 1) / 2); // index of parent of last element

      // while element is less than its parent
      while (this.arr[i] < this.arr[parentIndex]) {
        // swap selected element with its parent
        [this.arr[parentIndex], this.arr[i]] = [this.arr[i], this.arr[parentIndex]];

        // If checking parent of root node -> break the while loop (heapify activity complete)
        if (parentIndex < 0) {
          break;
        } else {
          i = parentIndex;
          parentIndex = Math.floor((i - 1) / 2);
        }
      }
    }
  }

  /* Remove root element (smallest element of heap) */
  public remove() {
    const min = this.arr[0];
    const end = this.arr.pop();

    if (this.arr.length > 0) {
      this.arr[0] = end as number;
      this.sinkDown();
    }

    return min;
  }

  /* Utility method to help with tree shuffling */
  private sinkDown() {
    let i = 0;
    const length = this.arr.length;
    const element = this.arr[0];

    while (true) {
      let leftChildIndex = 2 * i + 1;
      let rightChildIndex = 2 * i + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.arr[leftChildIndex];
        if (leftChild < element) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.arr[rightChildIndex];

        if (
          (swap === null && rightChild < element) ||
          (swap === leftChildIndex && rightChild < (leftChild as number))
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;

      this.arr[i] = this.arr[swap];
      this.arr[swap] = element;
      i = swap;
    }
  }
}

export default MinHeap;
