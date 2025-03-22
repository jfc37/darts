import { Injectable } from '@angular/core';

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
  public teams: KillerTeam[] = [];
  public phase: KillerGamePhase = KillerGamePhase.EnterTeams;

  private _currentTeamIndex = 0;
  private get _currentTeam(): KillerTeam {
    return this.teams[this._currentTeamIndex];
  }

  /**
   * Name of the team who's turn it is
   */
  public get nameOfCurrentTeam(): string {
    return this.teams[this._currentTeamIndex].name;
  }

  public get allTargets(): number[][] {
    return this.teams.map(t => t.targetNumbers);
  }

  /**
   * Creates a new game of killer
   * @returns 
   */
  static InitialiseNewGame(): KillerGame {
    return new KillerGame();
  }

  /**
   * Sets up the teams for the game
   * Moves the game to the next phase of entering targets
   * @param teamNames 
   * @returns 
   */
  public setTeams(teamNames: string[]) {
    this.teams = teamNames.map(name => KillerTeam.Create(name));
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
    const unavailableTargets = this.teams.flatMap(t => t.targetNumbers);
    if (unavailableTargets.includes(target)) {
      throw new Error('Target already taken');
    }

    this._currentTeam.addTarget(target);

    const allTeamsReady = this.teams.every(t => t.status === KillerTeamStatus.ReadyToPlay);
    if (allTeamsReady) {
      this.phase = KillerGamePhase.Play;
      return;
    }

    const currentTeamReady = this._currentTeam.status === KillerTeamStatus.ReadyToPlay;
    if (currentTeamReady) {
      this._currentTeamIndex++;
      return;
    }

    const currentTeamHasThrown = this._currentTeam.targets.length == TARGET_SWAPS;
    if (currentTeamHasThrown) {
      if (this._currentTeamIndex === this.teams.length - 1) {
        this._currentTeamIndex = 0;
      } else {
        this._currentTeamIndex++;
      }
    }
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
/**
 * Number of targets marked by a team before the next team takes their turn
 */
export const TARGET_SWAPS = 3;

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
  ReadyToPlay = 'ready-to-play'
}