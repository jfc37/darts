import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerComponent } from '../../../components/player/player.component';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { GolfTeam } from '../../../services/team-golf-game.service';
import { GolfScorePipe } from '../../../pipes/golf-score.pipe';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'app-game-over',
  imports: [PlayerComponent, ScoreCardComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {

  @Input()
  public teams!: GolfTeam[];

  @Output() public startNewGame = new EventEmitter<void>();

  public get scoreOrder() {
    return [...this.teams].sort((a, b) => a.score - b.score > 0 ? 1 : -1)
      .map(team => ({
        firstPlayer: team.firstThrower,
        secondPlayer: team.secondThrower,
        text: `${new GolfScorePipe().transform(team.score)}`
      }))
  }

  public get winners() {
    return this.scoreOrder[0];
  }

  public get losers() {
    return this.scoreOrder[1];
  }

  private get playerStats() {
    return [
      this.teams[0].firstThrowerStats,
      this.teams[0].secondThrowerStats,
      this.teams[1].firstThrowerStats,
      this.teams[1].secondThrowerStats
    ];
  }

  public get totalEaglesOrder() {
    return [...this.playerStats].sort((a, b) => a.eagles - b.eagles > 0 ? -1 : 1)
      .map(x => ({
        player: x.player,
        text: `${x.eagles}`
      }))
  }

  public get totalBirdiesOrder() {
    return [...this.playerStats].sort((a, b) => a.birdies - b.birdies > 0 ? -1 : 1)
      .map(x => ({
        player: x.player,
        text: `${x.birdies}`
      }))
  }

  public get totalParsOrder() {
    return [...this.playerStats].sort((a, b) => a.pars - b.pars > 0 ? -1 : 1)
      .map(x => ({
        player: x.player,
        text: `${x.pars}`
      }))
  }

  public get totalBoogiesOrder() {
    return [...this.playerStats].sort((a, b) => a.boogies - b.boogies > 0 ? -1 : 1)
      .map(x => ({
        player: x.player,
        text: `${x.boogies}`
      }))
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