import { Injectable } from '@angular/core';
import { TeamColours } from '../../domain-objects/team-colours';
import { Hit } from '../../domain-objects/hit';
import { DartCell } from '../../domain-objects/dart-cell';

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
    public team1: Team = Team.Create('Team 1', 0);
    public team2: Team = Team.Create('Team 2', 1);
    public phase: GamePhase = GamePhase.EnterTeams;
    public targets: Target[] = [
        new Target(15),
        new Target(16),
        new Target(17),
        new Target(18),
        new Target(19),
        new Target(20),
        // TODO: Add bullseye
        new Target(25)
    ];

    private _teamTurn = 1;
    private _roundOfThrows = 1;

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

        this.phase = GamePhase.Play;
    }

    public forfeit() {
        this.phase = GamePhase.GameOver;
    }

    public hit(hits: Hit[]) {
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

    private changeCurrentTeam() {
        this.currentTeam.changeTurn();
        this._teamTurn = this._teamTurn == 1 ? 0 : 1;

        if (this._teamTurn == 0) {
            this._roundOfThrows++;
        }
    }

    static InitialiseNewGame(): CricketGame {
        return new CricketGame();
    }

}
export class Team {
    public readonly id: number;

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

    private constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }


    public addPlayers(firstThrower: string, secondThrower: string) {
        this.firstThrower = firstThrower;
        this.secondThrower = secondThrower;
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
    static Create(name: string, teamNumber: number): Team {
        return new Team(name, teamNumber);
    }
}

export class Target {
    public readonly target: number;
    public teamOneHits: number = 0;
    public teamTwoHits: number = 0;
    public owningTeam: number | null = null;
    public points = 0;

    public constructor(target: number) {
        this.target = target;
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

    public hit(team: number, points: number) {
        if (this.status === TargetStatus.Closed) {
            return;
        }

        if (team === 1) {
            if (this.status === TargetStatus.OpenTeam1) {
                this.points += points;
            } else {
                console.error('bumping');
                this.teamOneHits += points;
            }
        } else if (this.status === TargetStatus.OpenTeam2) {
            this.points += points;
        } else {
            this.teamTwoHits += points;
        }

        return this.updateOwningTeam();
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
     * Playing the game
     */
    Play = 'play',

    /**
     * The game has ended
     */
    GameOver = 'game-over'
}
