import { DartCell } from "../dart-cell";
import { Hit } from "../hit";
import { GolfSettings } from "./golf-settings";

export class GolfRound {
    public hole: number;
    private _hits: Hit[];

    constructor(hole: number, hits: Hit[]) {
        this.hole = hole;
        this._hits = hits;
    }

    public get score(): number {
        const hitsOnRound = this._hits.filter(x => x.number == this.hole);

        const hasAlbatross = GolfSettings.getSettings().albatrossOnTriple && hitsOnRound.some(x => x.multiplier == DartCell.Triple);
        if (hasAlbatross) {
            return -3;
        }

        const hasAnEagle = hitsOnRound.some(x => [DartCell.Double, DartCell.Triple].includes(x.multiplier));
        if (hasAnEagle) {
            return -2;
        }

        const hasABirdie = hitsOnRound.some(x => x.multiplier == DartCell.SingleInner);
        if (hasABirdie) {
            return -1;
        }

        const hasPar = hitsOnRound.some(x => x.multiplier == DartCell.SingleOuter);
        if (hasPar) {
            return 0;
        }

        return 1;
    }
}