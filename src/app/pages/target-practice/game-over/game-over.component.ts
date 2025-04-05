import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerComponent } from "../../../components/player/player.component";
import { Player } from '../../../services/target-practice-game.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { TargetPracticeScoreCardComponent } from "../target-practice-score-card/target-practice-score-card.component";

@Component({
  selector: 'app-game-over',
  imports: [PlayerComponent, TargetPracticeScoreCardComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {

  @Input()
  public players!: Player[];

  @Output() public startNewGame = new EventEmitter<void>();

  public get scoreOrder() {
    return [...this.players].sort((a, b) => a.totalMakes - b.totalMakes > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: player.score
      }))
  }

  public get winner() {
    return this.scoreOrder[0];
  }

  public get losers() {
    return this.scoreOrder.slice(1);
  }

  constructor(private analytics: AnalyticsService) { }

  public ngOnInit() {
    const winnerInfo = `Winner: ${this.winner.player} (${this.winner.text})`;
    const loserInfo = this.losers.map(loser => `Loser: ${loser.player} (${loser.text})`);
    const gameInfo = [winnerInfo, ...loserInfo].join(', ');

    this.analytics.trackEvent('GAME_COMPLETED', gameInfo, 'TARGET_PRACTICE');
  }

  public playAgainClicked() {
    this.startNewGame.emit();
  }
}
