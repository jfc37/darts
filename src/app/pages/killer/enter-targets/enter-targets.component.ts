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
   * Event emitted when a target is marked
   */
  @Output() public markTarget = new EventEmitter<number>();

  public recordTarget(hit: Hit) {
    this.markTarget.emit(hit.number);
  }
}
