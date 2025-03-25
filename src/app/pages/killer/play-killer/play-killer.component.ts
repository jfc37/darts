import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BoardComponent, Hit } from "../../../components/board/board.component";
import { KillerTarget } from '../../../services/killer-game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play-killer',
  imports: [BoardComponent, CommonModule],
  templateUrl: './play-killer.component.html',
  styleUrl: './play-killer.component.scss'
})
export class PlayKillerComponent {
  /**
   * Name of the team entering targets
   */
  @Input() public team!: string;

  @Input() public player!: string;

  @Input() public teamTargets!: KillerTarget[];
  @Input() public opponentTargets!: KillerTarget[];

  public recordedHits: Hit[] = [];

  public get numbersHitThisTurn() {
    return this.recordedHits.map(x => x.number == 0 ? 'miss' : x.number).join(', ')
  }

  @Output() public hits = new EventEmitter<Hit[]>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public get colouredNumbers() {
    return {
      ...this.teamTargets.reduce((accum, target) => ({ ...accum, [target.target]: target.colour }), {}),
      ...this.opponentTargets.reduce((accum, target) => ({ ...accum, [target.target]: target.colour }), {}),
    }
  }

  public get healthColours() {
    const allTargets = [...this.teamTargets, ...this.opponentTargets];
    return {
      ...allTargets.reduce((accum, target) => ({ ...accum, [target.target]: TARGET_HEALTH_COLOURS[target.health] }), {}),
    }
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

export const TARGET_HEALTH_COLOURS = [
  'black',
  'red',
  'orange',
  'green'
]