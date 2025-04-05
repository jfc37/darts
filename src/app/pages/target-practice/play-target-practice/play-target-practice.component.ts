import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Player } from '../../../services/target-practice-game.service';
import { Hit, BoardComponent } from '../../../components/board/board.component';
import { PlayerComponent } from "../../../components/player/player.component";
import { TargetPracticeScoreCardComponent } from "../target-practice-score-card/target-practice-score-card.component";

@Component({
  selector: 'app-play-target-practice',
  imports: [PlayerComponent, BoardComponent, TargetPracticeScoreCardComponent],
  templateUrl: './play-target-practice.component.html',
  styleUrl: './play-target-practice.component.scss'
})
export class PlayTargetPracticeComponent {
  @Input()
  public players!: Player[];

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
    return this.recordedHits.map(x => x.number).join(', ')
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