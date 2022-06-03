import Heap from './abstract/heap';

// left child: i * 2 + 1
// right child: i * 2 + 2
// parent (i - 1) / 2

class MaxHeap extends Heap {
  public constructor(arr: number[]) {
    super(arr);
  }

  /* Insert value into correct position in heap */
  public insert(value: number) {
    console.log('insert');
    this.arr.push(value);

    if (this.arr.length > 1) {
      let i = this.arr.length - 1;
      let parentIndex = Math.floor((i - 1) / 2);

      // While element is greater than its parent
      while (this.arr[i] > this.arr[parentIndex]) {
        // swap selected element with its parent
        [this.arr[parentIndex], this.arr[i]] = [this.arr[i], this.arr[parentIndex]];

        if (parentIndex < 0) {
          break;
        } else {
          i = parentIndex;
          parentIndex = Math.floor((i - 1) / 2);
        }
      }
    }
  }

  /* Remove root element (largest element of heap) */
  public remove() {
    const max = this.arr[0];
    const end = this.arr.pop();

    if (this.arr.length > 0) {
      this.arr[0] = end as number;
      this.sinkDown();
    }

    return max;
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
        if (leftChild > element) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.arr[rightChildIndex];

        if (
          (swap === null && rightChild > element) ||
          (swap === leftChildIndex && rightChild > (leftChild as number))
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

export default MaxHeap;
