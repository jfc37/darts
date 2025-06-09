import { Injectable } from '@angular/core';
import { Player } from '../../domain-objects/player';
import { Hit } from '../../domain-objects/hit';
import { updateGameStats } from '../../domain-objects/game-stat';
import { getRandomRounds, TOTAL_ROUNDS } from '../../domain-objects/round';

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
  public roundIndex: number = 0;
  public roundOrder: number[] = getRandomRounds();

  public get activePlayer() {
    return this.players.find(x => x.isActive)!;
  }

  public get round() {
    return this.roundOrder[this.roundIndex];
  }

  private constructor() {

  }

  public static InitialseNewGame(): TargetPracticeGame {
    return new TargetPracticeGame();
  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => Player.NewPlayer(player, targetPracticeHit));
    this.players[0].isActive = true;
    this.phase = TargetPracticeGamePhase.Play;
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
        this.phase = TargetPracticeGamePhase.GameOver;
        updateGameStats('game', this.players);
        return;
      } else {
        this.roundIndex++;
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

export function targetPracticeHit(hit: Hit, hole: number): boolean {
  return hit.number === hole;
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
