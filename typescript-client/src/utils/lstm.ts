import * as brain from "brain.js";
export type GameMove = 0 | 1 | 2;
type gameResult = -1 | 0 | 1;

interface playResponse {
  result: gameResult;
}

interface statResponse {
  nOfWins: number;
  nOfTies: number;
  nOfLoses: number;
  nOfRounds: number;
  playerWinRate: number;
  iaWinRate: number;
  tieRate: number;
}

export default class LstmAI {
  prevResult: gameResult = 0;

  nOfWins: number = 0;
  nOfLoses: number = 0;
  nOfTies: number = 0;
  nOfRounds: number = 0;
  playerMoves: GameMove[] = [];
  memorySize: number = 5;

  constructor(memorySize: number) {
    this.memorySize = memorySize;
  }

  public play(playerMove: GameMove): playResponse {
    this.prepareData();
    let iaMove = this.calcIAMove();
    this.updatePattern(playerMove);
    let result = this.checkResult(playerMove, iaMove);
    this.prevResult = result;
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

  private updatePattern(playerMove: GameMove) {
    if (this.nOfRounds !== 0) {
      this.playerMoves.shift();
      this.playerMoves.push(playerMove);
    }
  }

  private prepareData() {
    if (this.playerMoves.length < 1) {
      for (let index = 1; index <= this.memorySize; index++) {
        this.playerMoves.push(Math.floor(Math.random() * 3) as GameMove);
      }
    }
  }
  private calcIAMove(): GameMove {
    if (this.playerMoves.length < this.memorySize) {
      return (Math.floor(Math.random() * 3) + 1) as GameMove;
    }

    let trainData: number[] = this.playerMoves.map((playerMove) => {
      return Number(playerMove + 1);
    });
    if (trainData.length > this.memorySize)
      trainData = trainData.slice(trainData.length - this.memorySize);
    console.log(trainData);
    const net = new brain.recurrent.LSTMTimeStep();
    net.train([trainData], {
      iterations: 100,
    });
    const predictedPlayerMove = net.run(trainData);
    console.log(predictedPlayerMove);

    const roundedPlayerMove = Math.round(predictedPlayerMove - 1);

    //  pedra - 0 - 1
    //  papel - 1 - 2
    //  tesoura - 2 - 0

    let test: GameMove = ((roundedPlayerMove + 1) % 3) as GameMove;
    return test;

    if (roundedPlayerMove == 0) {
      return 1;
    } else if (roundedPlayerMove == 1) {
      return 2;
    } else {
      return 0;
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
