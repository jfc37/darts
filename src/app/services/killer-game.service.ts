import { Injectable } from '@angular/core';
import { Hit } from '../domain-objects/hit';
import { DartCell } from '../domain-objects/dart-cell';
import { TeamColours } from '../domain-objects/team-colours';
import { TeamNumbers } from '../domain-objects/team-numbers';

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
  public team1: KillerTeam = KillerTeam.Create('Team 1', 1);
  public team2: KillerTeam = KillerTeam.Create('Team 2', 2);
  public phase: KillerGamePhase = KillerGamePhase.EnterTeams;

  private _teamTurn = 1;
  private _roundOfThrows = 1;

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
    return TeamColours.getForTeam(this.currentTeam.id);
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

  public switchTeamColours() {
    TeamColours.toggleColours();
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
    this.currentTeam.currentThrowerStats.adjustStats(hits, this.currentTeam.targets, this.opponentTeam.targets, this._roundOfThrows);

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

    if (this._teamTurn == 0) {
      this._roundOfThrows++;
    }
  }

}

/**
 * Total number of health points removed from the opponent's targets
 */
function calculateAttackPoints(delta: TurnDelta): number {
  return delta.opponent.reduce((total, target) => {
    const damageDealt = target.before.health - target.after.health;
    return total + damageDealt;
  }, 0);
}

/**
 * Total number of health points added back to own targets
 */
function calculateDefencePoints(delta: TurnDelta): number {
  return delta.own.reduce((total, target) => {
    const healthReceived = target.after.health - target.before.health;
    return total + healthReceived;
  }, 0);
}

/**
 * Total number of attack and defence points combined
 */
function calculateTotalPoints(delta: TurnDelta): number {
  return calculateAttackPoints(delta) + calculateDefencePoints(delta);
}

/**
 * 1 if no points were scored in the turn, 0 otherwise
 */
function calculatePointlessTurn(delta: TurnDelta): number {
  const noAttackPoints = calculateAttackPoints(delta) === 0;
  const noDefencePoints = calculateDefencePoints(delta) === 0;
  if (noAttackPoints && noDefencePoints) {
    return 1;
  }
  return 0;
}

/**
 * 1 if an opponent's target was hit from green to dead, 0 otherwise - 2 or 3 hits
 */
function calculateOmOmOms(delta: TurnDelta): number {
  const greenToDead = delta.opponent.filter(t => t.before.health === 3 && t.after.health === 0);
  if (greenToDead.length > 0) {
    return 1
  }
  return 0;
}

/**
 * 1 if an opponent's target was hit from green to dead, 0 otherwise - MUST BE WITH 3 HITS
 */
function calculateClassicOmOmOms(delta: TurnDelta, hits: Hit[]): number {
  const greenToDead = delta.opponent.filter(t => t.before.health === 3 && t.after.health === 0);
  if (greenToDead.length == 0) {
    return 0;
  }

  const targetNumber = greenToDead[0].before.target;
  const hitsOnTarget = hits.filter(h => h.number === targetNumber);
  if (hitsOnTarget.length === 3) {
    return 1;
  }
  return 0;
}

/**
 * Number of opponent's targets that were killed in the turn
 */
function calculateKills(delta: TurnDelta): number {
  return delta.opponent.filter(t => t.before.health > 0 && t.after.health === 0).length;
}

/**
 * Number of opponent's targets that went from green to dead
 */
function calculateGreenToDead(delta: TurnDelta): number {
  return delta.opponent.filter(t => t.before.health === 3 && t.after.health === 0).length;
}

/**
 * Number of opponent's targets that went from orange to dead
 */
function calculateOrangeToDead(delta: TurnDelta): number {
  return delta.opponent.filter(t => t.before.health === 2 && t.after.health === 0).length;
}

/**
 * Number of opponent's targets that went from red to dead
 */
function calculateRedToDead(delta: TurnDelta): number {
  return delta.opponent.filter(t => t.before.health === 1 && t.after.health === 0).length;
}

/**
 * Number of opponent's targets that went from orange to red
 */
function calculateOrangeToRed(delta: TurnDelta): number {
  return delta.opponent.filter(t => t.before.health === 2 && t.after.health === 1).length;
}

/**
 * Number of opponent's targets that went from green to red
 */
function calculateGreenToRed(delta: TurnDelta): number {
  return delta.opponent.filter(t => t.before.health === 3 && t.after.health === 1).length;
}

/**
 * Number of opponent's targets that went from green to orange
 */
function calculateGreenToOrange(delta: TurnDelta): number {
  return delta.opponent.filter(t => t.before.health === 3 && t.after.health === 2).length;
}

