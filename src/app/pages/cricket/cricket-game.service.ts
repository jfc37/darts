import { Injectable } from '@angular/core';
import { TeamColours } from '../../domain-objects/team-colours';
import { Hit } from '../../domain-objects/hit';
import { DartCell } from '../../domain-objects/dart-cell';
import { TeamNumbers } from '../../domain-objects/team-numbers';


export class CricketSettings {
    // When bullseye is opened, should everyone elses marks on it be cleared?
    public clearTargetsOnBullseye = false;
}

let SETTINGS = new CricketSettings();

@Injectable({
    providedIn: 'root'
})
export class CricketGameService {

    constructor() { }

    public createGame(): CricketGame {
        return CricketGame.InitialiseNewGame();
    }
}
/**
 * Represents the game state of cricket
 */
export class CricketGame {
    public team1: Team = Team.Create('Team 1', 1);
    public team2: Team = Team.Create('Team 2', 2);
    public phase: GamePhase = GamePhase.EnterTeams;
    public targets: Target[] = [
        new Target(15),
        new Target(16),
        new Target(17),
        new Target(18),
        new Target(19),
        new Target(20),
        new Target(25)
    ];

    private _teamTurn: TeamNumbers = 1;
    private _roundOfThrows = 1;
    private history: CricketSnapshot[] = [];

    public get currentTeam(): Team {
        return this._teamTurn == 1 ? this.team1 : this.team2;
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

    public switchTeamColours() {
        TeamColours.toggleColours();
    }

    public setPlayers(players: string[]) {
        this.team1.addPlayers(players[0], players[1]);
        this.team2.addPlayers(players[2], players[3]);

        this.phase = GamePhase.EnterSettings;
    }

    public setSettings(settings: CricketSettings) {
        SETTINGS = settings;

        this.phase = GamePhase.Play;
    }

    public forfeit() {
        this.phase = GamePhase.GameOver;
    }

    public hit(hits: Hit[]) {
        this.saveSnapshot();
        this.currentTeam.currentThrowerStats.adjustStats(hits, this.targets, this._roundOfThrows);

        hits.forEach(hit => {
            const target = this.targets.find(t => t.target === hit.number);
            if (target != null) {
                const points = hit.multiplier === DartCell.Triple ? 3 : hit.multiplier === DartCell.Double ? 2 : 1;

                target.hit(this._teamTurn, points)
            }

            // Handle inner bullseye hits
            if (hit.number === 50) {
                const bulleyeTarget = this.targets.find(t => t.target === 25);
                if (bulleyeTarget != null) {
                    bulleyeTarget.hit(this._teamTurn, 2);
                }
            }
        });

        this.changeCurrentTeam();

        if (this.targets.every(t => t.status === TargetStatus.Closed)) {
            this.phase = GamePhase.GameOver;
        }
    }

    public undoLastTurn() {
        const previous = this.history.pop();
        if (!previous) {
            return;
        }

        this.phase = previous.phase;
        this._teamTurn = previous.teamTurn;
        this._roundOfThrows = previous.roundOfThrows;
        this.team1 = this.restoreTeam(previous.team1);
        this.team2 = this.restoreTeam(previous.team2);
        this.targets = previous.targets.map(target => this.restoreTarget(target));
    }

    public get canUndo() {
        return this.history.length > 0;
    }

    private changeCurrentTeam() {
        this.currentTeam.changeTurn();
        this._teamTurn = this._teamTurn == 2 ? 1 : 2;

        if (this._teamTurn == 1) {
            this._roundOfThrows++;
        }
    }

    private saveSnapshot() {
        this.history.push({
            phase: this.phase,
            teamTurn: this._teamTurn,
            roundOfThrows: this._roundOfThrows,
            team1: this.cloneTeam(this.team1),
            team2: this.cloneTeam(this.team2),
            targets: this.targets.map(t => this.cloneTarget(t))
        });
    }

    private cloneTeam(team: Team): CricketTeamSnapshot {
        return {
            id: team.id,
            name: team.name,
            firstThrower: team.firstThrower,
            secondThrower: team.secondThrower,
            firstThrowerStats: this.cloneStats(team.firstThrowerStats),
            secondThrowerStats: this.cloneStats(team.secondThrowerStats),
            turn: (team as any)._turn ?? 1
        }
    }

    private restoreTeam(snapshot: CricketTeamSnapshot): Team {
        const restored = Team.Create(snapshot.name, snapshot.id);
        restored.addPlayers(snapshot.firstThrower, snapshot.secondThrower);
        (restored as any)._turn = snapshot.turn;
        restored.firstThrowerStats = this.restoreStats(snapshot.firstThrowerStats, snapshot.id);
        restored.secondThrowerStats = this.restoreStats(snapshot.secondThrowerStats, snapshot.id);
        return restored;
    }

    private cloneTarget(target: Target): TargetSnapshot {
        return {
            target: target.target,
            teamOneHits: target.teamOneHits,
            teamTwoHits: target.teamTwoHits,
            owningTeam: target.owningTeam,
            points: target.points
        }
    }

    private restoreTarget(snapshot: TargetSnapshot): Target {
        const restored = new Target(snapshot.target);
        restored.teamOneHits = snapshot.teamOneHits;
        restored.teamTwoHits = snapshot.teamTwoHits;
        restored.owningTeam = snapshot.owningTeam;
        restored.points = snapshot.points;
        return restored;
    }

    private cloneStats(stats: PlayerStats): CricketPlayerStatsSnapshot {
        return { ...stats } as CricketPlayerStatsSnapshot;
    }

    private restoreStats(snapshot: CricketPlayerStatsSnapshot, team: TeamNumbers): PlayerStats {
        const restored = new PlayerStats(snapshot.player, team);
        Object.assign(restored, snapshot);
        return restored;
    }

    static InitialiseNewGame(): CricketGame {
        return new CricketGame();
    }

}
export class Team {
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

