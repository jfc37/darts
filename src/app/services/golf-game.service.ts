import { Injectable } from '@angular/core';
import { Hit } from '../domain-objects/hit';
import { GolfGamePhase } from '../domain-objects/golf/golf-game-phase';
import { GolfSettings } from '../domain-objects/golf/golf-settings';
import { GolfPlayer } from '../domain-objects/golf/golf-player';

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
    this.activePlayer.recordRound(this.round, hits);
    this.changeToNextPlayer();
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
}




