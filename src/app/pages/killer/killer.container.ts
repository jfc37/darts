import { Component } from '@angular/core';
import { KillerGame, KillerGameService } from '../../services/killer-game.service';
import { EnterTargetsComponent } from "./enter-targets/enter-targets.component";
import { CommonModule } from '@angular/common';
import { PlayKillerComponent } from "./play-killer/play-killer.component";
import { Hit } from '../../components/board/board.component';
import { KillerGameOverComponent } from "./killer-game-over/killer-game-over.component";
import { TeamSelectionComponent } from "./team-selection/team-selection.component";

@Component({
  selector: 'app-killer',
  imports: [CommonModule, TeamSelectionComponent, EnterTargetsComponent, PlayKillerComponent, KillerGameOverComponent, TeamSelectionComponent],
  providers: [KillerGameService],
  templateUrl: './killer.container.html',
  styleUrl: './killer.container.scss'
})
export class KillerContainer {
  public game!: KillerGame;

  constructor(private killerGameService: KillerGameService) { }

  public ngOnInit() {
    this.game = this.killerGameService.createGame();
    this.game.setPlayers(["nes-mario",
      "nes-ash",
      "nes-pokeball",
      "nes-bulbasaur"]);

    this.game.setTargets([20, 5, 12]);
    this.game.setTargets([1, 18, 4]);
    this.game.setTargets([9, 14, 11]);
    this.game.setTargets([13, 6, 10]);

    // this.game.hit(Hit.Triple(1));
    // this.game.hit(Hit.Triple(1));
    // this.game.hit(Hit.Triple(4));

    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));

    // this.game.hit(Hit.Triple(4));
    // this.game.hit(Hit.Triple(18));
    // this.game.hit(Hit.Triple(18));

    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));

    // this.game.hit(Hit.Triple(13));
    // this.game.hit(Hit.Triple(13));
    // this.game.hit(Hit.Triple(6));

    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));

    // this.game.hit(Hit.Triple(6));
    // this.game.hit(Hit.Triple(6));
    // this.game.hit(Hit.Triple(10));

    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));
    // this.game.hit(Hit.SingleInner(15));

    // this.game.hit(Hit.Triple(10));
  }

  public setPlayers(players: string[]) {
    this.game.setPlayers(players);
  }

  public setTargets(targets: number[]) {
    this.game.setTargets(targets);
  }


  public handleHit(hit: Hit) {
    this.game.hit(hit);
  }

  public handleNewGame() {
    this.game = this.killerGameService.createGame();
  }
}
