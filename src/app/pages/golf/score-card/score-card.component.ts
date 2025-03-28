import { Component, Input } from '@angular/core';
import { GolfPlayer } from '../../../services/golf-game.service';
import { PlayerComponent } from "../../../components/player/player.component";
import { GolfScorePipe } from '../../../pipes/golf-score.pipe';

@Component({
  selector: 'app-score-card',
  imports: [PlayerComponent, GolfScorePipe],
  templateUrl: './score-card.component.html',
  styleUrl: './score-card.component.scss'
})
export class ScoreCardComponent {
  @Input()
  public players!: GolfPlayer[];

  public get holes(): number[] {
    const totalHoles = this.players[this.players.length - 1].rounds.length;
    const array = Array.from({ length: totalHoles }, (_, i) => i + 1);
    return array;
  }

  public get hasCompletedAHole(): boolean {
    return this.holes.length > 0;
  }
}
