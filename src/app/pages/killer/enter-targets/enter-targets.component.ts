import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BoardComponent, Hit } from "../../../components/board/board.component";
import { CommonModule } from '@angular/common';
import { TEAM_COLOURS } from '../../../services/killer-game.service';

@Component({
  selector: 'app-enter-targets',
  imports: [BoardComponent, CommonModule],
  templateUrl: './enter-targets.component.html',
  styleUrl: './enter-targets.component.scss'
})
export class EnterTargetsComponent {
  /**
   * Name of the team entering targets
   */
  @Input() public team!: string;

  @Input() public teamColour!: string;

  @Input() public player!: string;

  /**
   * Targets for each team
   */
  @Input() public teamTargets!: number[][];

  /**
   * Event emitted when a target is marked
   */
  @Output() public markTargets = new EventEmitter<number[]>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public get takenTargets(): number[] {
    return this.teamTargets.flat();
  }

  public recordedNumbers: number[] = [];

  public get colouredNumbers() {
    return {
      ...this.teamTargets[0].reduce((accum, target) => ({ ...accum, [target]: TEAM_COLOURS[0] }), {}),
      ...this.teamTargets[1].reduce((accum, target) => ({ ...accum, [target]: TEAM_COLOURS[1] }), {}),
      ...this.recordedNumbers.reduce((accum, target) => ({ ...accum, [target]: this.teamColour }), {}),
    }
  }

  public recordTarget(hit: Hit) {
    const isValidTarget = !hit.missed && !this.takenTargets.includes(hit.number) && !this.recordedNumbers.includes(hit.number)

    if (isValidTarget) {
      this.recordedNumbers.push(hit.number);

      if (this.recordedNumbers.length == 3) {
        this.dialog.nativeElement.showModal();
      }
    }
  }

  public resetTargets() {
    this.recordedNumbers = [];
  }

  public confirmTargets() {
    this.markTargets.emit(this.recordedNumbers);
    this.recordedNumbers = [];
  }
}
