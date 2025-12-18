import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BoardComponent } from '../../../components/board/board.component';
import { PlayerComponent } from '../../../components/player/player.component';
import { Hit } from '../../../domain-objects/hit';
import { OhOnePlayer } from '../../../domain-objects/oh-one/oh-one-player';
import { OhOneSettings } from '../../../domain-objects/oh-one/oh-one-settings';

@Component({
  selector: 'app-play-oh-one',
  imports: [PlayerComponent, BoardComponent],
  templateUrl: './play-oh-one.component.html',
  styleUrl: './play-oh-one.component.scss'
})
export class PlayOhOneComponent {
  @Input()
  public players!: OhOnePlayer[];

  @Input()
  public canUndo: boolean = false;

  @Output() public hits = new EventEmitter<Hit[]>();
  @Output() public undo = new EventEmitter<void>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public get workingPoints() {
    return this.players.find(x => x.isActive)!.points - this.recordedHits.reduce((total, hit) => total + hit.value, 0);
  }

  public get colouredSingles() {
    if (!OhOneSettings.getSettings().canExitOnASingle) {
      return DartNumbers.filter(x => x > this.workingPoints).reduce((accum, num) => ({ ...accum, [num]: BUST_NUMBER_COLOUR }), {});
    }

    return {
      ...DartNumbers.filter(x => x > this.workingPoints).reduce((accum, num) => ({ ...accum, [num]: BUST_NUMBER_COLOUR }), {}),
      ...{ [this.workingPoints]: EXIT_NUMBER_COLOUR }
    };
  }

  public get colouredDoubles() {
    if (!OhOneSettings.getSettings().canExitOnADouble) {
      return DartNumbers.filter(x => x > this.workingPoints * 2).reduce((accum, num) => ({ ...accum, [num]: BUST_NUMBER_COLOUR }), {});
    }

    return {
      ...DartNumbers.filter(x => x > this.workingPoints / 2).reduce((accum, num) => ({ ...accum, [num]: BUST_NUMBER_COLOUR }), {}),
      ...{ [this.workingPoints / 2]: EXIT_NUMBER_COLOUR }
    };
  }

  public get colouredTriples() {
    if (!OhOneSettings.getSettings().canExitOnATriple) {
      return DartNumbers.filter(x => x > this.workingPoints * 3).reduce((accum, num) => ({ ...accum, [num]: BUST_NUMBER_COLOUR }), {});
    }

    return {
      ...DartNumbers.filter(x => x > this.workingPoints / 3).reduce((accum, num) => ({ ...accum, [num]: BUST_NUMBER_COLOUR }), {}),
      ...{ [this.workingPoints / 3]: EXIT_NUMBER_COLOUR }
    };
  }

  public recordedHits: Hit[] = [];
  public get numbersHitThisTurn() {
    return this.recordedHits.map(x => x.toVerboseDisplayText()).join(', ')
  }

  public recordHit(hit: Hit) {
    this.recordedHits.push(hit);

    const pointTarget = this.players.find(x => x.isActive)!.points;
    const currentScore = this.recordedHits.reduce((totalScore, hit) => totalScore + hit.value, 0);
    if (currentScore >= pointTarget) {
      this.dialog.nativeElement.showModal();
      return;
    }

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

export const EXIT_NUMBER_COLOUR = '#1BFC06';
export const BUST_NUMBER_COLOUR = '#FF991C';

const DartNumbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];