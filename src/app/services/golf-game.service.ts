import { Injectable } from '@angular/core';
import { Hit } from '../domain-objects/hit';
import { DartCell } from '../domain-objects/dart-cell';

@Injectable({
  providedIn: 'root'
})
export class GolfGameService {

  constructor() { }

  public createGame(): GolfGame {
    return GolfGame.InitialseNewGame();
  }
}

export class GolfGame {
  public phase: GolfGamePhase = GolfGamePhase.SelectPlayers;
  public players!: GolfPlayer[];
  public round: number = 1;

  public get activePlayer() {
    return this.players.find(x => x.isActive)!;
  }

  private constructor() {

  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => GolfPlayer.NewPlayer(player));
    this.players[0].isActive = true;
    this.phase = GolfGamePhase.Play;
  }

  public recordRound(hits: Hit[]) {
    this.activePlayer.recordRound(hits);
    this.changeToNextPlayer();
  }

  public static InitialseNewGame(): GolfGame {
    return new GolfGame();
  }

  private changeToNextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.activePlayer);
    const isLastPlayer = currentPlayerIndex == this.players.length - 1;

    if (isLastPlayer) {
      if (this.round == TOTAL_ROUNDS) {
        this.phase = GolfGamePhase.GameOver;
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

export class GolfPlayer {
  public name: string;
  public isActive: boolean = false;
  public rounds: GolfRound[] = [];

  public get score(): number {
    return this.rounds.reduce((totalScore, round) => round.score + totalScore, 0);
  }

  public get totalEagleHoles(): number {
    return this.rounds.filter(x => x.score == -2).length;
  }

  public get totalBirdieHoles(): number {
    return this.rounds.filter(x => x.score == -1).length;
  }

  public get totalParHoles(): number {
    return this.rounds.filter(x => x.score == 0).length;
  }

  public get totalBoogieHoles(): number {
    return this.rounds.filter(x => x.score == 1).length;
  }

  private constructor(name: string) {
    this.name = name;
  }

  public recordRound(hits: Hit[]) {
    this.rounds.push(new GolfRound(this.rounds.length + 1, hits));
  }

  public scoreAtHole(hole: number): number {
    return this.rounds.slice(0, hole).reduce((totalScore, round) => round.score + totalScore, 0);
  }

  static NewPlayer(name: string): GolfPlayer {
    return new GolfPlayer(name);
  }
}

export class GolfRound {
  public hole: number;
  private _hits: Hit[];

  constructor(hole: number, hits: Hit[]) {
    this.hole = hole;
    this._hits = hits;
  }

  public get score(): number {
    const hitsOnRound = this._hits.filter(x => x.number == this.hole);

    const hasAnEagle = hitsOnRound.some(x => [DartCell.Double, DartCell.Triple].includes(x.multiplier));
    if (hasAnEagle) {
      return -2;
    }

    const hasABirdie = hitsOnRound.some(x => x.multiplier == DartCell.SingleInner);
    if (hasABirdie) {
      return -1;
    }

    const hasPar = hitsOnRound.some(x => x.multiplier == DartCell.SingleOuter);
    if (hasPar) {
      return 0;
    }

    return 1;
  }
}

/**
 * Represents the current phase of the game
 */
export enum GolfGamePhase {
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


const TOTAL_ROUNDS = 18;