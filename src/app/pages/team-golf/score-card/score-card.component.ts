import { Component, Input } from '@angular/core';
import { GolfScorePipe } from "../../../pipes/golf-score.pipe";
import { PlayerComponent } from "../../../components/player/player.component";
import { GolfTeam } from '../../../domain-objects/golf/golf-team';

@Component({
  selector: 'app-score-card',
  imports: [GolfScorePipe, PlayerComponent],
  templateUrl: './score-card.component.html',
  styleUrl: './score-card.component.scss'
})
export class ScoreCardComponent {
  @Input()
  public teams!: GolfTeam[];

  public get holes(): number[] {
    const totalHoles = this.teams[this.teams.length - 1].currentHole;
    const array = Array.from({ length: totalHoles }, (_, i) => i + 1);
    return array;
  }

  public get hasCompletedAHole(): boolean {
    return this.holes.length > 0;
  }
}
