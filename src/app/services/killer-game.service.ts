import { Injectable } from '@angular/core';
import { Hit } from '../domain-objects/hit';
import { DartCell } from '../domain-objects/dart-cell';

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
  public team1: KillerTeam = KillerTeam.Create('Team 1', 0);
  public team2: KillerTeam = KillerTeam.Create('Team 2', 1);
  public phase: KillerGamePhase = KillerGamePhase.EnterTeams;

  private _teamTurn = 1;

  public get currentTeam(): KillerTeam {
    return this._teamTurn == 1 ? this.team1 : this.team2;
  }

  public get opponentTeam(): KillerTeam {
    return this._teamTurn == 1 ? this.team2 : this.team1;
  }

  /**
   * Name of the team who's turn it is
   */
  public get nameOfCurrentTeam(): string {
    return this.currentTeam.name;
  }

  public get currentTeamColour(): string {
    return this.currentTeam.colour;
  }

  public get nameOfCurrentPlayer(): string {
    return this.currentTeam.currentThrower;
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
   * @param targets 
   */
  public setTargets(targets: number[]) {
    const unavailableTargets = [...this.team1.targetNumbers, ...this.team2.targetNumbers]
    if (targets.some(target => unavailableTargets.includes(target))) {
      throw new Error('Target already taken');
    }

    this.currentTeam.addTargets(targets);

    this.changeCurrentTeam();

    if (this.currentTeam.status == KillerTeamStatus.ReadyToPlay) {
      this.phase = KillerGamePhase.Play;
    }
  }

  public hit(hits: Hit[]) {
    this.currentTeam.currentThrowerStats.adjustStats(hits, this.currentTeam.targets, this.opponentTeam.targets);

    hits.forEach(hit => {
      const target = this.allTargets.flat().find(t => t.target === hit.number);
      if (target != null) {
        const multiplier = [DartCell.Double, DartCell.Triple].includes(hit.multiplier) ? HitMultiplier.Double : HitMultiplier.Single;

        if (this.currentTeam.targetNumbers.includes(hit.number)) {
          target.Heal(multiplier)
        } else {
          target.Hit(multiplier);
        }
      }
    });

    this.changeCurrentTeam();

    if (this.currentTeam.status == KillerTeamStatus.Dead) {
      this.phase = KillerGamePhase.GameOver;
    }
  }

  private changeCurrentTeam() {
    this.currentTeam.changeTurn();
    this._teamTurn = this._teamTurn == 1 ? 0 : 1;
  }

}

export class PlayerStats {
  public player: string;
  public attackingPoints = 0;
  public defendingPoints = 0;
  public omOmOms = 0;
  public pointlessTurns = 0;

  constructor(player: string) {
    this.player = player;
  }

