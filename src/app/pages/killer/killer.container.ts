import { Component } from '@angular/core';
import { EnterTeamsComponent } from "./enter-teams/enter-teams.component";
import { KillerGame, KillerGameService } from '../../services/killer-game.service';
import { EnterTargetsComponent } from "./enter-targets/enter-targets.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-killer',
  imports: [CommonModule, EnterTeamsComponent, EnterTargetsComponent],
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
  }


  public setTeams(teams: string[]) {
    this.game.setTeams(teams);
  }

  public setTarget(target: number) {
    this.game.setTarget(target);
  }
}
