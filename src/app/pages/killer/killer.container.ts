import { Component } from '@angular/core';
import { KillerGame, KillerGameService } from '../../services/killer-game.service';
import { EnterTargetsComponent } from "./enter-targets/enter-targets.component";
import { CommonModule } from '@angular/common';
import { PlayKillerComponent } from "./play-killer/play-killer.component";
import { KillerGameOverComponent } from "./killer-game-over/killer-game-over.component";
import { Hit } from '../../domain-objects/hit';
import { TeamSelectionComponent } from '../../components/team-selection/team-selection.component';

@Component({
  selector: 'app-killer',
  imports: [CommonModule, TeamSelectionComponent, EnterTargetsComponent, PlayKillerComponent, KillerGameOverComponent],
  providers: [KillerGameService],
  templateUrl: './killer.container.html',
  styleUrl: './killer.container.scss'
})
export class KillerContainer {
  public game!: KillerGame;

  constructor(private killerGameService: KillerGameService) { }

  public ngOnInit() {
    this.game = this.killerGameService.createGame();
    // this.game.setPlayers(["img/joe.jpg",
    //   "img/andy.jpg",
    //   "img/chris.jpg",
    //   "img/rich.jpg"]);

    // this.game.setTargets([20, 5, 12]);
    // this.game.setTargets([1, 18, 4]);
    // this.game.setTargets([9, 14, 11]);
    // this.game.setTargets([13, 6, 10]);

    // this.game.hit([Hit.Triple(1), Hit.Single(4), Hit.Single(20)]);

    // this.game.hit([Hit.Triple(1), Hit.Triple(1), Hit.Triple(4)]);

    // this.game.hit([Hit.Triple(1), Hit.Triple(1), Hit.Triple(4)]);

    // this.game.hit([Hit.Triple(1), Hit.Triple(1), Hit.Triple(4)]);

    // this.game.hit([Hit.Triple(18), Hit.Triple(18), Hit.Triple(4)]);

    // this.game.hit([Hit.Triple(15), Hit.Triple(15), Hit.Triple(15)]);

    // this.game.hit([Hit.Triple(13), Hit.Triple(13), Hit.Triple(6)]);

    // this.game.hit([Hit.Triple(15), Hit.Triple(15), Hit.Triple(15)]);

    // this.game.hit([Hit.Triple(6), Hit.Triple(6), Hit.Triple(10)]);

    // this.game.hit([Hit.Triple(15), Hit.Triple(15), Hit.Triple(15)]);

    // this.game.hit([Hit.Triple(10), Hit.Triple(10), Hit.Triple(10)]);

    // this.game.hit([Hit.Triple(15), Hit.Triple(15), Hit.Triple(15)]);

    // this.game.hit([Hit.Triple(4), Hit.Triple(15), Hit.Triple(15)]);
  }

  public switchTeamColours() {
    this.game.switchTeamColours();
  }

  public setPlayers(players: string[]) {
    this.game.setPlayers(players);
  }

  public setTargets(targets: number[]) {
    this.game.setTargets(targets);
  }


  public handleHits(hits: Hit[]) {
    this.game.hit(hits);
  }

  public handleUndo() {
    this.game.undoLastTurn();
  }

  public handleNewGame() {
    this.game = this.killerGameService.createGame();
  }
}
