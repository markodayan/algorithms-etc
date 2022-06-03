/* A binary heap is a partially-ordered binary tree which satisfies the heap property */

interface IRelationshipValues {
  parent: {
    index: number | null;
    value: number | null;
  } | null;
  index: number;
  value: number;
  left: number | null;
  right: number | null;
}

interface IDirectChildrenRecord {
  [parentIndex: string]: IRelationshipValues;
}

abstract class Heap {
  public arr: number[];
  public readonly input: number[];

  public constructor(arr: number[]) {
    this.arr = [];

    arr.forEach((v) => {
      this.insert(v);
    });

    this.input = arr;
  }

  abstract insert(value: number): void;
  abstract remove(): number;

  public visualizeHeap() {
    let i = this.calculateLevelIndex();
    let len = 2 * Math.pow(2, i);
    let matrixWidth = len % 2 === 0 ? len : len + 2;
    let matrixHeight = (i + 1) * 2;
    let matrix: (number | undefined | string)[][] = [];
    let defaultMatrixRow = [];
    let copy = [...this.arr];

    for (let j = 0; j < matrixWidth; j++) {
      defaultMatrixRow.push(' ');
    }

    for (let k = 0; k < matrixHeight; k++) {
      matrix.push([...defaultMatrixRow]);
    }

    if (len % 2 === 0) {
      for (let l = 0; l <= i; l++) {
        let denominator = Math.pow(2, l + 1);
        for (let m = 0; m < Math.pow(2, l); m++) {
          let index = matrixWidth / denominator + 2 * m * (matrixWidth / denominator) - 1;
          matrix[2 * l][index] = copy.shift();
        }
      }
    } else {
    }

    console.table(matrix);
    console.log(`Heap Length: ${this.arr.length}`);
    console.log(`Width: ${matrixWidth} Height: ${matrixHeight}`);
  }

  private calculateLevelIndex() {
    let i = 0;
    let cumulative = 1;

    while (this.arr.length > cumulative) {
      cumulative += Math.pow(2, i + 1);
      i++;
    }

    console.log(`maxLevelIndex: ${i}`);
    return i;
  }

  public print() {
    console.log('input array:', this.input);
    console.log('heap array:', this.arr);
  }

  public printParentDetails() {
    let record: IDirectChildrenRecord = {};

    this.arr.forEach((v: number, i: number) => {
      if (i === 0) {
        record[i] = {
          value: v,
          index: i,
          left: null,
          right: null,
          parent: null,
        };
      } else {
        record[i] = {
          value: v,
          index: i,
          left: null,
          right: null,
          parent: {
            value: null,
            index: null,
          },
        };
      }
    });

    this.arr.forEach((v: number, i: number) => {
      let parentIndex = Math.floor((i - 1) / 2);

      if (i !== 0) {
        (record[i].parent!.value = this.arr[parentIndex]), (record[i].parent!.index = parentIndex);

        if (!record[parentIndex].left) {
          record[parentIndex].left = v;
        } else {
          record[parentIndex].right = v;
        }
      }
    });

    console.log(record);
  }
}

export default Heap;
