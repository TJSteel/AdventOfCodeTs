import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

interface Node {
  depth: number;
  index?: number;
  parent: Boolean;
  value?: number;
  children?: Array<Node>;
}
class Puzzle extends AbstractPuzzle {
  index: number = 0;
  rootNode: Node = { depth: 0, parent: false };
  str: string = '';

  setAnswers(): void {
    super.setAnswers(4140, 3675, 3993, 4650);
  }

  printTree(node: Node): void {
    if (!node.parent) {
      this.str = '';
    }
    if (node.value !== undefined) {
      if (this.str[this.str.length - 1] !== '[') {
        this.str += ',';
      }
      this.str += node.value;
    }
    if (node.children) {
      this.str += this.str[this.str.length - 1] === ']' ? ',[' : '[';
      for (let child of node.children) {
        this.printTree(child);
      }
      this.str += ']';
    }
    if (!node.parent) {
      console.log(this.str);
    }
  }

  buildTree(depth: number, value: Array<any> | number, parent: Boolean): Node {
    let node: Node = {
      depth,
      parent: false,
    };
    node.parent = parent;
    if (Array.isArray(value)) {
      node.children = [];
      for (let v of value) {
        node.children.push(this.buildTree(depth + 1, v, true));
      }
    } else {
      node.value = value;
      node.index = this.index++;
    }
    return node;
  }

  parseInput(): void {
    this.input = this.input.map((v) => {
      this.index = 0;
      return this.buildTree(0, JSON.parse(v), false);
    });
  }

  increaseNodeDepth(node: Node): void {
    node.depth++;
    if (node.children) {
      for (let child of node.children) {
        this.increaseNodeDepth(child);
      }
    }
  }

  setIndexes(node: Node): void {
    if (!node.parent) {
      this.index = 0;
    }
    if (node.value !== undefined) {
      node.index = this.index++;
    } else if (node.children) {
      for (let child of node.children) {
        this.setIndexes(child);
      }
    }
  }

  addNode(current: Node, next: Node): Node {
    this.increaseNodeDepth(current);
    this.increaseNodeDepth(next);
    let node = {
      depth: 0,
      parent: false,
      children: [current, next],
    };
    current.parent = true;
    next.parent = true;
    this.setIndexes(node);
    return node;
  }

  getLeft(node: Node, i: number, lastNode: Node | null): Node | null {
    if (node.index && node.index >= i) {
      return lastNode;
    }
    if (node.value !== undefined) {
      lastNode = node;
    }
    if (node.children) {
      for (let child of node.children) {
        lastNode = this.getLeft(child, i, lastNode);
      }
    }
    return lastNode;
  }

  getRight(node: Node, i: number, lastNode: Node | null): Node | null {
    if (node.index && node.index > i && node.value !== undefined) {
      return node;
    }
    if (node.children) {
      for (let child of node.children) {
        lastNode = this.getRight(child, i, lastNode);
        if (lastNode) {
          return lastNode;
        }
      }
    }
    return null;
  }

  getExplodes(node: Node, arr: Node[]): Node[] {
    if (node.depth >= 4 && node.children) {
      arr.push(node);
    }
    if (node.children) {
      for (let child of node.children) {
        this.getExplodes(child, arr);
      }
    }
    return arr;
  }

  explode(node: Node): void {
    if (!node.children) {
      return;
    }
    if (node.children![0].index === undefined || node.children[1].index === undefined) {
      return;
    }
    let left = this.getLeft(this.rootNode, node.children[0].index, null);
    let right = this.getRight(this.rootNode, node.children[1].index, null);
    if (left) {
      left.value! += node.children[0].value!;
    }
    if (right) {
      right.value! += node.children[1].value!;
    }
    node.index = node.children[0].index;
    delete node.children;
    node.value = 0;
  }

  getSplits(node: Node, arr: Node[]): Node[] {
    if (node.value !== undefined && node.value >= 10) {
      arr.push(node);
    }
    if (node.children) {
      for (let child of node.children) {
        this.getSplits(child, arr);
      }
    }
    return arr;
  }

  split(node: Node) {
    node.children = [
      { depth: node.depth + 1, parent: true, value: Math.floor(node.value! / 2) },
      { depth: node.depth + 1, parent: true, value: Math.ceil(node.value! / 2) },
    ];
    delete node.value;
    delete node.index;
  }

  reduce() {
    let explodes: Node[] = this.getExplodes(this.rootNode, []);
    if (explodes.length > 0) {
      this.explode(explodes[0]);
      return true;
    }

    let splits = this.getSplits(this.rootNode, []);
    if (splits.length > 0) {
      this.split(splits[0]);
      this.setIndexes(this.rootNode);
      return true;
    }
    return false;
  }

  magnitude(node: Node): number {
    if (node.value !== undefined) {
      return node.value;
    }
    if (node.children) {
      return 3 * this.magnitude(node.children[0]) + 2 * this.magnitude(node.children[1]);
    }
    return 0;
  }

  calculateAnswer1 = (): number => {
    this.rootNode = this.input[0];
    for (let i = 1, len = this.input.length; i < len; i++) {
      let next = this.input[i];
      this.rootNode = this.addNode(this.rootNode, next);
      while (this.reduce()) {}
    }
    return this.magnitude(this.rootNode);
  };

  calculateAnswer2 = (): number => {
    let largest = 0;
    for (let i = 0, len = this.input.length; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (i != j) {
          this.rootNode = this.addNode(
            JSON.parse(JSON.stringify(this.input[i])),
            JSON.parse(JSON.stringify(this.input[j]))
          );
          while (this.reduce()) {}

          let size = this.magnitude(this.rootNode);
          if (size > largest) {
            largest = size;
          }
        }
      }
    }
    return largest;
  };
}

export const puzzle = new Puzzle('2021', '18', PuzzleStatus.COMPLETE);
