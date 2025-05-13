import { Component, Input } from '@angular/core';
import { Player } from '../../../services/target-practice-game.service';
import { PlayerComponent } from '../../../components/player/player.component';

@Component({
  selector: 'app-target-practice-score-card',
  imports: [PlayerComponent],
  templateUrl: './target-practice-score-card.component.html',
  styleUrl: './target-practice-score-card.component.scss'
})
export class TargetPracticeScoreCardComponent {
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
