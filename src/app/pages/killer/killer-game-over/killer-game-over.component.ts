import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KillerTeam, PlayerStats } from '../../../services/killer-game.service';

@Component({
  selector: 'app-killer-game-over',
  imports: [],
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
    return [...this.unorderedPlayerStats].sort((a, b) => a.attackingPoints + b.attackingPoints)
      .map(player => ({
        player: player.player,
        text: `${player.attackingPoints}`
      }))
  }

  public get defendingOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.defendingPoints + b.defendingPoints)
      .map(player => ({
        player: player.player,
        text: `${player.defendingPoints}`
      }))
  }

  public get omOmOmOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.omOmOms + b.omOmOms)
      .map(player => ({
        player: player.player,
        text: `${player.omOmOms}`
      }))
  }

  public get pointlessOrder() {
    return [...this.unorderedPlayerStats].sort((a, b) => a.pointlessTurns + b.pointlessTurns)
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
