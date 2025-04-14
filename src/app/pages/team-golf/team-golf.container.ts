import { Component } from '@angular/core';
import { TeamGolfGame, TeamGolfGameService } from '../../services/team-golf-game.service';
import { CommonModule } from '@angular/common';
import { TeamSelectionComponent } from '../killer/team-selection/team-selection.component';
import { PlayTeamGolfComponent } from "./play-team-golf/play-team-golf.component";
import { Hit } from '../../components/board/board.component';
import { GameOverComponent } from "./game-over/game-over.component";

@Component({
  selector: 'app-team-golf',
  imports: [CommonModule, TeamSelectionComponent, PlayTeamGolfComponent, GameOverComponent],
  templateUrl: './team-golf.container.html',
  styleUrl: './team-golf.container.scss'
})
export class TeamGolfContainer {
  public game!: TeamGolfGame;

  constructor(private golfGameService: TeamGolfGameService) { }

  public ngOnInit() {
    this.game = this.golfGameService.createGame();
    // this.game.setPlayers(["img/joe.jpg",
    //   "img/andy.jpg",
    //   "img/chris.jpg",
    //   "img/rich.jpg"]);

    // this.game.recordHole([Hit.Double(1), Hit.Double(1), Hit.Double(1)]);
    // this.game.recordHole([Hit.Single(1), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(2), Hit.Double(2), Hit.Double(2)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(3), Hit.Double(3), Hit.Double(3)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(4), Hit.Double(4), Hit.Double(4)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(5), Hit.Double(5), Hit.Double(5)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(6), Hit.Double(6), Hit.Double(2)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(7), Hit.Double(7), Hit.Double(7)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(8), Hit.Double(8), Hit.Double(8)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(9), Hit.Double(9), Hit.Double(9)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(10), Hit.Double(10), Hit.Double(10)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(11), Hit.Double(11), Hit.Double(11)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(12), Hit.Double(12), Hit.Double(12)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(13), Hit.Double(13), Hit.Double(13)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(14), Hit.Double(14), Hit.Double(14)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(15), Hit.Double(15), Hit.Double(15)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(16), Hit.Double(16), Hit.Double(16)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(17), Hit.Double(17), Hit.Double(17)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);

    // this.game.recordHole([Hit.Double(18), Hit.Double(18), Hit.Double(18)]);
    // this.game.recordHole([Hit.Double(20), Hit.Double(20), Hit.Double(20)]);
  }

  public setPlayers(players: string[]) {
    this.game.setPlayers(players);
  }

  public handleHits(hits: Hit[]) {
    this.game.recordHole(hits);
  }

  public handleNewGame() {
    this.game = this.golfGameService.createGame();
  }
}
