import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerComponent } from '../../../components/player/player.component';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { GolfScorePipe } from '../../../pipes/golf-score.pipe';
import { AnalyticsService } from '../../../services/analytics.service';
import { GolfStatsComponent } from "../../../components/golf-stats/golf-stats.component";
import { GolfTeam } from '../../../domain-objects/golf/golf-team';

@Component({
  selector: 'app-game-over',
  imports: [PlayerComponent, ScoreCardComponent, GolfStatsComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {

  @Input()
  public teams!: GolfTeam[];

  public get players() {
    return [
      this.teams[0].firstThrower,
      this.teams[0].secondThrower,
      this.teams[1].firstThrower,
      this.teams[1].secondThrower
    ];
  }

  @Output() public startNewGame = new EventEmitter<void>();

  public get scoreOrder() {
    return [...this.teams].sort((a, b) => a.score - b.score > 0 ? 1 : -1)
      .map(team => ({
        firstPlayer: team.firstThrower.name,
        secondPlayer: team.secondThrower.name,
        text: `${new GolfScorePipe().transform(team.score)}`
      }))
  }

  public get winners() {
    return this.scoreOrder[0];
  }

  public get losers() {
    return this.scoreOrder[1];
  }

  constructor(private analytics: AnalyticsService) { }

  public ngOnInit() {
    const winnerInfo = `Winner: ${this.winners.firstPlayer} (${this.winners.text})`;
    const loserInfo = `Loser: ${this.losers.firstPlayer} (${this.losers.text})`;
    const gameInfo = [winnerInfo, ...loserInfo].join(', ');

    this.analytics.trackEvent('GAME_COMPLETED', gameInfo, 'TEAM GOLF')
  }

  public playAgainClicked() {
    this.startNewGame.emit();
  }
}

interface Award {
  firstPlayer: string;
  secondPlayer: string;
  player: string;
  text: string;
}