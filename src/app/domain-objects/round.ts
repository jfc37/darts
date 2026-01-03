import { Hit, HitPoint } from "./hit";

export class Round {
    public hole: number;
    private _hits: Hit[];

    private _scoreFunction: (hit: Hit, hole: number) => boolean | number;
    public readonly maxScorePerThrow: number;

    constructor(
        hole: number,
        hits: Hit[],
        didHitFunction: (hit: Hit, hole: number) => boolean | number,
        maxScorePerThrow: number = 1) {
        this.hole = hole;
        this._hits = hits;
        this._scoreFunction = didHitFunction;
        this.maxScorePerThrow = maxScorePerThrow;
    }

    public get misses(): number {
        return this._hits.filter(x => this.scoreHit(x) === 0).length;
    }

    public get makes(): number {
        return this._hits.reduce((total, hit) => total + this.scoreHit(hit), 0);
    }

    public get maxScore(): number {
        return this._hits.length * this.maxScorePerThrow;
    }

    public get points(): HitPoint[] {
        return this._hits.map(hit => hit.point!);
    }

    private scoreHit(hit: Hit): number {
        const result = this._scoreFunction(hit, this.hole);
        return typeof result === 'boolean' ? result ? 1 : 0 : result;
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