    private constructor(name: string, id: TeamNumbers) {
        this.name = name;
        this.id = id;
    }


    public addPlayers(firstThrower: string, secondThrower: string) {
        this.firstThrower = firstThrower;
        this.secondThrower = secondThrower;
        this.firstThrowerStats = new PlayerStats(firstThrower, this.id);
        this.secondThrowerStats = new PlayerStats(secondThrower, this.id);
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
    static Create(name: string, teamNumber: TeamNumbers): Team {
        return new Team(name, teamNumber);
    }
}

export class Target {
    public readonly target: number;
    public teamOneHits: number = 0;
    public teamTwoHits: number = 0;
    public owningTeam: TeamNumbers | null = null;
    public points = 0;

    public constructor(target: number) {
        this.target = target;
    }

    public Clone(): Target {
        const clone = new Target(this.target);
        clone.teamOneHits = this.teamOneHits;
        clone.teamTwoHits = this.teamTwoHits;
        clone.owningTeam = this.owningTeam;
        clone.points = this.points;
        return clone;
    }

    public get status(): TargetStatus {
        if (this.teamOneHits < 3 && this.teamTwoHits < 3) {
            return TargetStatus.Available;
        } else if (this.teamOneHits >= 3 && this.teamTwoHits < 3) {
            return TargetStatus.OpenTeam1;
        } else if (this.teamOneHits < 3 && this.teamTwoHits >= 3) {
            return TargetStatus.OpenTeam2;
        } else {
            return TargetStatus.Closed;
        }
    }

    public get pointsForTeamOne(): number {
        if (this.owningTeam === 1) {
            return this.points;
        }

        return 0;
    }

    public get pointsForTeamTwo(): number {
        if (this.owningTeam === 2) {
            return this.points;
        }

        return 0;
    }

    public hit(team: TeamNumbers, points: number) {
        if (this.status === TargetStatus.Closed) {
            return;
        }

        let isPossibleBullseyeClear = false;

        if (team === 1) {
            if (this.status === TargetStatus.OpenTeam1) {
                // You get points for the target number * the multiplier
                this.points += points * this.target;
            } else {
                this.teamOneHits += points;
                isPossibleBullseyeClear = true;
            }
        } else if (this.status === TargetStatus.OpenTeam2) {
            // You get points for the target number * the multiplier
            this.points += points * this.target;
        } else {
            this.teamTwoHits += points;
            isPossibleBullseyeClear = true;
        }

        this.updateOwningTeam();

        if (isPossibleBullseyeClear) {
            this.runBullseyeRule(team);
        }
    }

    private runBullseyeRule(team: TeamNumbers) {
        if (!SETTINGS.clearTargetsOnBullseye) {
            return;
        }

        if (this.target !== 25) {
            return;
        }

        if (team === 1 && this.status === TargetStatus.OpenTeam1) {
            this.teamTwoHits = 0;
        } else if (team === 2 && this.status === TargetStatus.OpenTeam2) {
            this.teamOneHits = 0;
        }
    }

