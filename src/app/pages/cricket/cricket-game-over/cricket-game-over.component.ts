import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerComponent } from '../../../components/player/player.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { Target, Team } from '../cricket-game.service';

@Component({
  selector: 'app-cricket-game-over',
  imports: [PlayerComponent],
  templateUrl: './cricket-game-over.component.html',
  styleUrl: './cricket-game-over.component.scss'
})
export class CricketGameOverComponent {
  @Input() public teamOne!: Team;
  @Input() public teamTwo!: Team;
  @Input() public targets!: Target[];

  public winningTeam!: Team;
  public losingTeam!: Team;
  public winningScore!: number;
  public losingScore!: number;

  @Output() public startNewGame = new EventEmitter<void>();

  public get unorderedPlayerStats() {
    return [
      this.winningTeam?.firstThrowerStats,
      this.winningTeam?.secondThrowerStats,
      this.losingTeam?.firstThrowerStats,
      this.losingTeam?.secondThrowerStats
    ];
  }

  constructor(private analytics: AnalyticsService) { }

  public ngOnInit() {
    const team1Score = this.targets.reduce((acc, target) => acc + target.pointsForTeamOne, 0);
    const team2Score = this.targets.reduce((acc, target) => acc + target.pointsForTeamTwo, 0);
    if (team1Score > team2Score) {
      this.winningTeam = this.teamOne;
      this.losingTeam = this.teamTwo;
      this.winningScore = team1Score;
      this.losingScore = team2Score;
    } else {
      this.winningTeam = this.teamTwo;
      this.losingTeam = this.teamOne;
      this.winningScore = team2Score;
      this.losingScore = team1Score;
    }
    const winnerInfo = `Winners: ${this.winningTeam.firstThrower}/${this.winningTeam.secondThrower}`;
    const loserInfo = `Losers: ${this.losingTeam.firstThrower}/${this.losingTeam.secondThrower}`;
    const gameInfo = [winnerInfo, loserInfo].join(', ');

    this.analytics.trackEvent('GAME_COMPLETED', gameInfo, 'CRICKET')
  }

  public get pointsOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.points - b.points > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.points}`
      }))
  }

  public get openersOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.openers - b.openers > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.openers}`
      }))
  }

  public get closersOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.closers - b.closers > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.closers}`
      }))
  }

  public get pointlessTurnsOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.pointlessTurns - b.pointlessTurns > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.pointlessTurns}`
      }))
  }

  public playAgainClicked() {
    this.startNewGame.emit();
  }
}

interface Award {
  player: string;
  text: string;
}
