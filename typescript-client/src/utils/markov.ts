interface probabilitiesRPS {
  0: number;
  1: number;
  2: number;
}

export type GameMove = 0 | 1 | 2;
export type gameResult = -1 | 0 | 1;
export type stringGameMove = "r" | "p" | "s";

type nOfMatrix = 1 | 3;
type TransitionMatrix = number[][];

export type TransitionMatrixResponse = {
  [key in "win" | "lose" | "tie"]: {
    [key in "r" | "p" | "s"]: { [key in "r" | "p" | "s"]: number };
  };
};

interface playResponse {
  result: gameResult;
}

export interface statResponse {
  nOfWins: number;
  nOfTies: number;
  nOfLoses: number;
  nOfRounds: number;
  playerWinRate: number;
  iaWinRate: number;
  tieRate: number;
}

export default class MarkovIA {
  WinTransitionMatrix: TransitionMatrix = Array.from({ length: 3 }, () =>
    Array(3).fill(1)
  );
  LoseTransitionMatrix: TransitionMatrix = Array.from({ length: 3 }, () =>
    Array(3).fill(1)
  );
  TieTransitionMatrix: TransitionMatrix = Array.from({ length: 3 }, () =>
    Array(3).fill(1)
  );
  probabilitiesRPS: probabilitiesRPS = [1 / 3, 1 / 3, 1 / 3];
  prevPlayerMove: GameMove = 0;
  prevResult: gameResult = 0;

  nOfWins: number = 0;
  nOfLoses: number = 0;
  nOfTies: number = 0;
  nOfRounds: number = 0;

  nOfMatrix: nOfMatrix = 3;

  seed = 42;

  constructor(nOfMatrix?: nOfMatrix) {
    if (nOfMatrix) {
      this.nOfMatrix = nOfMatrix;
    }
  }

  private random() {
    var x = Math.sin(this.seed) * 10000;
    this.seed = this.seed + 1;
    return x - Math.floor(x);
  }

  public play(playerMove: GameMove, gameResult?: gameResult): playResponse {
    if (this.nOfRounds > 0) {
      this.updateMatrix(playerMove);
      this.calcProbabilities();
    }

    let iaMove = this.calcIAMove();
    let result = this.checkResult(playerMove, iaMove);
    this.prevPlayerMove = playerMove;
    this.prevResult =
      this.nOfMatrix == 3 ? (gameResult ? gameResult : result) : 1;
    return { result };
  }
  public stats(): statResponse {
    return {
      nOfLoses: this.nOfLoses,
      nOfRounds: this.nOfRounds,
      nOfTies: this.nOfTies,
      nOfWins: this.nOfTies,
      playerWinRate: this.nOfWins / this.nOfRounds,
      iaWinRate: this.nOfLoses / this.nOfRounds,
      tieRate: this.nOfTies / this.nOfRounds,
    };
  }

  public getMatrix() {
    const matrixArr =
      this.nOfMatrix == 1
        ? [this.WinTransitionMatrix]
        : [
            this.WinTransitionMatrix,
            this.LoseTransitionMatrix,
            this.TieTransitionMatrix,
          ];

    const result: TransitionMatrixResponse = {
      win: {
        r: { r: 0, p: 0, s: 0 },
        p: { r: 0, p: 0, s: 0 },
        s: { r: 0, p: 0, s: 0 },
      },
      lose: {
        r: { r: 0, p: 0, s: 0 },
        p: { r: 0, p: 0, s: 0 },
        s: { r: 0, p: 0, s: 0 },
      },
      tie: {
        r: { r: 0, p: 0, s: 0 },
        p: { r: 0, p: 0, s: 0 },
        s: { r: 0, p: 0, s: 0 },
      },
    };
    matrixArr.forEach((transitionMatrix, index) => {
      let key = index == 0 ? "win" : index == 1 ? "lose" : "tie";

      transitionMatrix.forEach((transition, index) => {
        let prevMove: stringGameMove =
          index == 0 ? "r" : index == 1 ? "p" : "s";
        transition.forEach((actualMove, index) => {
          let move: stringGameMove = index == 0 ? "r" : index == 1 ? "p" : "s";
          result[key as keyof TransitionMatrixResponse][prevMove][move] =
            actualMove;
        });
      });
    });

    return result;
  }

  private calcIAMove(): GameMove {
    let randNumber = Math.floor(this.random() * 100) + 1;

    let rangeR = this.probabilitiesRPS[0] * 100;
    let RangeP = this.probabilitiesRPS[1] * 100;

    if (randNumber <= rangeR) {
      return 1;
    } else if (randNumber <= rangeR + RangeP) {
      return 2;
    } else {
      return 0;
    }
  }
  private calcProbabilities(): probabilitiesRPS {
    let probabilitiesRPS: probabilitiesRPS = [1 / 3, 1 / 3, 1 / 3];
    let TransitionMatrix: TransitionMatrix;

    if (this.prevResult === 1) {
      TransitionMatrix = this.WinTransitionMatrix;
    } else if (this.prevResult === 0) {
      TransitionMatrix = this.TieTransitionMatrix;
    } else if (this.prevResult === -1) {
      TransitionMatrix = this.LoseTransitionMatrix;
    } else {
      return probabilitiesRPS;
    }

    let sum = TransitionMatrix[this.prevPlayerMove].reduce((a, b) => a + b, 0);

    for (let i = 0; i < 3; i++) {
      probabilitiesRPS[i as keyof probabilitiesRPS] =
        TransitionMatrix[this.prevPlayerMove][i] / sum;
    }

    this.probabilitiesRPS = probabilitiesRPS;
    return probabilitiesRPS;
  }
  private updateMatrix(playerMove: GameMove) {
    let result = this.prevResult;
    if (result === 1) {
      this.WinTransitionMatrix[this.prevPlayerMove][playerMove] += 1;
    } else if (result === 0) {
      this.TieTransitionMatrix[this.prevPlayerMove][playerMove] += 1;
    } else if (result === -1) {
      this.LoseTransitionMatrix[this.prevPlayerMove][playerMove] += 1;
    }
  }
  private checkResult(playerMove: number, iaMove: number): gameResult {
    let result: gameResult;

    if (playerMove === iaMove) {
      result = 0;
    } else if (
      (playerMove === 0 && iaMove === 2) ||
      (playerMove === 1 && iaMove === 0) ||
      (playerMove === 2 && iaMove === 1)
    ) {
      result = 1;
    } else {
      result = -1;
    }

    this.addResult(result);

    return result;
  }
  private addResult(result: number) {
    if (result === 1) {
      this.nOfWins += 1;
    } else if (result === -1) {
      this.nOfLoses += 1;
    } else {
      this.nOfTies += 1;
    }
    this.nOfRounds++;
  }
}
