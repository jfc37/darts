import { Hit } from "./hit";
import { Round } from "./round";

export class Player {
    public name: string;
    public isActive: boolean = false;
    public rounds: Round[] = [];
    private _scoreFunction: (hit: Hit, hole: number) => boolean | number;
    private _maxScorePerThrow: number;

    private constructor(
        name: string,
        didHitFunction: (hit: Hit, hole: number) => boolean | number,
        maxScorePerThrow: number) {
        this.name = name;
        this._scoreFunction = didHitFunction;
        this._maxScorePerThrow = maxScorePerThrow;
    }

    public recordRound(hits: Hit[], round: number) {
        this.rounds.push(new Round(round, hits, this._scoreFunction, this._maxScorePerThrow));
    }

    public get score(): string {
        const totalPossible = this.rounds.reduce((acc, round) => acc + round.maxScore, 0);
        const totalMakes = this.rounds.reduce((acc, round) => acc + round.makes, 0);

        if (totalPossible === 0) {
            return `${totalMakes} / ${totalPossible}`;
        }

        const percentage = (totalMakes / totalPossible).toFixed(3);
        return `${totalMakes} / ${totalPossible} (${percentage})`;
    }

    public get totalMakes(): number {
        return this.rounds.reduce((acc, round) => acc + round.makes, 0);
    }

    public scoreForRound(round: number): string {
        const roundIndex = this.rounds.findIndex(x => x.hole == round);
        const roundHits = this.rounds[roundIndex];
        return `${roundHits.makes} / ${roundHits.maxScore}`;

    }

    static NewPlayer(name: string, didHitFunction: (hit: Hit, hole: number) => boolean | number, maxScorePerThrow: number = 1): Player {
        return new Player(name, didHitFunction, maxScorePerThrow);
    }
}
