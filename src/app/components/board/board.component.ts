import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import '../dart-board/dartbot-dartboard';
import { Dartboard, DartboardPointerEvent } from '../dart-board/Dartboard';
import { getSectorValue } from '../dart-board/draw-board/board';
import { Hit, HitPoint } from '../../domain-objects/hit';

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

    const hit = new Hit(getSectorValue((target as any).board as any, sector), ring, polar);
    this.hit.emit(hit);
  }
}