  public adjustStats(hits: Hit[], ownTargets: KillerTarget[], opponentTargets: KillerTarget[]) {
    const attackPoints = opponentTargets.reduce((total, target) => {
      return hits.filter(x => x.number == target.target).reduce((innerTotal, hit) => {
        const multipler = [DartCell.Double, DartCell.Triple].includes(hit.multiplier) ? HitMultiplier.Double : HitMultiplier.Single;
        return innerTotal + target.getHitPoints(multipler);
      }, total);
    }, 0);
    this.attackingPoints += attackPoints;

    const defendPoints = ownTargets.reduce((total, target) => {
      return hits.filter(x => x.number == target.target).reduce((innerTotal, hit) => {
        const multipler = [DartCell.Double, DartCell.Triple].includes(hit.multiplier) ? HitMultiplier.Double : HitMultiplier.Single;
        return innerTotal + target.getHealPoints(multipler);
      }, total);
    }, 0)
    this.defendingPoints += defendPoints;

    if (attackPoints + defendPoints == 0) {
      this.pointlessTurns++;
    }

    const omOmOms = opponentTargets.reduce((total, target) => {
      if (target.health < 3) {
        return total;
      }

      const damage = hits.filter(x => x.number == target.target).reduce((innerTotal, hit) => {
        const multipler = [DartCell.Double, DartCell.Triple].includes(hit.multiplier) ? HitMultiplier.Double : HitMultiplier.Single;
        return innerTotal + target.getHitPoints(multipler);
      }, 0);
      if (damage >= 3) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
    this.omOmOms += omOmOms;
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
  private _turn = 1;
  public get currentThrower() {
    return this._turn == 1 ? this.firstThrower : this.secondThrower;
  }

  public firstThrowerStats!: PlayerStats;
  public secondThrowerStats!: PlayerStats;
  public get currentThrowerStats() {
    return this._turn == 1 ? this.firstThrowerStats : this.secondThrowerStats;
  }

  public readonly colour: string;

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

    if (this.targets.every(target => target.health === 0)) {
      return KillerTeamStatus.Dead;
    }

    return KillerTeamStatus.ReadyToPlay;
  }

  private constructor(name: string, id: number) {
    this.name = name;
    this.colour = TEAM_COLOURS[id];
    this.id = id;
  }

  /**
   * Adds a target to the team
   * @param newTargets
   * @throws Error if the team already has the maximum number of targets
   * @throws Error if the target already exists
   */
  public addTargets(newTargets: number[]): void {
    if (this.targets.length === TOTAL_TARGETS_PER_TEAM) {
      throw new Error('Team already has the maximum number of targets');
    }

    if (newTargets.some(target => this.targets.some(t => t.target === target))) {
      throw new Error('Target already exists');
    }

    newTargets.forEach(target => this.targets.push(KillerTarget.Create(target, this.colour)));
  }

  public addPlayers(firstThrower: string, secondThrower: string) {
    this.firstThrower = firstThrower;
    this.secondThrower = secondThrower;
    this.firstThrowerStats = new PlayerStats(firstThrower);
    this.secondThrowerStats = new PlayerStats(secondThrower);
  }

  public changeTurn() {
    if (this._turn == 1) {
      this._turn = 2;
    } else {
      this._turn = 1;
    }
  }

  /**
   * Creates a new team
   * @param name 
   * @returns 
   */
  static Create(name: string, teamNumber: number): KillerTeam {
    return new KillerTeam(name, teamNumber);
  }
}

export const TEAM_COLOURS = [
  '#0094C6',
  '#A14A76'
]

/**
 * Represents a number in the game of killer
 */
export class KillerTarget {
  /**
   * The target number on the board
   */
  public readonly target: number;

  /**
   * Colour to paint on the board with
   */
  public readonly colour: string;

  /**
   * The health remaining on the target
   * Targets start with 3 health
   */
  public health: 0 | 1 | 2 | 3 = MAX_HEALTH;

  private constructor(target: number, colour: string) {
    this.target = target;
    this.colour = colour;
  }

  public getHitPoints(type: HitMultiplier): number {
    if (this.health === ZERO_HEALTH) {
      return 0;
    }

    if (type === HitMultiplier.Double && this.health === MAX_HEALTH) {
      return 2;
    } else {
      return 1;
    }
  }

  /**
   * Deals damage to the target
   * Double hits only deal 1 damage if the target is not on full health (3)
   * @param type
   */
  public Hit(type: HitMultiplier): void {
    const points = this.getHitPoints(type);
    this.health -= points;
  }

  public getHealPoints(type: HitMultiplier): number {
    if (this.health === ZERO_HEALTH) {
      return 0;
    }

    if (this.health === MAX_HEALTH) {
      return 0;
    }

    if (type === HitMultiplier.Double && this.health == 1) {
      return 2;
    } else {
      return 1;
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
  static Create(target: number, colour: string): KillerTarget {
    if (target < 1) {
      throw new Error('Number must be 1 or higher');
    }

    if (target > 20) {
      throw new Error('Number must be 20 or lower');
    }

    return new KillerTarget(target, colour);
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