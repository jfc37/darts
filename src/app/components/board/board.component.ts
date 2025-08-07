import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import '../dart-board/dartbot-dartboard';
import { Dartboard, DartboardPointerEvent } from '../dart-board/Dartboard';
import { getSectorValue } from '../dart-board/draw-board/board';
import { Hit, HitPoint } from '../../domain-objects/hit';

export interface BoardSegmentText { [key: string]: { text: string, colour: string, shouldRotate: boolean }[] }

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

  @Input() set outerBullseyeColour(value: string | undefined) {
    this._outerBullseyeColour = value;

    if (!this.dartboard) {
      return;
    }

    this.dartboard.board.outerBullseyeColour = value;
    this.dartboard.render();
  }
  private _outerBullseyeColour!: string | undefined;

  @Input() set innerBullseyeColour(value: string | undefined) {
    this._innerBullseyeColour = value;

    if (!this.dartboard) {
      return;
    }

    this.dartboard.board.innerBullseyeColour = value;
    this.dartboard.render();
  }
  private _innerBullseyeColour!: string | undefined;

  @Input() set innerTexts(value: BoardSegmentText) {
    this._innerTexts = value;

    if (!this.dartboard) {
      return;
    }

    this.dartboard.board.innerText = value;
    this.dartboard.render();
  }
  private _innerTexts!: BoardSegmentText;

  @Input() set points(points: HitPoint[]) {
    if (!points) {
      points = [];
    }

    this._points = points;

    if (!this.dartboard) {
      return;
    }

    this.dartboard.hits = [...points];
    this.dartboard.render();
  }
  private _points: HitPoint[] = [];

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

    if (this._outerBullseyeColour) {
      this.dartboard.board.outerBullseyeColour = this._outerBullseyeColour;
      this.dartboard.render();
    }

    if (this._innerBullseyeColour) {
      this.dartboard.board.innerBullseyeColour = this._innerBullseyeColour;
      this.dartboard.render();
    }

    if (this._innerTexts) {
      this.dartboard.board.innerText = this._innerTexts;
      this.dartboard.render();
    }

    if (this._points) {
      this.dartboard.hits = [...this._points];
      this.dartboard.render();
    };

    this.dartboard.addEventListener('dartboard-click', (event: any) => {
      this.handleHit(event);
    });

  }

  private handleHit(event: DartboardPointerEvent): void {
    const { detail, target } = event;
    const { polar, sector, ring } = detail;

    (target as any).hits = [...(target as any).hits, polar];

    // inner bullseye
    if (ring == 0) {
      this.hit.emit(new Hit(50, 0, polar));
      return;
    }

    // outer bullseye
    if (ring == 1) {
      this.hit.emit(new Hit(25, 0, polar));
      return;
    }

    const hit = new Hit(getSectorValue((target as any).board as any, sector), ring, polar);
    this.hit.emit(hit);
  }
}