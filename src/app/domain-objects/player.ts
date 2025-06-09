import { Hit } from "./hit";
import { Round } from "./round";

export class Player {
    public name: string;
    public isActive: boolean = false;
    public rounds: Round[] = [];
    private _didHitFunction: (hit: Hit, hole: number) => boolean;

    private constructor(
        name: string,
        didHitFunction: (hit: Hit, hole: number) => boolean) {
        this.name = name;
        this._didHitFunction = didHitFunction;
    }

    public recordRound(hits: Hit[], round: number) {
        this.rounds.push(new Round(round, hits, this._didHitFunction));
    }

    public get score(): string {
        const totalThrows = this.rounds.length * 3;
        const totalMakes = this.rounds.reduce((acc, round) => acc + round.makes, 0);

        if (totalThrows === 0) {
            return `${totalMakes} / ${totalThrows}`;
        }

        const percentage = (totalMakes / totalThrows).toFixed(3);
        return `${totalMakes} / ${totalThrows} (${percentage})`;
    }

    public get totalMakes(): number {
        return this.rounds.reduce((acc, round) => acc + round.makes, 0);
    }

    public scoreForRound(round: number): string {
        const roundIndex = this.rounds.findIndex(x => x.hole == round);
        const roundHits = this.rounds[roundIndex];
        return `${roundHits.makes} / 3`;

    }

    static NewPlayer(name: string, didHitFunction: (hit: Hit, hole: number) => boolean): Player {
        return new Player(name, didHitFunction);
    }
}