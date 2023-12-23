import { assert, expect } from 'chai';
import { LinkedList } from './linkedList';

describe('Linked List', () => {
  describe('constructor', () => {
    it('should create a linked list with 0 elements', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);
      expect(linkedList.length).equals(0);
      expect(linkedList.start).to.be.null;
      expect(linkedList.end).to.be.null;
    });

    it('should create a linked list with 3 elements', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      expect(linkedList.length).equals(5);
      expect(linkedList.start).not.to.be.null;
      expect(linkedList.end).not.to.be.null;
    });
  });

  describe('insertAtStart', () => {
    it('should insert an element at the start of an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);
      const value = 0;
      linkedList.insertAtStart(value);

      expect(linkedList.length).equals(1);
      expect(linkedList.start!.data).equals(value);
      expect(linkedList.end!.data).equals(value);
    });

    it('should insert an element at the start', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const currentStart = linkedList.start;
      expect(currentStart!.previous).to.be.null;

      const value = 0;
      linkedList.insertAtStart(value);

      expect(currentStart!.previous).to.deep.equal(linkedList.start);
      expect(linkedList.length).equals(6);
      expect(linkedList.start!.data).equals(value);
    });
  });

  describe('insertAtEnd', () => {
    it('should insert an element at the end of an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);
      const value = 0;
      linkedList.insertAtEnd(value);

      expect(linkedList.length).equals(1);
      expect(linkedList.start!.data).equals(value);
      expect(linkedList.end!.data).equals(value);
    });

    it('should insert an element at the end', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const currentEnd = linkedList.end;
      expect(currentEnd!.next).to.be.null;

      const value = 6;
      linkedList.insertAtEnd(value);

      expect(currentEnd!.next).to.deep.equal(linkedList.end);
      expect(linkedList.length).equals(6);
      expect(linkedList.end!.data).equals(value);
    });
  });

  describe('shiftNode', () => {
    it('should throw error if attempting to remove from an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);

      assert.throws(() => {
        linkedList.shiftNode();
      }, `Cannot remove from an empty LinkedList`);
    });

    it('should remove the first element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      const start = linkedList.start;
      const shifted = linkedList.shiftNode();

      expect(start).to.deep.equal(shifted);
    });

    it('should remove the final element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1]);
      const removed = linkedList.shiftNode();
      expect(removed.data).to.equal(1);
      expect(linkedList.length).equals(0);
      expect(linkedList.start).to.be.null;
      expect(linkedList.end).to.be.null;
    });
  });

  describe('shift', () => {
    it('should throw error if attempting to remove from an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);

      assert.throws(() => {
        linkedList.shift();
      }, `Cannot remove from an empty LinkedList`);
    });

    it('should remove the first element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      const shifted = linkedList.shift();

      expect(shifted).to.equal(1);
    });
  });

  describe('popNode', () => {
    it('should throw error if attempting to remove from an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);

      assert.throws(() => {
        linkedList.popNode();
      }, `Cannot remove from an empty LinkedList`);
    });

    it('should remove the last element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1]);

      const end = linkedList.end;
      const popped = linkedList.popNode();

      expect(end).to.deep.equal(popped);
    });

    it('should remove the final element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1]);
      const removed = linkedList.popNode();
      expect(removed.data).to.equal(1);
      expect(linkedList.length).equals(0);
      expect(linkedList.start).to.be.null;
      expect(linkedList.end).to.be.null;
    });
  });

  describe('pop', () => {
    it('should throw error if attempting to remove from an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);

      assert.throws(() => {
        linkedList.pop();
      }, `Cannot remove from an empty LinkedList`);
    });

    it('should remove the first element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      const popped = linkedList.pop();

      expect(popped).to.equal(5);
    });
  });

  describe('removeNode', () => {
    it('should throw error if attempting to remove from an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);

      assert.throws(() => {
        linkedList.removeNode(0);
      }, `Cannot remove from an empty LinkedList`);
    });

    it('should remove the final element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1]);
      const removed = linkedList.removeNode(0);
      expect(removed.data).to.equal(1);
      expect(linkedList.length).equals(0);
      expect(linkedList.start).to.be.null;
      expect(linkedList.end).to.be.null;
    });

    it('should remove the first element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.removeNode(0);
      expect(removed.data).to.equal(1);
    });

    it('should remove the element at the specified positive index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.removeNode(1);
      expect(removed.data).to.equal(2);
    });

    it('should remove the last element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.removeNode(4);
      expect(removed.data).to.equal(5);
    });

    it('should remove the element at the specified negative index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.removeNode(-2);
      expect(removed.data).to.equal(4);
    });
  });

  describe('remove', () => {
    it('should throw error if attempting to remove from an empty list', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);

      assert.throws(() => {
        linkedList.remove(0);
      }, `Cannot remove from an empty LinkedList`);
    });

    it('should remove the final element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1]);
      const removed = linkedList.remove(0);
      expect(removed).to.equal(1);
      expect(linkedList.length).equals(0);
      expect(linkedList.start).to.be.null;
      expect(linkedList.end).to.be.null;
    });

    it('should remove the first element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.remove(0);
      expect(removed).to.equal(1);
    });

    it('should remove the element at the specified positive index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.remove(1);
      expect(removed).to.equal(2);
    });

    it('should remove the last element', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.remove(4);
      expect(removed).to.equal(5);
    });

    it('should remove the element at the specified negative index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const removed = linkedList.remove(-2);
      expect(removed).to.equal(4);
    });
  });

  describe('reverse', () => {
    it('should reverse the order of the elements', () => {
      const numbers: number[] = [1, 2, 3, 4, 5];
      const linkedList: LinkedList<number> = new LinkedList(numbers).reverse();
      const expectedNumbers: number[] = [5, 4, 3, 2, 1];
      let index = 0;
      for (const number of linkedList) {
        expect(number).to.equal(expectedNumbers[index++]);
      }
      expect(index).to.equal(5);
    });
  });

  describe('getNode', () => {
    it('should throw error if list is empty', () => {
      const linkedList: LinkedList<number> = new LinkedList([]);

      assert.throws(() => {
        linkedList.getNode(0);
      }, `Cannot get from an empty LinkedList`);
    });

    it('should throw error if index is out of range positive', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      assert.throws(() => {
        linkedList.getNode(5);
      }, `5 is an invalid index for range [0 to 4]`);
    });

    it('should throw error if index is out of range negative', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      assert.throws(() => {
        linkedList.getNode(-6);
      }, `-6 is an invalid negative index for range [-5 to -1]`);
    });

    it('should get the element at the specified positive index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const first = linkedList.getNode(0);
      expect(first.previous).to.be.null;
      expect(first.data).to.equal(1);
      expect(first.next!.data).to.equal(2);

      const middle = linkedList.getNode(2);
      expect(middle.previous!.data).to.equal(2);
      expect(middle.data).to.equal(3);
      expect(middle.next!.data).to.equal(4);

      const last = linkedList.getNode(4);
      expect(last.previous!.data).to.equal(4);
      expect(last.data).to.equal(5);
      expect(last.next).to.be.null;
    });

    it('should get the element at the specified negative index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const first = linkedList.getNode(-5);
      expect(first.previous).to.be.null;
      expect(first.data).to.equal(1);
      expect(first.next!.data).to.equal(2);

      const middle = linkedList.getNode(-3);
      expect(middle.previous!.data).to.equal(2);
      expect(middle.data).to.equal(3);
      expect(middle.next!.data).to.equal(4);

      const last = linkedList.getNode(-1);
      expect(last.previous!.data).to.equal(4);
      expect(last.data).to.equal(5);
      expect(last.next).to.be.null;
    });
  });

  describe('get', () => {
    it('should throw error if index is out of range positive', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      assert.throws(() => {
        linkedList.get(5);
      }, `5 is an invalid index for range [0 to 4]`);
    });

    it('should throw error if index is out of range negative', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);

      assert.throws(() => {
        linkedList.get(-6);
      }, `-6 is an invalid negative index for range [-5 to -1]`);
    });

    it('should get the element at the specified positive index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const first = linkedList.get(0);
      expect(first).to.equal(1);

      const middle = linkedList.get(2);
      expect(middle).to.equal(3);

      const last = linkedList.get(4);
      expect(last).to.equal(5);
    });

    it('should get the element at the specified negative index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const first = linkedList.get(-5);
      expect(first).to.equal(1);

      const middle = linkedList.get(-3);
      expect(middle).to.equal(3);

      const last = linkedList.get(-1);
      expect(last).to.equal(5);
    });
  });

  describe('insertAfter', () => {
    it('should throw error if index is out of range', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 4, 5]);

      assert.throws(() => {
        linkedList.insertAfter(4, 3);
      }, `4 is an invalid index for range [0 to 3]`);
    });

    it('should throw error if index is out of range negative', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 4, 5]);

      assert.throws(() => {
        linkedList.insertAfter(-5, 3);
      }, `-5 is an invalid negative index for range [-4 to -1]`);
    });

    it('should insert the element after the specified positive index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 3, 4, 5]);
      linkedList.insertAfter(0, 2);
      const expectedNumbers: number[] = [1, 2, 3, 4, 5];
      let index = 0;
      for (const number of linkedList) {
        expect(number).to.equal(expectedNumbers[index++]);
      }
    });

    it('should insert the element at the end', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4]);
      linkedList.insertAfter(3, 5);
      const expectedNumbers: number[] = [1, 2, 3, 4, 5];
      let index = 0;
      for (const number of linkedList) {
        expect(number).to.equal(expectedNumbers[index++]);
      }
      expect(linkedList.end!.data).to.equal(5);
    });

    it('should insert the element after the specified negative index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 5]);
      linkedList.insertAfter(-2, 4);
      const expectedNumbers: number[] = [1, 2, 3, 4, 5];
      let index = 0;
      for (const number of linkedList) {
        expect(number).to.equal(expectedNumbers[index++]);
      }
    });
  });

  describe('insertBefore', () => {
    it('should throw error if index is out of range', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 4, 5]);

      assert.throws(() => {
        linkedList.insertBefore(4, 3);
      }, `4 is an invalid index for range [0 to 3]`);
    });

    it('should throw error if index is out of range negative', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 4, 5]);

      assert.throws(() => {
        linkedList.insertBefore(-5, 3);
      }, `-5 is an invalid negative index for range [-4 to -1]`);
    });

    it('should insert the element before the specified positive index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 3, 4, 5]);
      linkedList.insertBefore(1, 2);
      const expectedNumbers: number[] = [1, 2, 3, 4, 5];
      let index = 0;
      for (const number of linkedList) {
        expect(number).to.equal(expectedNumbers[index++]);
      }
    });

    it('should insert the element at the start', () => {
      const linkedList: LinkedList<number> = new LinkedList([2, 3, 4, 5]);
      linkedList.insertBefore(0, 1);
      const expectedNumbers: number[] = [1, 2, 3, 4, 5];
      let index = 0;
      for (const number of linkedList) {
        expect(number).to.equal(expectedNumbers[index++]);
      }
      expect(linkedList.start!.data).to.equal(1);
    });

    it('should insert the element after the specified negative index', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 5]);
      linkedList.insertBefore(-1, 4);
      const expectedNumbers: number[] = [1, 2, 3, 4, 5];
      let index = 0;
      for (const number of linkedList) {
        expect(number).to.equal(expectedNumbers[index++]);
      }
    });
  });

  describe('find', () => {
    it('should return null if element is not found', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 4, 5]);
      const searchResult = linkedList.find((v: number) => v == 3);
      expect(searchResult).to.be.null;
    });

    it('should return object if object is found', () => {
      interface Person {
        name: string;
        age: number;
      }
      const people = [
        { name: 'Person 1', age: 1 },
        { name: 'Person 2', age: 2 },
        { name: 'Person 3', age: 3 },
        { name: 'Person 4', age: 4 },
      ];
      const linkedList: LinkedList<Person> = new LinkedList(people);

      const searchResult = linkedList.find((person: Person) => person.age == 3);
      expect(searchResult).to.deep.equal(people[2]);
    });
  });

  describe('toArray', () => {
    it('should return array of numbers', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const array = linkedList.toArray();
      expect(array).to.deep.equal([1, 2, 3, 4, 5]);
    });
    it('should return array of objects', () => {
      interface Person {
        name: string;
        age: number;
      }
      const people = [
        { name: 'Person 1', age: 1 },
        { name: 'Person 2', age: 2 },
        { name: 'Person 3', age: 3 },
        { name: 'Person 4', age: 4 },
      ];
      const linkedList: LinkedList<Person> = new LinkedList(people);

      const array = linkedList.toArray();
      expect(array).to.deep.equal(people);
    });
  });

  describe('reduce', () => {
    it('should reduce numbers', () => {
      const linkedList: LinkedList<number> = new LinkedList([1, 2, 3, 4, 5]);
      const sum = linkedList.reduce((a, b) => a + b, 0);
      expect(sum).to.equal(15);
    });

    it('should reduce a list of objects', () => {
      interface Person {
        name: string;
        age: number;
      }
      const people = [
        { name: 'Person 1', age: 1 },
        { name: 'Person 2', age: 2 },
        { name: 'Person 3', age: 3 },
        { name: 'Person 4', age: 4 },
      ];
      const linkedList: LinkedList<Person> = new LinkedList(people);

      const reducedPerson = linkedList.reduce(
        (a, b) => {
          a.name += b.name;
          a.age += b.age;
          return a;
        },
        { name: '', age: 0 }
      );
      expect(reducedPerson).to.deep.equal({
        name: 'Person 1Person 2Person 3Person 4',
        age: 10,
      });
    });
  });
});
