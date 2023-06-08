import { GameMove, gameResult } from "./markov";

type stringGameMove = "r" | "p" | "s";

type memorySequence = { [key: string]: { [key: string]: number } };

export interface sequencesStats {
  prevSequence: string;
  sequenceLength: number;
  occurrences: {
    r: number;
    p: number;
    s: number;
  };
  probabilities: {
    r: number;
    p: number;
    s: number;
  };
  total: number;
}

export default class Jokenpo {
  prevMoves: stringGameMove[] = [];
  memorySize: number;

  memorySequences: memorySequence = {};

  constructor(memorySize: number = 3) {
    this.memorySize = memorySize;
  }

  public play(playerMove: GameMove) {
    this.updateMemory(playerMove);
  }

  public reset() {
    this.prevMoves = [];
    this.memorySequences = {};
  }

  private updateMemory(playerMove: GameMove) {
    this.prevMoves.push(Jokenpo.convertPlayerMove(playerMove));
    if (this.prevMoves.length > this.memorySize) this.prevMoves.shift();

    for (let i = 1; i < this.prevMoves.length; i++) {
      let key = "";

      for (let j = 0; j < i; j++) {
        key += this.prevMoves[j];
      }

      this.memorySequences[key] = this.memorySequences[key]
        ? this.memorySequences[key]
        : {};

      this.memorySequences[key][this.prevMoves[i]] = this.memorySequences[key][
        this.prevMoves[i]
      ]
        ? this.memorySequences[key][this.prevMoves[i]] + 1
        : 1;
    }
  }

  static convertPlayerMove(playerMove: GameMove) {
    return playerMove == 0 ? "r" : playerMove == 1 ? "p" : "s";
  }

  public stats(minOccurrences: number): sequencesStats[] {
    const sequencesArray = Object.entries(this.memorySequences);

    const sequenceStats = sequencesArray
      .map((sequence) => {
        const nR = sequence[1]["r"] | 0;
        const nP = sequence[1]["p"] | 0;
        const nS = sequence[1]["s"] | 0;
        const sum = nR + nP + nS;

        return {
          prevSequence: sequence[0],
          sequenceLength: sequence[0].length,
          occurrences: { r: nR, p: nP, s: nS },
          probabilities: { r: nR / sum, p: nP / sum, s: nS / sum },
          total: sum,
        };
      })
      .filter((sequence) => sequence.total >= minOccurrences) // filtra pela quantidade minima de ocorrencias
      .sort((sequence, prevSequence) => {
        // organiza da maior a menor probabilidade
        const actualHigherProbability = Math.max(
          ...Object.values(sequence.probabilities)
        );

        const prevHigherProbability = Math.max(
          ...Object.values(prevSequence.probabilities)
        );
        return actualHigherProbability > prevHigherProbability ? -1 : 1;
      });

    const response: sequencesStats[] = [];

    for (let i = 1; i <= this.memorySize; i++) {
      const findSequence = sequenceStats.find(
        (sequence) => sequence.sequenceLength == i
      );

      if (findSequence) response.push(findSequence);
    }

    return response;
  }
}
