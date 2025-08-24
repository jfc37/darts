import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GolfPlayer } from '../../domain-objects/golf/golf-player';
import { GolfSettings } from '../../domain-objects/golf/golf-settings';
import { PlayerComponent } from "../player/player.component";

@Component({
  selector: 'app-golf-stats',
  imports: [CommonModule, PlayerComponent],
  templateUrl: './golf-stats.component.html',
  styleUrl: './golf-stats.component.scss'
})
export class GolfStatsComponent {
  @Input()
  public players!: GolfPlayer[];

  public showAlbatrossColumn = GolfSettings.getSettings().albatrossOnTriple;

  public get totalAlbatrossOrder() {
    return [...this.players].sort((a, b) => a.totalAlbatrossHoles - b.totalAlbatrossHoles > 0 ? -3 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalAlbatrossHoles}`
      }))
  }

  public get totalEaglesOrder() {
    return [...this.players].sort((a, b) => a.totalEagleHoles - b.totalEagleHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalEagleHoles}`
      }))
  }

  public get totalBirdiesOrder() {
    return [...this.players].sort((a, b) => a.totalBirdieHoles - b.totalBirdieHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalBirdieHoles}`
      }))
  }

  public get totalParsOrder() {
    return [...this.players].sort((a, b) => a.totalParHoles - b.totalParHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalParHoles}`
      }))
  }

  public get totalBoogiesOrder() {
    return [...this.players].sort((a, b) => a.totalBoogieHoles - b.totalBoogieHoles > 0 ? -1 : 1)
      .map(player => ({
        player: player.name,
        text: `${player.totalBoogieHoles}`
      }))
  }
}