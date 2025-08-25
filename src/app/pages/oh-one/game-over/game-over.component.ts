import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerComponent } from '../../../components/player/player.component';
import { OhOnePlayer } from '../../../domain-objects/oh-one/oh-one-player';

@Component({
  selector: 'app-game-over',
  imports: [PlayerComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {

  @Input()
  public players!: OhOnePlayer[];

  @Output() public startNewGame = new EventEmitter<void>();

  public get scoreOrder() {
    return [...this.players].sort((a, b) => a.points - b.points < 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: player.points.toString()
      }))
  }

  public get winner() {
    return this.scoreOrder[0];
  }

  public get losers() {
    return this.scoreOrder.slice(1);
  }

  public playAgainClicked() {
    this.startNewGame.emit();
  }
}
