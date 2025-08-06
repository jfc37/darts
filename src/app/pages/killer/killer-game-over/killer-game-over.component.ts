import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KillerTeam, PlayerStats } from '../../../services/killer-game.service';
import { PlayerComponent } from '../../../components/player/player.component';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'app-killer-game-over',
  imports: [PlayerComponent],
  templateUrl: './killer-game-over.component.html',
  styleUrl: './killer-game-over.component.scss'
})
export class KillerGameOverComponent {
  @Input() public winningTeam!: KillerTeam;
  @Input() public losingTeam!: KillerTeam;

  @Output() public startNewGame = new EventEmitter<void>();

  public get unorderedPlayerStats() {
    return [
      this.winningTeam?.firstThrowerStats,
      this.winningTeam?.secondThrowerStats,
      this.losingTeam?.firstThrowerStats,
      this.losingTeam?.secondThrowerStats
    ];
  }

  public get attackingOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.attackingPoints - b.attackingPoints > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.attackingPoints}`
      }))
  }

  public get defendingOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.defendingPoints - b.defendingPoints > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.defendingPoints}`
      }))
  }

  public get omOmOmOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.omOmOms - b.omOmOms > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.omOmOms}`
      }))
  }

  public get pointlessOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.pointlessTurns - b.pointlessTurns > 0 ? -1 : 1)
      .map(player => ({
        player: player.player,
        text: `${player.pointlessTurns}`
      }))
  }

  public get totalPointsOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.totalPoints - a.totalPoints)
      .map(player => ({
        player: player.player,
        text: `${player.totalPoints}`
      }));
  }

  public get classicOmOmOmsOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.classicOmOmOms - a.classicOmOmOms)
      .map(player => ({
        player: player.player,
        text: `${player.classicOmOmOms}`
      }));
  }

  public get killsOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.kills - a.kills)
      .map(player => ({
        player: player.player,
        text: `${player.kills}`
      }));
  }

  public get greenToDeadOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.greenToDead - a.greenToDead)
      .map(player => ({
        player: player.player,
        text: `${player.greenToDead}`
      }));
  }

  public get orangeToDeadOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.orangeToDead - a.orangeToDead)
      .map(player => ({
        player: player.player,
        text: `${player.orangeToDead}`
      }));
  }

  public get redToDeadOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.redToDead - a.redToDead)
      .map(player => ({
        player: player.player,
        text: `${player.redToDead}`
      }));
  }

  public get orangeToRedOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.orangeToRed - a.orangeToRed)
      .map(player => ({
        player: player.player,
        text: `${player.orangeToRed}`
      }));
  }

  public get greenToRedOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.greenToRed - a.greenToRed)
      .map(player => ({
        player: player.player,
        text: `${player.greenToRed}`
      }));
  }

  public get greenToOrangeOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.greenToOrange - a.greenToOrange)
      .map(player => ({
        player: player.player,
        text: `${player.greenToOrange}`
      }));
  }

  public get redToGreenOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.redToGreen - a.redToGreen)
      .map(player => ({
        player: player.player,
        text: `${player.redToGreen}`
      }));
  }

  public get redToOrangeOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.redToOrange - a.redToOrange)
      .map(player => ({
        player: player.player,
        text: `${player.redToOrange}`
      }));
  }

  public get orangeToGreenOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => b.orangeToGreen - a.orangeToGreen)
      .map(player => ({
        player: player.player,
        text: `${player.orangeToGreen}`
      }));
  }

  public get pointsPerTurnOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => parseFloat(b.pointsPerTurn) - parseFloat(a.pointsPerTurn))
      .map(player => ({
        player: player.player,
        text: `${player.pointsPerTurn}`
      }));
  }

  public get pointsPerThrowOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => parseFloat(b.pointsPerThrow) - parseFloat(a.pointsPerThrow))
      .map(player => ({
        player: player.player,
        text: `${player.pointsPerThrow}`
      }));
  }


  constructor(private analytics: AnalyticsService) { }

  public ngOnInit() {
    const winnerInfo = `Winners: ${this.winningTeam.firstThrower}/${this.winningTeam.secondThrower}`;
    const loserInfo = `Losers: ${this.losingTeam.firstThrower}/${this.losingTeam.secondThrower}`;
    const gameInfo = [winnerInfo, loserInfo].join(', ');

    this.analytics.trackEvent('GAME_COMPLETED', gameInfo, 'KILLER')
  }

  public playAgainClicked() {
    this.startNewGame.emit();
  }
}

interface Award {
  player: string;
  text: string;
}
