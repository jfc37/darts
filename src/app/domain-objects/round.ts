import { Hit, HitPoint } from "./hit";

export class Round {
    public hole: number;
    private _hits: Hit[];

    private _didHitFunction: (hit: Hit, hole: number) => boolean;

    constructor(
        hole: number,
        hits: Hit[],
        didHitFunction: (hit: Hit, hole: number) => boolean) {
        this.hole = hole;
        this._hits = hits;
        this._didHitFunction = didHitFunction;
    }

    public get misses(): number {
        return this._hits.filter(x => !this._didHitFunction(x, this.hole)).length;
    }

    public get makes(): number {
        return this._hits.filter(x => this._didHitFunction(x, this.hole)).length;
    }

    public get points(): HitPoint[] {
        return this._hits.map(hit => hit.point!);
    }
}


export const TOTAL_ROUNDS = 20;

/**
 * Returns an array with number 1 to 20 in a random order
 */
export function getRandomRounds() {
    const rounds = Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1);
    for (let i = rounds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rounds[i], rounds[j]] = [rounds[j], rounds[i]];
    }
    return rounds;
}