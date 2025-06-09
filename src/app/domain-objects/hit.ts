import { DART_CELL_TEXT, DartCell, VERBOSE_DART_CELL_TEXT } from "./dart-cell";

export interface HitPoint {
    radius: number;
    angle: number;
}

export class Hit {
    /**
     * Number on the board that was hit
     */
    public number: number;

    /**
     * Score value of the hit
     */
    public value: number;

    /**
     * Multiplier of the hit
     */
    public multiplier: DartCell;

    /**
     * True if board was missed entirely
     */
    public missed: boolean;

    public point: HitPoint | undefined;

    constructor(number: number, ring: number, point?: HitPoint) {
        this.point = point;
        this.number = number;
        this.multiplier = ring;

        this.missed = ring == undefined;

        if (this.missed) {
            this.value = 0;
            this.number = 0;
        } else if (this.multiplier == DartCell.Triple) {
            this.value = number * 3;
        }
        else if (this.multiplier == DartCell.Double) {
            this.value = number * 2;
        }
        else {
            this.value = number;
        }

    }

    public toDisplayText() {
        if (this.missed) {
            return 'miss';
        }

        if ([DartCell.InnererBullsEye, DartCell.OuterBullsEye].includes(this.multiplier)) {
            return DART_CELL_TEXT[this.multiplier];
        }

        return `${DART_CELL_TEXT[this.multiplier]} ${this.number}`;
    }

    public toVerboseDisplayText() {
        if (this.missed) {
            return 'miss';
        }

        if ([DartCell.InnererBullsEye, DartCell.OuterBullsEye].includes(this.multiplier)) {
            return VERBOSE_DART_CELL_TEXT[this.multiplier];
        }

        return `${VERBOSE_DART_CELL_TEXT[this.multiplier]} ${this.number}`;
    }

    public static Triple(number: number) {
        return new Hit(number, 3);
    }

    public static Double(number: number) {
        return new Hit(number, 5);
    }

    public static Single(number: number) {
        return new Hit(number, 4);
    }
}