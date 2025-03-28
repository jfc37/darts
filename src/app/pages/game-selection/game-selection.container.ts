import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerComponent } from '../../components/player/player.component';

@Component({
  selector: 'app-game-selection',
  imports: [RouterModule, PlayerComponent],
  templateUrl: './game-selection.container.html',
  styleUrl: './game-selection.container.scss'
})
export class GameSelectionContainer {

}
