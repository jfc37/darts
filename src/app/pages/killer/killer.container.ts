import { Component } from '@angular/core';
import { EnterTeamsComponent } from "./enter-teams/enter-teams.component";
import { KillerGame, KillerGameService } from '../../services/killer-game.service';
import { EnterTargetsComponent } from "./enter-targets/enter-targets.component";
import { CommonModule } from '@angular/common';
import { PlayKillerComponent } from "./play-killer/play-killer.component";
import { Hit } from '../../components/board/board.component';

@Component({
  selector: 'app-killer',
  imports: [CommonModule, EnterTeamsComponent, EnterTargetsComponent, PlayKillerComponent],
  providers: [KillerGameService],
  templateUrl: './killer.container.html',
  styleUrl: './killer.container.scss'
})
export class KillerContainer {
  public game!: KillerGame;

  constructor(private killerGameService: KillerGameService) { }

  public ngOnInit() {
    this.game = this.killerGameService.createGame();
    this.game.setTeams(["Team 1", "Team 2"]);

    this.game.setTarget(1);
    this.game.setTarget(18);
    this.game.setTarget(4);

    this.game.setTarget(20);
    this.game.setTarget(5);
    this.game.setTarget(12);

    this.game.setTarget(13);
    this.game.setTarget(6);
    this.game.setTarget(10);

    this.game.setTarget(9);
    this.game.setTarget(14);
    this.game.setTarget(11);
  }


  public setTeams(teams: string[]) {
    this.game.setTeams(teams);
  }

  public setTarget(target: number) {
    this.game.setTarget(target);
  }


  public handleHit(hit: Hit) {
    this.game.hit(hit);
  }
}
