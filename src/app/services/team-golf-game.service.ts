import { Injectable } from '@angular/core';
import { Hit } from '../domain-objects/hit';
import { GolfGamePhase } from '../domain-objects/golf/golf-game-phase';
import { GolfSettings } from '../domain-objects/golf/golf-settings';
import { GolfTeam } from '../domain-objects/golf/golf-team';

@Injectable({
  providedIn: 'root'
})
export class TeamGolfGameService {

  constructor() { }

  public createGame(): TeamGolfGame {
    return TeamGolfGame.InitialiseNewGame();
  }
}

export class TeamGolfGame {
  public team1: GolfTeam = GolfTeam.Create('Team 1', 1);
  public team2: GolfTeam = GolfTeam.Create('Team 2', 2);
  public teams = [this.team1, this.team2];
  public hole = 1;
  public phase: GolfGamePhase = GolfGamePhase.SelectPlayers;

  private _settings = GolfSettings.getSettings();

  public get activeTeam() {
    return this.teams.find(x => x.isActive)!;
  }

  static InitialiseNewGame(): TeamGolfGame {
    return new TeamGolfGame();
  }

  public setPlayers(players: string[]) {
    this.team1.addPlayers(players[0], players[1]);
    this.team2.addPlayers(players[2], players[3]);

    this.phase = GolfGamePhase.SelectSettings;
  }

  public setSettings(settings: GolfSettings) {
    GolfSettings.setSettings(settings);
    this._settings = GolfSettings.getSettings();

    this.phase = GolfGamePhase.Play;
  }

  public recordHole(hits: Hit[]) {
    this.activeTeam.recordHole(hits);
    this.changeToNextTeam();
  }

  private changeToNextTeam() {
    this.team1.isActive = !this.team1.isActive;
    this.team2.isActive = !this.team2.isActive;

    if (!this.team2.isActive) {
      this.hole++;
      if (this.hole > GolfSettings.getSettings().numberOfHoles) {
        this.phase = GolfGamePhase.GameOver;
      }
    }
  }
}