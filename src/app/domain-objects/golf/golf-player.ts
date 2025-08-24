import { Hit } from "../hit";
import { GolfRound } from "./golf-round";

export class GolfPlayer {
    public name: string;
    public isActive: boolean = false;
    public rounds: GolfRound[] = [];

    public get score(): number {
        return this.rounds.reduce((totalScore, round) => round.score + totalScore, 0);
    }

    public get totalAlbatrossHoles(): number {
        return this.rounds.filter(x => x.score == -3).length;
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

    private constructor(name: string) {
        this.name = name;
    }

    public recordRound(round: number, hits: Hit[]) {
        this.rounds.push(new GolfRound(round, hits));
    }

    public scoreAtHole(hole: number): number {
        return this.rounds.slice(0, hole).reduce((totalScore, round) => round.score + totalScore, 0);
    }

    static NewPlayer(name: string): GolfPlayer {
        return new GolfPlayer(name);
    }
}