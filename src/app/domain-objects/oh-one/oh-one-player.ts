import { DartCell } from "../dart-cell";
import { Hit } from "../hit";
import { OhOneSettings } from "./oh-one-settings";

export class OhOnePlayer {
    public name: string;
    public isActive: boolean = false;
    public points: number = 301;

    public busts: number = 0;

    private constructor(name: string) {
        this.name = name;
    }

    public recordRound(hits: Hit[]) {
        const score = hits.reduce((totalScore, hit) => totalScore + hit.value, 0);
        if (score > this.points) {
            this.busts++;
            return;
        }

        const isWinningHit = this.points - score == 0;
        if (isWinningHit) {
            const finalHitType = hits[hits.length - 1].multiplier;
            if (finalHitType == DartCell.Triple && OhOneSettings.getSettings().canExitOnATriple) {
                this.points -= score;
                return;
            } else if (finalHitType == DartCell.Double && OhOneSettings.getSettings().canExitOnADouble) {
                this.points -= score;
                return;
            } else if (OhOneSettings.getSettings().canExitOnASingle) {
                this.points -= score;
                return;
            }

            this.busts++;
            return;
        }

        if (this.points - score < getLowestNonZeroScore()) {
            return;
        }

        this.points -= score;
    }

    static NewPlayer(name: string): OhOnePlayer {
        return new OhOnePlayer(name);
    }
}

function getLowestNonZeroScore(): number {
    if (OhOneSettings.getSettings().canExitOnASingle) {
        return 1;
    } else if (OhOneSettings.getSettings().canExitOnADouble) {
        return 2;
    } else {
        return 3;
    }
}