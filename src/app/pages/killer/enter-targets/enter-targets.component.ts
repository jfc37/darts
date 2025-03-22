import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardComponent, Hit } from "../../../components/board/board.component";

@Component({
  selector: 'app-enter-targets',
  imports: [BoardComponent],
  templateUrl: './enter-targets.component.html',
  styleUrl: './enter-targets.component.scss'
})
export class EnterTargetsComponent {
  /**
   * Name of the team entering targets
   */
  @Input() public team!: string;

  /**
   * Targets for each team
   */
  @Input() public teamTargets!: number[][];

  /**
   * Event emitted when a target is marked
   */
  @Output() public markTarget = new EventEmitter<number>();

  public get takenTargets(): number[] {
    return this.teamTargets.flat();
  }

  public recordTarget(hit: Hit) {
    this.markTarget.emit(hit.number);
  }
}
