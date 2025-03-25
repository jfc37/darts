import { Injectable } from '@angular/core';
import { DartCell, Hit } from '../components/board/board.component';

@Injectable({
  providedIn: 'root'
})
export class KillerGameService {

  constructor() { }

  public createGame(): KillerGame {
    return KillerGame.InitialiseNewGame();
  }
}

/**
 * Represents the game state of killer
 */
export class KillerGame {
  public team1: KillerTeam = KillerTeam.Create('Team 1');
  public team2: KillerTeam = KillerTeam.Create('Team 2');
  public phase: KillerGamePhase = KillerGamePhase.EnterTeams;

  private _teamTurn = 1;

  private _turn = 1;
  private _currentTeamIndex = 0;
  private get _currentTeam(): KillerTeam {
    return this._teamTurn == 1 ? this.team1 : this.team2;
  }

  /**
   * Name of the team who's turn it is
   */
  public get nameOfCurrentTeam(): string {
    return this._currentTeam.name;
  }

  public get allTargetNumbers(): number[][] {
    return [this.team1.targetNumbers, this.team2.targetNumbers];
  }

  public get allTargets(): KillerTarget[][] {
    return [this.team1.targets, this.team2.targets];
  }

  /**
   * Creates a new game of killer
   * @returns 
   */
  static InitialiseNewGame(): KillerGame {
    return new KillerGame();
  }

  public setPlayers(players: string[]) {
    this.team1.addPlayers(players[0], players[1]);
    this.team2.addPlayers(players[2], players[3]);

    this.phase = KillerGamePhase.EnterTargets;
  }

  /**
   * Sets a target for the current team
   * Afterwards:
   * - if all teams have set all their targets, the game moves to the play phase
   * - if current team has set all their targets, the next team takes their turn
   * - if current team has thrown 3 darts, the next team takes their turn
   * 
   * @param target 
   */
  public setTarget(target: number) {
    const unavailableTargets = [...this.team1.targetNumbers, ...this.team2.targetNumbers]
    if (unavailableTargets.includes(target)) {
      throw new Error('Target already taken');
    }

    this._currentTeam.addTarget(target);

    const allTeamsReady = this.team1.status === KillerTeamStatus.ReadyToPlay && this.team2.status === KillerTeamStatus.ReadyToPlay;
    if (allTeamsReady) {
      this._turn = 1;
      this.phase = KillerGamePhase.Play;
      return;
    }

    const currentTeamReady = this._currentTeam.status === KillerTeamStatus.ReadyToPlay;
    if (currentTeamReady) {
      this.changeCurrentTeam();
      return;
    }

    const currentTeamHasThrown = this._currentTeam.targets.length == THROWS_PER_TURN;
    if (currentTeamHasThrown) {
      this.changeCurrentTeam();
    }
  }

  public hit(hit: Hit) {
    const target = this.allTargets.flat().find(t => t.target === hit.number);
    if (target != null) {
      const multiplier = [DartCell.Double, DartCell.Triple].includes(hit.multiplier) ? HitMultiplier.Double : HitMultiplier.Single;

      if (this._currentTeam.targetNumbers.includes(hit.number)) {
        target.Heal(multiplier)
      } else {
        target.Hit(multiplier);

        if ([this.team1.status, this.team2.status].includes(KillerTeamStatus.Dead))
          this.phase = KillerGamePhase.GameOver;
        return;
      }
    }

    if (this._turn == 3) {
      this.changeCurrentTeam();
      this._turn = 1;
    } else {
      this._turn++;
    }
  }

  private changeCurrentTeam() {
    this._teamTurn = this._teamTurn == 1 ? 0 : 1;
  }

}

/**
 * Represents a team in the game of killer with their targets
 */
export class KillerTeam {
  public readonly id: number;

  /**
   * Name of the team
   */
  public readonly name: string;

  public firstThrower!: string;
  public secondThrower!: string;
  public currentThrower!: string;

