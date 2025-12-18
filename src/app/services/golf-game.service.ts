import { Injectable } from '@angular/core';
import { Hit } from '../domain-objects/hit';
import { GolfGamePhase } from '../domain-objects/golf/golf-game-phase';
import { GolfSettings } from '../domain-objects/golf/golf-settings';
import { GolfPlayer } from '../domain-objects/golf/golf-player';
import { GolfRound } from '../domain-objects/golf/golf-round';

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
  private history: GolfSnapshot[] = [];

  public get activePlayer() {
    return this.players.find(x => x.isActive)!;
  }

  private _settings: GolfSettings = GolfSettings.getSettings();

  private constructor() {

  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => GolfPlayer.NewPlayer(player));
    this.players[0].isActive = true;
    this.phase = GolfGamePhase.SelectSettings;
  }

  public setSettings(settings: GolfSettings) {
    GolfSettings.setSettings(settings);
    this._settings = GolfSettings.getSettings();

    this.phase = GolfGamePhase.Play;
  }

  public recordRound(hits: Hit[]) {
    this.saveSnapshot();
    this.activePlayer.recordRound(this.round, hits);
    this.changeToNextPlayer();
  }

  public undoLastTurn() {
    const previous = this.history.pop();
    if (!previous) {
      return;
    }

    this.phase = previous.phase;
    this.round = previous.round;
    this.players = previous.players.map(player => {
      const clone = GolfPlayer.NewPlayer(player.name);
      clone.isActive = player.isActive;
      clone.rounds = player.rounds.map(round => new GolfRound(round.hole, round.hits.map(h => new Hit(h.number, h.multiplier, h.point))));
      return clone;
    });
  }

  public get canUndo() {
    return this.history.length > 0;
  }

  public static InitialseNewGame(): GolfGame {
    return new GolfGame();
  }

  private changeToNextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.activePlayer);
    const isLastPlayer = currentPlayerIndex == this.players.length - 1;

    if (isLastPlayer) {
      if (this.round == GolfSettings.getSettings().numberOfHoles) {
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

  private saveSnapshot() {
    this.history.push({
      phase: this.phase,
      round: this.round,
      players: this.players.map(player => ({
        name: player.name,
        isActive: player.isActive,
        rounds: player.rounds.map(round => ({
          hole: round.hole,
          hits: (round as any)._hits ?? []
        }))
      }))
    });
  }
}

interface GolfSnapshot {
  phase: GolfGamePhase;
  round: number;
  players: {
    name: string;
    isActive: boolean;
    rounds: { hole: number; hits: Hit[] }[];
  }[];
}




