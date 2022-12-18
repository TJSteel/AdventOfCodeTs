import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface File {
  name: string;
  size: number;
}

class Dir {
  name: string;
  files: File[];
  dirs: Map<string, Dir>;
  parent: Dir | null;
  size: number;

  constructor(name: string, parent: Dir | null) {
    this.name = name;
    this.files = [];
    this.dirs = new Map();
    this.parent = parent;
    this.size = 0;
  }

  addFile(name: string, size: number): void {
    this.size += size;
    this.files.push({ name, size });
    let current: Dir = this;
    while (current.parent) {
      current = current.parent;
      current.size += size;
    }
  }
}

class Puzzle extends AbstractPuzzle {
  root!: Dir;
  currentDir!: Dir;
  dirs: Dir[] = [];

  parseInput(): void {
    this.input = this.input.filter((v) => v != '$ ls');
    this.root = new Dir('/', null);
    this.currentDir = this.root;
    this.dirs = [this.root];
    for (const line of this.input) {
      const parts = line.split(' ');
      if (parts[0] == 'dir') {
        const name = parts[1];
        const dir = new Dir(name, this.currentDir);
        this.currentDir.dirs.set(name, dir);
        this.dirs.push(dir);
      } else if (line == '$ cd ..') {
        const parent = this.currentDir.parent;
        if (!parent) {
          throw new Error(`Dir '${this.currentDir.name}' has no parent`);
        } else {
          this.currentDir = parent;
        }
      } else if (line == '$ cd /') {
        this.currentDir = this.root;
      } else if (parts[1] == 'cd') {
        const name = parts[2];
        const dir = this.currentDir.dirs.get(name);
        if (!dir) {
          throw new Error(`Dir '${name}' not found`);
        } else {
          this.currentDir = dir;
        }
      } else {
        const size = parseInt(parts[0]);
        const name = parts[1];
        this.currentDir.addFile(name, size);
      }
    }
  }

  setAnswers(): void {
    super.setAnswers(95437, 1307902, 24933642, 7068748);
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const dir of this.dirs.filter((v) => v.size <= 100000)) {
      answer += dir.size;
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    const diskSpace = 70000000;
    const requiredSpace = 30000000;
    const currentFreeSpace = diskSpace - this.root.size;
    const additionalSpaceNeeded = requiredSpace - currentFreeSpace;
    const dirsForDelete = this.dirs.filter((v) => v.size >= additionalSpaceNeeded).sort((a, b) => a.size - b.size);
    return dirsForDelete[0].size;
  };
}

export const puzzle = new Puzzle('2022', '07', PuzzleStatus.COMPLETE);
