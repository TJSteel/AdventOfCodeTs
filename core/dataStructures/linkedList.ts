export class LinkedListNode<T> {
  data: T;
  previous: LinkedListNode<T> | null = null;
  next: LinkedListNode<T> | null = null;
  constructor(data: T) {
    this.data = data;
  }
}

export class LinkedList<T> implements Iterable<T> {
  start: LinkedListNode<T>;
  end: LinkedListNode<T>;
  length: number;
  constructor(data: T[]) {
    if (data.length == 0) {
      throw new Error('Cannot create a LinkedList with 0 elements');
    }
    const start: LinkedListNode<T> = new LinkedListNode(data[0]);
    this.start = start;
    this.end = start;
    this.length = 1;
    for (let i = 1; i < data.length; i++) {
      this.insertAtEnd(data[i]);
    }
  }

  /**
   * inserts an element at the start of the list
   * @param data
   */
  insertAtStart(data: T): void {
    const node: LinkedListNode<T> = new LinkedListNode(data);

    this.start.previous = node;
    node.next = this.start;
    this.start = node;
    this.length++;
  }

  /**
   * inserts an element at the end of the list
   * @param data
   */
  insertAtEnd(data: T): void {
    const node: LinkedListNode<T> = new LinkedListNode(data);

    this.end.next = node;
    node.previous = this.end;
    this.end = node;
    this.length++;
  }

  /**
   * removes and returns the first node in the list
   * @returns `LinkedListNode<T>` from the start of the list
   * @throws Error if the list only contains one element
   */
  shiftNode(): LinkedListNode<T> {
    if (this.length == 1) {
      throw new Error('Cannot remove the only element in a LinkedList');
    }
    const node = this.start;
    this.start = this.start.next!;
    this.start.previous = null;
    this.length--;
    return node;
  }

  /**
   * removes and returns the first element in the list
   * @returns `<T>` from the start of the list
   * @throws Error if the list only contains one element
   */
  shift(): T {
    return this.shiftNode().data;
  }

  /**
   * removes and returns the last node in the list
   * @returns `LinkedListNode<T>` from the end of the list
   * @throws Error if the list only contains one element
   */
  popNode(): LinkedListNode<T> {
    if (this.length == 1) {
      throw new Error('Cannot remove the only element in a LinkedList');
    }
    const node = this.end;
    this.end = this.end.previous!;
    this.end.next = null;
    this.length--;
    return node;
  }

  /**
   * removes and returns the last element in the list
   * @returns `<T>` from the end of the list
   * @throws Error if the list only contains one element
   */
  pop(): T {
    return this.popNode().data;
  }

  /**
   * @param index a positive index removes from the start,
   * if a negative index is provided it will return the index at length + index
   * eg if -1 is provided the last element will be removed
   * @returns `LinkedListNode<T>` at the specified index
   * @throws Error if out of range or only one element is remaining
   */
  removeNode(index: number): LinkedListNode<T> {
    if (this.length == 1) {
      throw new Error('Cannot remove the only element in a LinkedList');
    }
    if (index < 0) {
      index = this.length + index;
    }
    let node = this.getNode(index);
    let previous = node.previous;
    let next = node.next;
    if (previous) {
      previous.next = next;
    }
    if (next) {
      next.previous = previous;
    }
    this.length--;
    return node;
  }

  /**
   * @param index a positive index removes from the start,
   * if a negative index is provided it will return the index at length + index
   * eg if -1 is provided the last element will be removed
   * @returns `<T>` at the specified index
   * @throws Error if out of range or only one element is remaining
   */
  remove(index: number): T {
    return this.removeNode(index).data;
  }

  /**
   * reverses the order of the linked list
   * @returns reference to LinkedList so the method can be chained
   */
  reverse(): LinkedList<T> {
    let node: LinkedListNode<T> | null = this.start;
    this.start = this.end;
    this.end = node!;

    while (node) {
      const next: LinkedListNode<T> | null = node.next;
      node.next = node.previous;
      node.previous = next;
      node = next;
    }
    return this;
  }

