import { LinkedList } from '../../core/dataStructures/linkedList';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface PulseModule {
  type: '%' | '&' | '';
  key: string;
  destinations: string[];
  pulseType: 'high' | 'low';
}

interface FlipFlopModule extends PulseModule {
  type: '%';
  state: boolean;
}

interface ConjunctionModule extends PulseModule {
  type: '&';
  connectedModules: Map<string, boolean>;
}

interface PulseCount {
  low: number;
  high: number;
}

interface Pulse {
  from: string;
  to: string;
  type: 'high' | 'low';
}

class Puzzle extends AbstractPuzzle {
  pulseModules: Map<string, PulseModule> = new Map();
  setAnswers(): void {
    super.setAnswers(11687500, 836127690, 0, 0);
  }

  parseInput(): void {
    this.pulseModules = new Map();
    for (const input of this.input) {
      // regex group optional
      const [match, type, key, destinations] = input.match(/^([\%\&]?)(.*) \-\> (.*)/);
      if (!match) {
        throw new Error(`eval regex failed for: ${input}`);
      }
      switch (type) {
        case '':
          this.pulseModules.set(key, { type, key, destinations: destinations.split(', '), pulseType: 'low' });
          break;
        case '%':
          const flipFlop: FlipFlopModule = {
            type,
            key,
            destinations: destinations.split(', '),
            pulseType: 'low',
            state: false,
          };
          this.pulseModules.set(key, flipFlop);
          break;
        case '&':
          const conjunction: ConjunctionModule = {
            type,
            key,
            destinations: destinations.split(', '),
            pulseType: 'low',
            connectedModules: new Map(),
          };
          this.pulseModules.set(key, conjunction);
          break;
      }
    }

    // add watchers to all conjunction modules
    const conjunctionModules: Map<string, ConjunctionModule> = new Map();
    for (const pulseModule of this.pulseModules.values()) {
      if (pulseModule.type === '&') {
        conjunctionModules.set(pulseModule.key, pulseModule as ConjunctionModule);
      }
    }
    for (const pulseModule of this.pulseModules.values()) {
      for (const destination of pulseModule.destinations) {
        if (conjunctionModules.has(destination)) {
          conjunctionModules.get(destination)!.connectedModules.set(pulseModule.key, false);
        }
      }
    }
  }

  pushButton(): PulseCount {
    let pulseCount: PulseCount = {
      low: 1,
      high: 0,
    };

    const queue: LinkedList<Pulse> = new LinkedList([{ from: 'button', to: 'broadcaster', type: 'low' }]);
    while (queue.length > 0) {
      const currentPulse = queue.shift();
      const fromModule = this.pulseModules.get(currentPulse.from);
      const toModule = this.pulseModules.get(currentPulse.to);

      if (!toModule) {
        continue;
      }

      switch (toModule.type) {
        case '':
          for (const destination of toModule.destinations) {
            queue.insertAtEnd({ from: toModule.key, to: destination, type: 'low' });
            pulseCount.low++;
          }
          break;
        case '%':
          if (currentPulse.type === 'low') {
            const flipFlop = toModule as FlipFlopModule;
            flipFlop.state = !flipFlop.state;
            for (const destination of flipFlop.destinations) {
              if (flipFlop.state) {
                queue.insertAtEnd({ from: toModule.key, to: destination, type: 'high' });
                pulseCount.high++;
              } else {
                queue.insertAtEnd({ from: toModule.key, to: destination, type: 'low' });
                pulseCount.low++;
              }
            }
          }
          break;
        case '&':
          const conjunctionModule = toModule as ConjunctionModule;
          conjunctionModule.connectedModules.set(fromModule!.key, currentPulse.type === 'high');
          const values = [...conjunctionModule.connectedModules.values()];
          const type = values.length === values.filter((v: boolean) => v).length ? 'low' : 'high';
          for (const destination of conjunctionModule.destinations) {
            queue.insertAtEnd({ from: toModule.key, to: destination, type });
            if (type === 'high') {
              pulseCount.high++;
            } else {
              pulseCount.low++;
            }
          }
          break;
      }
    }

    return pulseCount;
  }

  calculateAnswer1 = (): number => {
    let lowPulses = 0;
    let highPulses = 0;

    for (let i = 0; i < 1000; i++) {
      // push the button
      const counts = this.pushButton();
      lowPulses += counts.low;
      highPulses += counts.high;
    }

    return lowPulses * highPulses;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '20', PuzzleStatus.NOT_SOLVED);
