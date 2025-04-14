import { Injectable } from '@angular/core';
import { Hit } from '../components/board/board.component';

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
  public team1: GolfTeam = GolfTeam.Create('Team 1');
  public team2: GolfTeam = GolfTeam.Create('Team 2');
  public teams = [this.team1, this.team2];
  public hole = 1;
  public phase: TeamGolfGamePhase = TeamGolfGamePhase.EnterTeams;

  public get activeTeam() {
    return this.teams.find(x => x.isActive)!;
  }

  static InitialiseNewGame(): TeamGolfGame {
    return new TeamGolfGame();
  }

  public setPlayers(players: string[]) {
    this.team1.addPlayers(players[0], players[1]);
    this.team2.addPlayers(players[2], players[3]);

    this.phase = TeamGolfGamePhase.Play;
  }

  public recordHole(hits: Hit[]) {
    this.activeTeam.recordHole(hits);
    this.changeToNextTeam();
  }

  private changeToNextTeam() {
    this.activeTeam.changeTurn();

    this.team1.isActive = !this.team1.isActive;
    this.team2.isActive = !this.team2.isActive;

    if (!this.team2.isActive) {
      this.hole++;
      if (this.hole > TOTAL_HOLES) {
        this.phase = TeamGolfGamePhase.GameOver;
      }
    }
  }
}

export class GolfTeam {
  public readonly id: number;
  public isActive = false;
  public rounds: GolfRound[] = [];

  /**
   * Name of the team
   */
  public readonly name: string;

  public firstThrower!: string;
  public secondThrower!: string;
  private _turn = 1;
  public get currentThrower() {
    return this._turn == 1 ? this.firstThrower : this.secondThrower;
  }

  public get nextThrower() {
    return this._turn == 1 ? this.secondThrower : this.firstThrower;
  }

  public firstThrowerStats!: PlayerStats;
  public secondThrowerStats!: PlayerStats;
  public get currentThrowerStats() {
    return this._turn == 1 ? this.firstThrowerStats : this.secondThrowerStats;
  }

  public readonly colour: string;

  private constructor(name: string) {
    this.name = name;
    this.colour = TEAM_COLOURS[GolfTeam.nextId];
    if (GolfTeam.nextId == 0) {
      this.isActive = true;
    }
    this.id = GolfTeam.nextId++;

  }

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

  public addPlayers(firstThrower: string, secondThrower: string) {
    this.firstThrower = firstThrower;
    this.secondThrower = secondThrower;
    this.firstThrowerStats = new PlayerStats(firstThrower);
    this.secondThrowerStats = new PlayerStats(secondThrower);
  }

  public recordHole(hits: Hit[]) {
    const holeScore = new GolfRound(this.rounds.length + 1, hits);
    this.rounds.push(holeScore);
    this.currentThrowerStats.adjustStats(holeScore);
  }

  public scoreAtHole(hole: number): number {
    return this.rounds.slice(0, hole).reduce((totalScore, round) => round.score + totalScore, 0);
  }

  public changeTurn() {
    if (this._turn == 1) {
      this._turn = 2;
    } else {
      this._turn = 1;
    }
  }

  private static nextId = 0;

  static Create(name: string): GolfTeam {
    return new GolfTeam(name);
  }

}

export class PlayerStats {
  public player: string;
  public boogies: number = 0;
  public pars: number = 0;
  public birdies: number = 0;
  public eagles: number = 0;

  constructor(player: string) {
    this.player = player;
  }

  public adjustStats(holeScore: GolfRound) {
    if (holeScore.score == -2) {
      this.eagles++;
    } else if (holeScore.score == -1) {
      this.birdies++;
    } else if (holeScore.score == 0) {
      this.pars++;
    }
    else if (holeScore.score == 1) {
      this.boogies++;
    }
  }

}

export const TEAM_COLOURS = [
  '#0094C6',
  '#A14A76'
]

export enum TeamGolfGamePhase {
  /**
   * Entering the names of the teams
   */
  EnterTeams = 'enter-teams',

  /**
   * Playing the game
   */
  Play = 'play',

  /**
   * The game has ended
   */
  GameOver = 'game-over'
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

export enum DartCell {
  SingleInner = 2,
  SingleOuter = 4,
  Double = 5,
  Triple = 3,
  OuterBullsEye = 1,
  InnererBullsEye = 0,
}

export const DART_CELL_TEXT = {
  [DartCell.SingleInner]: 'single',
  [DartCell.SingleOuter]: 'single',
  [DartCell.Double]: 'double',
  [DartCell.Triple]: 'triple',
  [DartCell.OuterBullsEye]: 'outer bulls eye',
  [DartCell.InnererBullsEye]: 'inner bulls eye',
}

export const VERBOSE_DART_CELL_TEXT = {
  [DartCell.SingleInner]: 'single inner',
  [DartCell.SingleOuter]: 'single outer',
  [DartCell.Double]: 'double',
  [DartCell.Triple]: 'triple',
  [DartCell.OuterBullsEye]: 'outer bulls eye',
  [DartCell.InnererBullsEye]: 'inner bulls eye',
}

export const TOTAL_HOLES = 18;