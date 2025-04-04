import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import '../dart-board/dartbot-dartboard';
import { Dartboard, DartboardPointerEvent } from '../dart-board/Dartboard';
import { getSectorValue } from '../dart-board/draw-board/board';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements AfterViewInit {
  private dartboard!: Dartboard | null;

  @Input() player: string = '';

  @Input() set colouredSections(value: { [key: string]: string }) {
    this._colouredSections = value;

    if (!this.dartboard) {
      return;
    }

    this.dartboard.board.sectorColours = value;
    this.dartboard.render();
  }
  private _colouredSections!: { [key: string]: string };

  @Input() set colouredTriples(value: { [key: string]: string }) {
    this._colouredTriples = value;

    if (!this.dartboard) {
      return;
    }

    this.dartboard.board.tripleColours = value;
    this.dartboard.render();
  }
  private _colouredTriples!: { [key: string]: string };

  @Output() hit = new EventEmitter<Hit>();

  ngAfterViewInit(): void {
    this.dartboard = document.querySelector('dartbot-dartboard');
    if (this.dartboard == null) {
      throw new Error('Could not find dartboard element');
    }

    if (this._colouredSections) {
      this.dartboard.board.sectorColours = this._colouredSections;
      this.dartboard.render();
    }

    if (this._colouredTriples) {
      this.dartboard.board.tripleColours = this._colouredTriples;
      this.dartboard.render();
    }

    this.dartboard.addEventListener('dartboard-click', (event: any) => {
      this.handleHit(event);
    });

  }

  private handleHit(event: DartboardPointerEvent): void {
    const { detail, target } = event;
    const { polar, sector, ring } = detail;

    (target as any).hits = [...(target as any).hits, polar];

    const hit = new Hit(getSectorValue((target as any).board as any, sector), ring);
    this.hit.emit(hit);
  }
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

  constructor(number: number, ring: number) {
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

export enum DartCell {
  SingleInner = 2,
  SingleOuter = 4,
  Double = 5,
  Triple = 3,
  OuterBullsEye = 1,
  InnererBullsEye = 0,
}

export const DART_CELL_TEXT = {
  [DartCell.SingleInner]: 'single',
  [DartCell.SingleOuter]: 'single',
  [DartCell.Double]: 'double',
  [DartCell.Triple]: 'triple',
  [DartCell.OuterBullsEye]: 'outer bulls eye',
  [DartCell.InnererBullsEye]: 'inner bulls eye',
}

export const VERBOSE_DART_CELL_TEXT = {
  [DartCell.SingleInner]: 'single inner',
  [DartCell.SingleOuter]: 'single outer',
  [DartCell.Double]: 'double',
  [DartCell.Triple]: 'triple',
  [DartCell.OuterBullsEye]: 'outer bulls eye',
  [DartCell.InnererBullsEye]: 'inner bulls eye',
}