  /**
   * @param index a positive index gets from the start,
   * if a negative index is provided it will return the index at length + index
   * eg if -1 is provided the last element will be returned
   * @returns `LinkedListNode<T>` at the specified index
   * @throws Error if out of range
   */
  getNode(index: number): LinkedListNode<T> {
    if (index > this.length - 1) {
      throw new Error(`${index} is an invalid index for range [0 to ${this.length - 1}]`);
    }

    if (index < 0) {
      const negativeIndex = this.length + index;
      if (negativeIndex < 0) {
        throw new Error(`${index} is an invalid negative index for range [${-this.length} to -1]`);
      }
      index = negativeIndex;
    }

    let node = this.start;
    while (index-- > 0) {
      node = node.next!;
    }
    return node;
  }

  /**
   * @param index a positive index gets from the start,
   * if a negative index is provided it will return the index at length + index
   * eg if -1 is provided the last element will be returned
   * @returns `<T>` at the specified index
   * @throws Error if out of range
   */
  get(index: number): T {
    return this.getNode(index).data;
  }

  /**
   * @param index a positive index gets from the start,
   * if a negative index is provided it will return the index at length + index
   * eg if -1 is provided the last element will be returned
   * @returns `<T>` at the specified index
   * @throws Error if out of range
   */

  /**
   * creates a new LinkedListNode<T> and inserts this after the node at the specified index
   * @param index a positive index gets from the start,
   * if a negative index is provided it the index will be length + index
   * eg if -1 is provided the element will be inserted after the last element
   * @param data `<T>` to be inserted after the index node
   */
  insertAfter(index: number, data: T): void {
    const node: LinkedListNode<T> = new LinkedListNode(data);

    const previous = this.getNode(index);
    const next = previous.next;
    if (next) {
      next.previous = node;
    } else {
      this.end = node;
    }
    previous.next = node;

    node.next = next;
    node.previous = previous;
    this.length++;
  }

  /**
   * creates a new `LinkedListNode<T>` and inserts this before the node at the specified index
   * @param index a positive index gets from the start,
   * if a negative index is provided it the index will be `length` + index
   * eg if -1 is provided the element will be inserted before the last element
   * @param data `<T>` to be inserted before the index node
   */
  insertBefore(index: number, data: T): void {
    const node: LinkedListNode<T> = new LinkedListNode(data);

    const next = this.getNode(index);
    const previous = next.previous;
    if (previous) {
      previous.next = node;
    } else {
      this.start = node;
    }
    next.previous = node;

    node.next = next;
    node.previous = previous;
    this.length++;
  }

  /**
   * searches the linked list from start to end and returns the first
   * object which when passed to the predicate function returns true
   * @param predicate a function to determine if `<T>` value is found
   * @returns `<T>` if found, `null` if not
   */
  find(predicate: (data: T) => boolean): T | null {
    for (const node of this) {
      if (predicate(node)) {
        return node;
      }
    }
    return null;
  }

  /**
   * returns an array of all objects in the list in order of start to end
   * @returns `<T>[]`
   */
  toArray(): T[] {
    return [...this];
  }

  /**
   * reduces all `<T>` in the list into a single `<T>`
   * @param reducer function to combine two `<T>` elements
   * @param start the `<T>` element to start with
   * @returns `<T>`
   */
  reduce(reducer: (a: T, b: T) => T, start: T): T {
    let value: T = JSON.parse(JSON.stringify(start));
    let node: LinkedListNode<T> | null = this.start;
    while (node) {
      value = reducer(value, node.data);
      node = node.next;
    }
    return value;
  }

  [Symbol.iterator](): Iterator<T> {
    let next: LinkedListNode<T> | null = this.start;
    const end = (): IteratorResult<T> => {
      return { done: true, value: null };
    };

    return {
      next(): IteratorResult<T> {
        if (!next) {
          return end();
        }
        const value = next!.data;
        next = next!.next;
        return { done: false, value };
      },
      return: end,
    };
  }
}
