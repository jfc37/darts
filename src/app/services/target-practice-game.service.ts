import { Injectable } from '@angular/core';
import { DartCell, Hit } from '../components/board/board.component';

@Injectable({
  providedIn: 'root'
})
export class TargetPracticeGameService {

  constructor() { }

  public createGame(): TargetPracticeGame {
    return TargetPracticeGame.InitialseNewGame();
  }
}

export class TargetPracticeGame {
  public phase: TargetPracticeGamePhase = TargetPracticeGamePhase.SelectPlayers;
  public players!: Player[];
  public round: number = 1;

  public get activePlayer() {
    return this.players.find(x => x.isActive)!;
  }

  private constructor() {

  }

  public static InitialseNewGame(): TargetPracticeGame {
    return new TargetPracticeGame();
  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => Player.NewPlayer(player));
    this.players[0].isActive = true;
    this.phase = TargetPracticeGamePhase.Play;
  }

  public recordRound(hits: Hit[]) {
    this.activePlayer.recordRound(hits);
    this.changeToNextPlayer();
  }


  private changeToNextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.activePlayer);
    const isLastPlayer = currentPlayerIndex == this.players.length - 1;

    if (isLastPlayer) {
      if (this.round == TOTAL_ROUNDS) {
        this.phase = TargetPracticeGamePhase.GameOver;
        return;
      } else {
        this.round++;
        this.activePlayer.isActive = false;
        this.players[0].isActive = true;
        return;
      }
    } else {
      this.activePlayer.isActive = false;
      this.players[currentPlayerIndex + 1].isActive = true;
    }
  }
}

export class Player {
  public name: string;
  public isActive: boolean = false;
  public rounds: Round[] = [];

  private constructor(name: string) {
    this.name = name;
  }

  public recordRound(hits: Hit[]) {
    this.rounds.push(new Round(this.rounds.length + 1, hits));
  }

  public get score(): string {
    const totalThrows = this.rounds.length * 3;
    const totalMakes = this.rounds.reduce((acc, round) => acc + round.makes, 0);

    return `${totalMakes} / ${totalThrows}`;
  }

  public get totalMakes(): number {
    return this.rounds.reduce((acc, round) => acc + round.makes, 0);
  }

  public scoreForRound(round: number): string {
    const roundHits = this.rounds[round - 1];
    return `${roundHits.makes} / 3`;

  }

  static NewPlayer(name: string): Player {
    return new Player(name);
  }
}

export class Round {
  public hole: number;
  private _hits: Hit[];

  constructor(hole: number, hits: Hit[]) {
    this.hole = hole;
    this._hits = hits;
  }

  public get misses(): number {
    return this._hits.filter(x => x.number != this.hole).length;
  }

  public get makes(): number {
    return this._hits.filter(x => x.number == this.hole).length;
  }
}

/**
 * Represents the current phase of the game
 */
export enum TargetPracticeGamePhase {
  SelectPlayers = 'select-players',

  /**
   * Playing the game
   */
  Play = 'play',

  /**
   * The game has ended
   */
  GameOver = 'game-over'
}


const TOTAL_ROUNDS = 20;