/**
 * Number of own targets that went from red to green
 */
function calculateRedToGreen(delta: TurnDelta): number {
  return delta.own.filter(t => t.before.health === 1 && t.after.health === 3).length;
}

/**
 * Number of own targets that went from red to orange
 */
function calculateRedToOrange(delta: TurnDelta): number {
  return delta.own.filter(t => t.before.health === 1 && t.after.health === 2).length;
}

/**
 * Number of own targets that went from orange to green
 */
function calculateOrangeToGreen(delta: TurnDelta): number {
  return delta.own.filter(t => t.before.health === 2 && t.after.health === 3).length;
}

interface TurnDelta {
  own: {
    before: KillerTarget;
    after: KillerTarget;
  }[];
  opponent: {
    before: KillerTarget;
    after: KillerTarget;
  }[];
}


export class PlayerStats {
  public player: string;
  public attackingPoints = 0;
  public defendingPoints = 0;
  public omOmOms = 0;
  public pointlessTurns = 0;

  // Classic killer stats
  public totalPoints = 0;
  public classicOmOmOms = 0;
  public kills = 0;

  // Colour changes - attacking
  public greenToDead = 0;
  public orangeToDead = 0;
  public redToDead = 0;
  public orangeToRed = 0;
  public greenToRed = 0;
  public greenToOrange = 0;

  // Colour changes - defending
  public redToGreen = 0;
  public redToOrange = 0;
  public orangeToGreen = 0;

  // Averages
  public pointsPerTurn = '0';
  public pointsPerThrow = '0';

  constructor(player: string) {
    this.player = player;
  }

  public adjustStats(hits: Hit[], ownTargets: KillerTarget[], opponentTargets: KillerTarget[], totalTurns: number) {
    const clonedOwnTargets = ownTargets.map(t => t.Clone());
    const clonedOpponentTargets = opponentTargets.map(t => t.Clone());
    hits.forEach(hit => {
      const multiplier = [DartCell.Double, DartCell.Triple].includes(hit.multiplier) ? HitMultiplier.Double : HitMultiplier.Single;
      const ownTarget = clonedOwnTargets.find(t => t.target === hit.number);
      if (ownTarget != null) {
        ownTarget.Heal(multiplier);
      }

      const opponentTarget = clonedOpponentTargets.find(t => t.target === hit.number);
      if (opponentTarget != null) {
        opponentTarget.Hit(multiplier);
      }
    });
    const changes = {
      own: ownTargets.map(t => ({
        before: t,
        after: clonedOwnTargets.find(x => x.target === t.target)!
      })),
      opponent: opponentTargets.map(t => ({
        before: t,
        after: clonedOpponentTargets.find(x => x.target === t.target)!
      }))
    }

    this.attackingPoints += calculateAttackPoints(changes);
    this.defendingPoints += calculateDefencePoints(changes);
    this.totalPoints += calculateTotalPoints(changes);

    this.pointlessTurns += calculatePointlessTurn(changes);
    this.omOmOms += calculateOmOmOms(changes);
    this.classicOmOmOms += calculateClassicOmOmOms(changes, hits);
    this.kills += calculateKills(changes);
    this.greenToDead += calculateGreenToDead(changes);
    this.orangeToDead += calculateOrangeToDead(changes);
    this.redToDead += calculateRedToDead(changes);
    this.orangeToRed += calculateOrangeToRed(changes);
    this.greenToRed += calculateGreenToRed(changes);
    this.greenToOrange += calculateGreenToOrange(changes);
    this.redToGreen += calculateRedToGreen(changes);
    this.redToOrange += calculateRedToOrange(changes);
    this.orangeToGreen += calculateOrangeToGreen(changes);

    this.pointsPerTurn = (this.totalPoints / totalTurns).toFixed(3);
    this.pointsPerThrow = (this.totalPoints / (totalTurns * THROWS_PER_TURN)).toFixed(3);
  }
}

/**
 * Represents a team in the game of killer with their targets
 */
export class KillerTeam {
  public readonly id: TeamNumbers;

  public get colour(): string {
    return TeamColours.getForTeam(this.id);
  }

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

  private constructor(name: string, id: TeamNumbers) {
    this.name = name;
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

    newTargets.forEach(target => this.targets.push(KillerTarget.Create(target, TeamColours.getForTeam(this.id))));
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
  static Create(name: string, teamNumber: TeamNumbers): KillerTeam {
    return new KillerTeam(name, teamNumber);
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

  public Clone(): KillerTarget {
    const clone = new KillerTarget(this.target, this.colour);
    clone.health = this.health;
    return clone;
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
