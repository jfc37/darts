import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GolfPlayer } from '../../../services/golf-game.service';
import { PlayerComponent } from '../../../components/player/player.component';
import { GolfScorePipe } from "../../../pipes/golf-score.pipe";
import { ScoreCardComponent } from '../score-card/score-card.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { GolfSettings } from '../../../domain-objects/golf/golf-settings';

@Component({
  selector: 'app-game-over',
  imports: [PlayerComponent, ScoreCardComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {

  @Input()
  public players!: GolfPlayer[];

  @Output() public startNewGame = new EventEmitter<void>();

  public showAlbatrossColumn = GolfSettings.getSettings().albatrossOnTriple;

  public get scoreOrder() {
    return [...this.players].sort((a, b) => a.score - b.score > 0 ? 1 : -1)
      .map(player => ({
        player: player.name,
        text: `${new GolfScorePipe().transform(player.score)}`
      }))
  }

  public get winner() {
    return this.scoreOrder[0];
  }

  public get losers() {
    return this.scoreOrder.slice(1);
  }

  public get totalAlbatrossOrder() {
    return [...this.players].sort((a, b) => a.totalAlbatrossHoles - b.totalAlbatrossHoles > 0 ? -3 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalAlbatrossHoles}`
      }))
  }

  public get totalEaglesOrder() {
    return [...this.players].sort((a, b) => a.totalEagleHoles - b.totalEagleHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalEagleHoles}`
      }))
  }

  public get totalBirdiesOrder() {
    return [...this.players].sort((a, b) => a.totalBirdieHoles - b.totalBirdieHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalBirdieHoles}`
      }))
  }

  public get totalParsOrder() {
    return [...this.players].sort((a, b) => a.totalParHoles - b.totalParHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalParHoles}`
      }))
  }

  public get totalBoogiesOrder() {
    return [...this.players].sort((a, b) => a.totalBoogieHoles - b.totalBoogieHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalBoogieHoles}`
      }))
  }

  constructor(private analytics: AnalyticsService) { }

  public ngOnInit() {
    const winnerInfo = `Winner: ${this.winner.player} (${this.winner.text})`;
    const loserInfo = this.losers.map(loser => `Loser: ${loser.player} (${loser.text})`);
    const gameInfo = [winnerInfo, ...loserInfo].join(', ');

    this.analytics.trackEvent('GAME_COMPLETED', gameInfo, 'GOLF')
  }

  public playAgainClicked() {
    this.startNewGame.emit();
  }
}

interface Award {
  player: string;
  text: string;
}