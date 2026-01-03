import { Injectable } from '@angular/core';
import { Player } from '../../domain-objects/player';
import { Hit } from '../../domain-objects/hit';
import { updateGameStats } from '../../domain-objects/game-stat';
import { DartCell } from '../../domain-objects/dart-cell';
import { TOTAL_ROUNDS } from '../../domain-objects/round';

@Injectable({
  providedIn: 'root'
})
export class KillerPracticeGameService {

  constructor() { }

  public createGame(): KillerPracticeGame {
    return KillerPracticeGame.InitialseNewGame();
  }
}

export class KillerPracticeGame {
  public phase: KillerPracticeGamePhase = KillerPracticeGamePhase.SelectPlayers;
  public players!: Player[];
  public roundIndex: number = 0;
  public roundOrder: number[] = getRandomKillerRounds();

  public get activePlayer() {
    return this.players.find(x => x.isActive)!;
  }

  public get round() {
    return this.roundOrder[this.roundIndex];
  }

  private constructor() {

  }

  public static InitialseNewGame(): KillerPracticeGame {
    return new KillerPracticeGame();
  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => Player.NewPlayer(player, killerPracticeScore, 3));
    this.players[0].isActive = true;
    this.phase = KillerPracticeGamePhase.Play;
  }

  public recordRound(hits: Hit[]) {
    this.activePlayer.recordRound(hits, this.roundOrder[this.roundIndex]);
    this.changeToNextPlayer();
  }


  private changeToNextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.activePlayer);
    const isLastPlayer = currentPlayerIndex == this.players.length - 1;

    if (isLastPlayer) {
      if (this.roundIndex == TOTAL_ROUNDS - 1) {
        this.phase = KillerPracticeGamePhase.GameOver;
        updateGameStats('killerPracticeGame', this.players);
        return;
      } else {
        this.roundIndex++;
        this.activePlayer.isActive = false;
        this.roundOrder[this.roundIndex] = getRandomKillerTarget();
        this.players[0].isActive = true;
        return;
      }
    } else {
      this.activePlayer.isActive = false;
      this.players[currentPlayerIndex + 1].isActive = true;
    }
  }
}

export function killerPracticeScore(hit: Hit, target: number): number {
  if (hit.number !== target || hit.missed) {
    return 0;
  }

  if (hit.multiplier === DartCell.Triple) {
    return 3;
  }

  if (hit.multiplier === DartCell.Double) {
    return 2;
  }

  if ([DartCell.SingleInner, DartCell.SingleOuter].includes(hit.multiplier)) {
    return 1;
  }

  return 0;
}

export function getRandomKillerRounds(): number[] {
  return Array.from({ length: TOTAL_ROUNDS }, () => getRandomKillerTarget());
}

export function getRandomKillerTarget(): number {
  return Math.floor(Math.random() * 20) + 1;
}

/**
 * Represents the current phase of the game
 */
export enum KillerPracticeGamePhase {
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
