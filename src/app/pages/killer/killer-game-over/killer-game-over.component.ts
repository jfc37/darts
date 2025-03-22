import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-killer-game-over',
  imports: [],
  templateUrl: './killer-game-over.component.html',
  styleUrl: './killer-game-over.component.scss'
})
export class KillerGameOverComponent {
  /**
   * Name of the winning team
  */
  @Input() public winningTeam!: string;

  @Output() public startNewGame = new EventEmitter<void>();

  public playAgainClicked() {
    this.startNewGame.emit();
  }
}
