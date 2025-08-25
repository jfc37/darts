import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPlayersComponent } from '../../components/select-players/select-players.component';
import { OhOneGame, OhOneGameService } from './oh-one-game.service';
import { OhOneSettingsComponent } from "../../components/oh-one-settings/oh-one-settings.component";
import { OhOneSettings } from '../../domain-objects/oh-one/oh-one-settings';
import { PlayOhOneComponent } from "./play-oh-one/play-oh-one.component";
import { Hit } from '../../domain-objects/hit';
import { GameOverComponent } from "./game-over/game-over.component";

@Component({
  selector: 'app-oh-one',
  imports: [CommonModule, SelectPlayersComponent, OhOneSettingsComponent, PlayOhOneComponent, GameOverComponent],
  providers: [OhOneGameService],
  templateUrl: './oh-one.container.html',
  styleUrl: './oh-one.container.scss'
})
export class OhOneContainer {
  public game!: OhOneGame;

  constructor(private ohOneGameService: OhOneGameService) { }

  public ngOnInit() {
    this.game = this.ohOneGameService.createGame();

    // this.game.setPlayers(['img/joe.jpg', 'img/andy.jpg']);

    // this.game.setSettings(OhOneSettings.getSettings());

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

  }

  public setPlayers(players: string[]) {
    this.game.setPlayers(players);
  }

  public setSettings(settings: OhOneSettings) {
    this.game.setSettings(settings);
  }

  public handleHits(hits: Hit[]) {
    this.game.recordRound(hits);
  }

  public handleNewGame() {
    this.game = this.ohOneGameService.createGame();
  }
}
