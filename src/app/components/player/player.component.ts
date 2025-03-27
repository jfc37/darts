import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  @Input()
  public set player(value: string) {
    if (value) {
      this.avatar = value;
    } else {
      this.avatar = DEFAULT_EMPTY_AVATAR;
    }
  }

  public avatar!: string;

  @Input()
  public displayName!: string;

  @Input()
  public pulse!: boolean;
}

const DEFAULT_EMPTY_AVATAR = 'img/question-mark.jpg';