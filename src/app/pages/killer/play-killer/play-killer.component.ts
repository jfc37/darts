import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardComponent, Hit } from "../../../components/board/board.component";
import { KillerTarget } from '../../../services/killer-game.service';

@Component({
  selector: 'app-play-killer',
  imports: [BoardComponent],
  templateUrl: './play-killer.component.html',
  styleUrl: './play-killer.component.scss'
})
export class PlayKillerComponent {
  /**
   * Name of the team who's turn it is
   */
  @Input() public team!: string;

  /**
   * Targets for each team
   */
  @Input() public teamTargets!: KillerTarget[][];

  @Output() public hit = new EventEmitter<Hit>();

  public get teamOneTargetNumbers() {
    return this.teamTargets[0].map(t => t.target);
  }

  public get teamTwoTargetNumbers() {
    return this.teamTargets[1].map(t => t.target);
  }

  public get targetsWithThreeHeath() {
    return this.teamTargets.flat().filter(t => t.health === 3)
      .map(t => t.target);
  }

  public get targetsWithTwoHeath() {
    return this.teamTargets.flat().filter(t => t.health === 2)
      .map(t => t.target);
  }

  public get targetsWithOneHeath() {
    return this.teamTargets.flat().filter(t => t.health === 1)
      .map(t => t.target);
  }

  public get deadTargets() {
    return this.teamTargets.flat().filter(t => t.health === 0)
      .map(t => t.target);
  }

  public recordHit(hit: Hit) {
    this.hit.emit(hit);
  }
}
