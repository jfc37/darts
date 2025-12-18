import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BoardComponent } from '../../../components/board/board.component';
import { PlayerComponent } from '../../../components/player/player.component';
import { GolfScorePipe } from '../../../pipes/golf-score.pipe';
import { ScoreCardComponent } from "../score-card/score-card.component";
import { Hit } from '../../../domain-objects/hit';
import { GolfTeam } from '../../../domain-objects/golf/golf-team';

@Component({
  selector: 'app-play-team-golf',
  imports: [PlayerComponent, BoardComponent, GolfScorePipe, ScoreCardComponent],
  templateUrl: './play-team-golf.component.html',
  styleUrl: './play-team-golf.component.scss'
})
export class PlayTeamGolfComponent {
  @Input()
  public teams!: GolfTeam[];

  @Input() hole!: number;

  @Input() canUndo: boolean = false;

  @Output() public hits = new EventEmitter<Hit[]>();
  @Output() public undo = new EventEmitter<void>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public get colouredNumbers() {
    return {
      [this.hole]: ACTIVE_NUMBER_COLOUR
    }
  }

  public recordedHits: Hit[] = [];
  public get numbersHitThisTurn() {
    return this.recordedHits.map(x => x.toVerboseDisplayText()).join(', ')
  }

  public recordHit(hit: Hit) {
    this.recordedHits.push(hit);

    if (this.recordedHits.length === 3) {
      this.dialog.nativeElement.showModal();
    }
  }

  public resetTargets() {
    this.recordedHits = [];
  }

  public confirmTargets() {
    this.hits.emit(this.recordedHits);
    this.recordedHits = [];
  }

  public undoTurn() {
    this.recordedHits = [];
    this.undo.emit();
  }
}

export const ACTIVE_NUMBER_COLOUR = 'blue';