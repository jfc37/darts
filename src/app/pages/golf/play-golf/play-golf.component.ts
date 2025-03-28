import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GolfPlayer } from '../../../services/golf-game.service';
import { BoardComponent, Hit } from '../../../components/board/board.component';
import { PlayerComponent } from '../../../components/player/player.component';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { GolfScorePipe } from '../../../pipes/golf-score.pipe';

@Component({
  selector: 'app-play-golf',
  imports: [PlayerComponent, BoardComponent, ScoreCardComponent, GolfScorePipe],
  templateUrl: './play-golf.component.html',
  styleUrl: './play-golf.component.scss'
})
export class PlayGolfComponent {
  @Input()
  public players!: GolfPlayer[];

  @Input() round!: number;

  @Output() public hits = new EventEmitter<Hit[]>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public get colouredNumbers() {
    return {
      [this.round]: ACTIVE_NUMBER_COLOUR
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
}

export const ACTIVE_NUMBER_COLOUR = 'blue';