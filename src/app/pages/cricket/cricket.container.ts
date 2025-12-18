import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayCricketComponent } from "./play-cricket/play-cricket.component";
import { Hit } from '../../domain-objects/hit';
import { CricketGame, CricketGameService, CricketSettings } from './cricket-game.service';
import { CricketGameOverComponent } from './cricket-game-over/cricket-game-over.component';
import { CricketSettingsComponent } from './cricket-settings/cricket-settings.component';
import { TeamSelectionComponent } from '../../components/team-selection/team-selection.component';

@Component({
  selector: 'app-cricket',
  imports: [CommonModule, TeamSelectionComponent, PlayCricketComponent, CricketGameOverComponent, CricketSettingsComponent],
  templateUrl: './cricket.container.html',
  styleUrl: './cricket.container.scss'
})
export class CricketContainer {
  public game!: CricketGame;

  constructor(private gameService: CricketGameService) { }

  public ngOnInit() {
    this.game = this.gameService.createGame();
    // this.game.setPlayers(["img/joe.jpg",
    //   "img/andy.jpg",
    //   "img/chris.jpg",
    //   "img/rich.jpg"]);

    // this.game.hit([Hit.Triple(20), Hit.Triple(19), Hit.Triple(18)]);
    // this.game.hit([Hit.Triple(15), Hit.Triple(16), Hit.Triple(17)]);

    // this.game.hit([Hit.Triple(20), Hit.Triple(19), Hit.Triple(18)]);
    // this.game.hit([Hit.Triple(15), Hit.Triple(16), Hit.Triple(17)]);

    // this.game.hit([Hit.Triple(2), Hit.Triple(2), Hit.Triple(2)]);
    // this.game.hit([Hit.Triple(2), Hit.Triple(2), Hit.Triple(2)]);

    // this.game.hit([Hit.Triple(15), Hit.Triple(16), Hit.Triple(17)]);
    // this.game.hit([Hit.Triple(20), Hit.Triple(19), Hit.Triple(18)]);

    // this.game.hit([Hit.Single(50), Hit.Single(25), Hit.Single(25)]);
    // this.game.hit([Hit.Single(25), Hit.Single(25), Hit.Single(25)]);
  }

  public switchTeamColours() {
    this.game.switchTeamColours();
  }

  public setPlayers(players: string[]) {
    this.game.setPlayers(players);
  }

  public setSettings(settings: CricketSettings) {
    this.game.setSettings(settings);
  }

  public handleHits(hits: Hit[]) {
    this.game.hit(hits);
  }

  public handleUndo() {
    this.game.undoLastTurn();
  }

  public forfeit() {
    this.game.forfeit();
  }

  public handleNewGame() {
    this.game = this.gameService.createGame();
  }
}
