import { Hit } from "../hit";
import { TeamColours } from "../team-colours";
import { TeamNumbers } from "../team-numbers";
import { GolfPlayer } from "./golf-player";

export class GolfTeam {
    public readonly id: TeamNumbers;
    public isActive = false;
    public currentHole = 1;

    /**
     * Name of the team
     */
    public readonly name: string;

    public firstThrower!: GolfPlayer;
    public secondThrower!: GolfPlayer;

    private get _teamRounds() {
        return [
            ...this.firstThrower.rounds,
            ...this.secondThrower.rounds
        ].sort((a, b) => a.hole - b.hole > 0 ? 1 : -1);
    }

    public get currentThrower() {
        return this.currentHole % 2 == 1 ? this.firstThrower : this.secondThrower;
    }

    public get nextThrower() {
        return this.currentHole % 2 == 1 ? this.secondThrower : this.firstThrower;
    }

    public readonly colour: string;

    private constructor(name: string, teamNumber: TeamNumbers) {
        this.name = name;
        this.colour = TeamColours.getForTeam(teamNumber);
        if (teamNumber == 1) {
            this.isActive = true;
        }
        this.id = teamNumber;

    }

    public get score(): number {
        return this._teamRounds.reduce((totalScore, round) => round.score + totalScore, 0);
    }

    public get totalEagleHoles(): number {
        return this._teamRounds.filter(x => x.score == -2).length;
    }

    public get totalBirdieHoles(): number {
        return this._teamRounds.filter(x => x.score == -1).length;
    }

    public get totalParHoles(): number {
        return this._teamRounds.filter(x => x.score == 0).length;
    }

    public get totalBoogieHoles(): number {
        return this._teamRounds.filter(x => x.score == 1).length;
    }

    public addPlayers(firstThrower: string, secondThrower: string) {
        this.firstThrower = GolfPlayer.NewPlayer(firstThrower);
        this.secondThrower = GolfPlayer.NewPlayer(secondThrower);
    }

    public recordHole(hits: Hit[]) {
        this.currentThrower.recordRound(this.currentHole, hits);
        this.currentHole++;
    }

    public scoreAtHole(hole: number): number {
        return this._teamRounds.slice(0, hole).reduce((totalScore, round) => round.score + totalScore, 0);
    }

    static Create(name: string, teamNumber: TeamNumbers): GolfTeam {
        return new GolfTeam(name, teamNumber);
    }
}