    private updateOwningTeam() {
        if (this.owningTeam !== null) {
            return;
        }

        if (this.status === TargetStatus.OpenTeam1) {
            this.owningTeam = 1;
        } else if (this.status === TargetStatus.OpenTeam2) {
            this.owningTeam = 2;
        }
    }
}

export class PlayerStats {
    public player: string;
    public points = 0;

    // number of targets opened for scoring
    public openers = 0;

    // number of targets closed for scoring
    public closers = 0;

    public pointlessTurns = 0;

    private team: TeamNumbers;

    constructor(player: string, team: TeamNumbers) {
        this.player = player;
        this.team = team;
    }

    public adjustStats(hits: Hit[], targets: Target[], totalTurns: number) {
        const clonedTargets = targets.map(t => t.Clone());
        hits.forEach(hit => {
            const target = clonedTargets.find(t => t.target === hit.number);
            if (target != null) {
                const points = hit.multiplier === DartCell.Triple ? 3 : hit.multiplier === DartCell.Double ? 2 : 1;

                target.hit(this.team, points)
            }

            // Handle inner bullseye hits
            if (hit.number === 50) {
                const bulleyeTarget = clonedTargets.find(t => t.target === 25);
                if (bulleyeTarget != null) {
                    bulleyeTarget.hit(this.team, 2);
                }
            }
        });

        this.points += calculatePoints(targets, clonedTargets);
        this.openers += calculateOpeners(targets, clonedTargets);
        this.closers += calculateClosers(targets, clonedTargets);
        this.pointlessTurns += calculatePointlessTurns(targets, clonedTargets);
    }
}

function calculatePoints(before: Target[], after: Target[]): number {
    const pointsBefore = before.reduce((sum, target) => sum + target.points, 0);
    const pointsAfter = after.reduce((sum, target) => sum + target.points, 0);

    return pointsAfter - pointsBefore;
}

function calculateOpeners(before: Target[], after: Target[]): number {
    const availableBefore = before.filter(t => t.status === TargetStatus.Available).length;
    const availableAfter = after.filter(t => t.status === TargetStatus.Available).length;

    return availableBefore - availableAfter;
}

function calculateClosers(before: Target[], after: Target[]): number {
    const closedBefore = before.filter(t => t.status === TargetStatus.Closed).length;
    const closedAfter = after.filter(t => t.status === TargetStatus.Closed).length;

    return closedAfter - closedBefore;
}

function calculatePointlessTurns(before: Target[], after: Target[]): number {
    const pointsBefore = before.reduce((sum, target) => sum + target.points, 0);
    const pointsAfter = after.reduce((sum, target) => sum + target.points, 0);
    const noChangeInPoints = pointsAfter === pointsBefore;

    const hitsBefore = before.reduce((sum, target) => sum + target.teamOneHits + target.teamTwoHits, 0);
    const hitsAfter = after.reduce((sum, target) => sum + target.teamOneHits + target.teamTwoHits, 0);
    const noChangeInHits = hitsAfter === hitsBefore;

    return noChangeInPoints && noChangeInHits ? 1 : 0;
}

export enum TargetStatus {
    Available = 'available',
    OpenTeam1 = 'open-team-1',
    OpenTeam2 = 'open-team-2',
    Closed = 'closed'
}

/**
 * Represents the current phase of the game
 */
export enum GamePhase {
    /**
     * Entering the names of the teams
     */
    EnterTeams = 'enter-teams',

    /**
     * Entering the settings for the game
     */
    EnterSettings = 'enter-settings',

    /**
     * Playing the game
     */
    Play = 'play',

    /**
     * The game has ended
     */
    GameOver = 'game-over'
}

interface CricketSnapshot {
    phase: GamePhase;
    teamTurn: TeamNumbers;
    roundOfThrows: number;
    team1: CricketTeamSnapshot;
    team2: CricketTeamSnapshot;
    targets: TargetSnapshot[];
}

interface CricketTeamSnapshot {
    id: TeamNumbers;
    name: string;
    firstThrower: string;
    secondThrower: string;
    firstThrowerStats: CricketPlayerStatsSnapshot;
    secondThrowerStats: CricketPlayerStatsSnapshot;
    turn: number;
}

interface TargetSnapshot {
    target: number;
    teamOneHits: number;
    teamTwoHits: number;
    owningTeam: TeamNumbers | null;
    points: number;
}

type CricketPlayerStatsSnapshot = Omit<PlayerStats, 'adjustStats'>;