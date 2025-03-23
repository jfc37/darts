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

  public get colouredNumbers() {
    return {
      ...this.teamTargets[0].reduce((accum, target) => ({ ...accum, [target.target]: 'limegreen' }), {}),
      ...this.teamTargets[1].reduce((accum, target) => ({ ...accum, [target.target]: 'pink' }), {})
    }
  }

  public get healthColours() {
    return {
      ...this.teamTargets.flat().filter(t => t.health === 3).reduce((accum, target) => ({ ...accum, [target.target]: 'green' }), {}),
      ...this.teamTargets.flat().filter(t => t.health === 2).reduce((accum, target) => ({ ...accum, [target.target]: 'orange' }), {}),
      ...this.teamTargets.flat().filter(t => t.health === 1).reduce((accum, target) => ({ ...accum, [target.target]: 'red' }), {}),
      ...this.teamTargets.flat().filter(t => t.health === 0).reduce((accum, target) => ({ ...accum, [target.target]: 'black' }), {}),
    }
  }

  public recordHit(hit: Hit) {
    this.hit.emit(hit);
  }
}