  /**
   * The targets the team has to protect
   */
  public targets: KillerTarget[] = [];

  /**
   * The numbers of the targets the team has to protect
   */
  public get targetNumbers(): number[] {
    return this.targets.map(t => t.target);
  }

  /**
   * Status of the team
   */
  public get status(): KillerTeamStatus {
    if (this.targets.length < TOTAL_TARGETS_PER_TEAM) {
      return KillerTeamStatus.AwaitingTargets;
    }

    return KillerTeamStatus.ReadyToPlay;
  }

  private constructor(name: string) {
    this.name = name;
    this.id = KillerTeam.nextId++;
  }

  private static nextId = 0;

  /**
   * Adds a target to the team
   * @param target
   * @throws Error if the team already has the maximum number of targets
   * @throws Error if the target already exists
   */
  public addTarget(target: number): void {
    if (this.targets.length === TOTAL_TARGETS_PER_TEAM) {
      throw new Error('Team already has the maximum number of targets');
    }

    if (this.targets.some(t => t.target === target)) {
      throw new Error('Target already exists');
    }

    this.targets.push(KillerTarget.Create(target));
  }

  public addPlayers(firstThrower: string, secondThrower: string) {
    this.firstThrower = firstThrower;
    this.secondThrower = secondThrower;

    this.currentThrower = this.firstThrower;
  }

  /**
   * Creates a new team
   * @param name 
   * @returns 
   */
  static Create(name: string): KillerTeam {
    return new KillerTeam(name);
  }
}

/**
 * Represents a number in the game of killer
 */
export class KillerTarget {
  /**
   * The target number on the board
   */
  public readonly target: number;

  /**
   * The health remaining on the target
   * Targets start with 3 health
   */
  public health: 0 | 1 | 2 | 3 = MAX_HEALTH;

  private constructor(target: number) {
    this.target = target;
  }

  /**
   * Deals damage to the target
   * Double hits only deal 1 damage if the target is not on full health (3)
   * @param type
   */
  public Hit(type: HitMultiplier): void {
    if (this.health === ZERO_HEALTH) {
      return;
    }

    if (type === HitMultiplier.Double && this.health === MAX_HEALTH) {
      this.health = 1;
    } else {
      this.health--;
    }
  }

  /**
   * Heals the target
   * Double hits will heal the target to full health
   * @param type
   */
  public Heal(type: HitMultiplier): void {
    if (this.health === ZERO_HEALTH) {
      return;
    }

    if (this.health === MAX_HEALTH) {
      return;
    }

    if (type === HitMultiplier.Double) {
      this.health = MAX_HEALTH;
    } else {
      this.health++;
    }
  }

  /**
   * Creates a new killer target
   * Must be between 1 and 20
   * @param target 
   * @returns 
   */
  static Create(target: number): KillerTarget {
    if (target < 1) {
      throw new Error('Number must be 1 or higher');
    }

    if (target > 20) {
      throw new Error('Number must be 20 or lower');
    }

    return new KillerTarget(target);
  }
}

/**
 * How much the hit is worth
 */
export enum HitMultiplier {
  /**
   * Hit a single on the board
   */
  Single = 1,

  /**
   * Hit a double or triple on the board
   */
  Double = 2
}

export const MAX_HEALTH = 3;
export const ZERO_HEALTH = 0;
export const TOTAL_TARGETS_PER_TEAM = 6;
export const THROWS_PER_TURN = 3;

/**
 * Represents the current phase of the game
 */
export enum KillerGamePhase {
  /**
   * Entering the names of the teams
   */
  EnterTeams = 'enter-teams',

  /**
   * Entering the targets for each team
   */
  EnterTargets = 'enter-targets',

  /**
   * Playing the game
   */
  Play = 'play',

  /**
   * The game has ended
   */
  GameOver = 'game-over'
}

export enum KillerTeamStatus {
  AwaitingTargets = 'awaiting-targets',
  ReadyToPlay = 'ready-to-play',
  Dead = 'dead'
}