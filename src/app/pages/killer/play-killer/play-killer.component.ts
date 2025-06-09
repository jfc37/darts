import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BoardComponent } from "../../../components/board/board.component";
import { KillerTarget } from '../../../services/killer-game.service';
import { CommonModule } from '@angular/common';
import { Hit } from '../../../domain-objects/hit';

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

  @Input() public teamColour!: string;

  @Input() public player!: string;

  @Input() public teamTargets!: KillerTarget[];
  @Input() public opponentTargets!: KillerTarget[];

  public recordedHits: Hit[] = [];

  public get numbersHitThisTurn() {
    return this.recordedHits.map(x => x.toDisplayText()).join(', ');
  }

  @Output() public hits = new EventEmitter<Hit[]>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public get colouredNumbers() {
    return {
      ...GREY_ENTIRE_BOARD,
      ...this.teamTargets.filter(x => x.health > 0).reduce((accum, target) => ({ ...accum, [target.target]: target.colour }), {}),
      ...this.opponentTargets.filter(x => x.health > 0).reduce((accum, target) => ({ ...accum, [target.target]: target.colour }), {}),
    }
  }

  public get healthColours() {
    const allTargets = [...this.teamTargets, ...this.opponentTargets];
    return {
      ...GREY_ENTIRE_BOARD,
      ...allTargets.filter(x => x.health > 0).reduce((accum, target) => ({ ...accum, [target.target]: TARGET_HEALTH_COLOURS[target.health] }), {}),
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
  '#F72F35',
  '#FF991C',
  '#1BFC06'
]

const GREY_ENTIRE_BOARD = {
  '1': '#d3d3d3',
  '2': '#d3d3d3',
  '3': '#d3d3d3',
  '4': '#d3d3d3',
  '5': '#d3d3d3',
  '6': '#d3d3d3',
  '7': '#d3d3d3',
  '8': '#d3d3d3',
  '9': '#d3d3d3',
  '10': '#d3d3d3',
  '11': '#d3d3d3',
  '12': '#d3d3d3',
  '13': '#d3d3d3',
  '14': '#d3d3d3',
  '15': '#d3d3d3',
  '16': '#d3d3d3',
  '17': '#d3d3d3',
  '18': '#d3d3d3',
  '19': '#d3d3d3',
  '20': '#d3d3d3',
}