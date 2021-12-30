import Stack from '@lib/data-structures/stack';

describe('#Stack', () => {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  stack.push(4);

  it('should create a stack', () => {
    expect(stack).toBeInstanceOf(Stack);
  });

  it('should have length of 4', () => {
    expect(stack.size).toBe(4);
  });

  it('Should correctly predict the positions of elements pushed to the stack', () => {
    expect(stack.first!.value).toBe(4);
    expect(stack.first!.next!.value).toBe(3);
    expect(stack.first!.next!.next!.value).toBe(2);
    expect(stack.first!.next!.next!.next!.value).toBe(1);
    expect(stack.last!.value).toBe(1);
  });

  it('should pop 2 elements off the stack leaving the new top with the value of 2 and with 1 being the last element', () => {
    stack.pop();
    stack.pop();
    expect(stack.first!.value).toBe(2);
    expect(stack.first!.next!.value).toBe(1);
    expect(stack.last!.value).toBe(1);
  });
});
