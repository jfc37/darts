import { Component } from '@angular/core';
import { KillerPracticeGame, KillerPracticeGameService } from './killer-practice-game.service';
import { CommonModule } from '@angular/common';
import { SelectPlayersComponent } from '../../components/select-players/select-players.component';
import { PlayRoundComponent } from "../../components/play-round/play-round.component";
import { GameOverComponent } from "../../components/game-over/game-over.component";
import { StatsComponent } from "../../components/stats/stats.component";
import { Hit } from '../../domain-objects/hit';

@Component({
  selector: 'app-killer-practice',
  imports: [CommonModule, SelectPlayersComponent, PlayRoundComponent, GameOverComponent, StatsComponent],
  templateUrl: './killer-practice.container.html',
  styleUrl: './killer-practice.container.scss'
})
export class KillerPracticeContainer {
  public game!: KillerPracticeGame;

  constructor(private gameService: KillerPracticeGameService) { }

  ngOnInit() {
    this.game = this.gameService.createGame();
  }

  public setPlayers(players: string[]) {
    this.game.setPlayers(players);
  }

  public handleHits(hits: Hit[]) {
    this.game.recordRound(hits);
  }

  public handleNewGame() {
    this.game = this.gameService.createGame();
  }
}
