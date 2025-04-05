import { Component } from '@angular/core';
import { TargetPracticeGame, TargetPracticeGameService } from '../../services/target-practice-game.service';
import { CommonModule } from '@angular/common';
import { SelectPlayersComponent } from '../../components/select-players/select-players.component';
import { PlayTargetPracticeComponent } from "./play-target-practice/play-target-practice.component";
import { Hit } from '../../components/board/board.component';
import { GameOverComponent } from "./game-over/game-over.component";

@Component({
  selector: 'app-target-practice',
  imports: [CommonModule, SelectPlayersComponent, PlayTargetPracticeComponent, GameOverComponent],
  templateUrl: './target-practice.container.html',
  styleUrl: './target-practice.container.scss'
})
export class TargetPracticeContainer {
  public game!: TargetPracticeGame;

  constructor(private gameService: TargetPracticeGameService) { }

  ngOnInit() {
    this.game = this.gameService.createGame();

    // this.game.setPlayers(['img/joe.jpg', 'img/andy.jpg']);

    // this.game.recordRound([Hit.Double(1), Hit.Double(1), Hit.Double(1)]);
    // this.game.recordRound([Hit.Single(1), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(2), Hit.Double(2), Hit.Double(2)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(3), Hit.Double(3), Hit.Double(3)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(4), Hit.Double(4), Hit.Double(4)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(5), Hit.Double(5), Hit.Double(5)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(6), Hit.Double(6), Hit.Double(2)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(7), Hit.Double(7), Hit.Double(7)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(8), Hit.Double(8), Hit.Double(8)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(9), Hit.Double(9), Hit.Double(9)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(10), Hit.Double(10), Hit.Double(10)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(11), Hit.Double(11), Hit.Double(11)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(12), Hit.Double(12), Hit.Double(12)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(13), Hit.Double(13), Hit.Double(13)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(14), Hit.Double(14), Hit.Double(14)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(15), Hit.Double(15), Hit.Double(15)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(16), Hit.Double(16), Hit.Double(16)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(17), Hit.Double(17), Hit.Double(17)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(18), Hit.Double(18), Hit.Double(18)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(18), Hit.Double(18), Hit.Double(18)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordRound([Hit.Double(18), Hit.Double(18), Hit.Double(18)]);
    // this.game.recordRound([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);
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
