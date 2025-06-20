import { Injectable } from '@angular/core';
import { Player } from '../../domain-objects/player';
import { Hit } from '../../domain-objects/hit';
import { DartCell } from '../../domain-objects/dart-cell';
import { GameStat, updateGameStats } from '../../domain-objects/game-stat';
import { getRandomRounds, TOTAL_ROUNDS } from '../../domain-objects/round';

@Injectable({
  providedIn: 'root'
})
export class MultiplierPracticeGameService {

  constructor() { }

  public createGame(): MultiplierPracticeGame {
    return MultiplierPracticeGame.InitialseNewGame();
  }
}

export class MultiplierPracticeGame {
  public phase: MultiplierPracticeGamePhase = MultiplierPracticeGamePhase.SelectPlayers;
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

  public static InitialseNewGame(): MultiplierPracticeGame {
    return new MultiplierPracticeGame();
  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => Player.NewPlayer(player, multiplierPracticeHit));
    this.players[0].isActive = true;
    this.phase = MultiplierPracticeGamePhase.Play;
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
        this.phase = MultiplierPracticeGamePhase.GameOver;
        updateGameStats('multiplierGame', this.players);
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

/**
 * Represents the current phase of the game
 */
export enum MultiplierPracticeGamePhase {
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

export function multiplierPracticeHit(hit: Hit, hole: number): boolean {
  const hitRightNumber = hit.number === hole;
  const hitMultiplier = [DartCell.Double, DartCell.Triple].includes(hit.multiplier);

  return hitRightNumber && hitMultiplier;
}