import { Component, Input } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { Player } from '../../domain-objects/player';

@Component({
  selector: 'app-standard-score-card',
  imports: [PlayerComponent],
  templateUrl: './standard-score-card.component.html',
  styleUrl: './standard-score-card.component.scss'
})
export class StandardScoreCardComponent {
  @Input()
  public players!: Player[];

  public get holes(): number[] {
    return this.players[this.players.length - 1].rounds.map(x => x.hole)
      .sort((a, b) => a < b ? -1 : 1);
  }

  public get hasCompletedAHole(): boolean {
    return this.holes.length > 0;
  }
}
