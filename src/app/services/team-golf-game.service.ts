import { Injectable } from '@angular/core';
import { Hit } from '../domain-objects/hit';
import { GolfGamePhase } from '../domain-objects/golf/golf-game-phase';
import { GolfSettings } from '../domain-objects/golf/golf-settings';
import { GolfTeam } from '../domain-objects/golf/golf-team';
import { GolfRound } from '../domain-objects/golf/golf-round';
import { TeamNumbers } from '../domain-objects/team-numbers';

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

  private history: TeamGolfSnapshot[] = [];

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
    this.saveSnapshot();
    this.activeTeam.recordHole(hits);
    this.changeToNextTeam();
  }

  public undoLastTurn() {
    const previous = this.history.pop();
    if (!previous) {
      return;
    }

    this.phase = previous.phase;
    this.hole = previous.hole;
    this.team1 = this.restoreTeam(previous.team1);
    this.team2 = this.restoreTeam(previous.team2);
    this.teams = [this.team1, this.team2];
  }

  public get canUndo() {
    return this.history.length > 0;
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

  private saveSnapshot() {
    this.history.push({
      phase: this.phase,
      hole: this.hole,
      team1: this.cloneTeam(this.team1),
      team2: this.cloneTeam(this.team2)
    });
  }

  private cloneTeam(team: GolfTeam): TeamGolfTeamSnapshot {
    return {
      id: team.id,
      name: team.name,
      isActive: team.isActive,
      currentHole: team.currentHole,
      firstThrower: this.clonePlayer(team.firstThrower),
      secondThrower: this.clonePlayer(team.secondThrower)
    };
  }

  private clonePlayer(player: GolfPlayer) {
    return {
      name: player.name,
      isActive: player.isActive,
      rounds: player.rounds.map(round => ({
        hole: round.hole,
        hits: (round as any)._hits ?? []
      }))
    };
  }

  private restoreTeam(snapshot: TeamGolfTeamSnapshot): GolfTeam {
    const restored = GolfTeam.Create(snapshot.name, snapshot.id);
    restored.isActive = snapshot.isActive;
    restored.currentHole = snapshot.currentHole;
    restored.addPlayers(snapshot.firstThrower.name, snapshot.secondThrower.name);
    restored.firstThrower.isActive = snapshot.firstThrower.isActive;
    restored.secondThrower.isActive = snapshot.secondThrower.isActive;
    restored.firstThrower.rounds = snapshot.firstThrower.rounds.map(round => new GolfRound(round.hole, round.hits.map(h => new Hit(h.number, h.multiplier, h.point))));
    restored.secondThrower.rounds = snapshot.secondThrower.rounds.map(round => new GolfRound(round.hole, round.hits.map(h => new Hit(h.number, h.multiplier, h.point))));
    return restored;
  }
}

interface TeamGolfSnapshot {
  phase: GolfGamePhase;
  hole: number;
  team1: TeamGolfTeamSnapshot;
  team2: TeamGolfTeamSnapshot;
}

interface TeamGolfTeamSnapshot {
  id: TeamNumbers;
  name: string;
  isActive: boolean;
  currentHole: number;
  firstThrower: { name: string; isActive: boolean; rounds: { hole: number; hits: Hit[] }[]; };
  secondThrower: { name: string; isActive: boolean; rounds: { hole: number; hits: Hit[] }[]; };
}