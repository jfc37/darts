import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ImageService } from '../../services/image.service';

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
      this.avatar$ = of(value);
    } else {
      this.avatar$ = this.imageService.getImage(DEFAULT_EMPTY_AVATAR);
    }
  }

  @Input()
  public set secondaryPlayer(value: string) {
    this.secondaryAvatar = value;
  }

  public avatar$!: Observable<string>;
  public secondaryAvatar!: string;

  @Input()
  public displayName!: string;

  @Input()
  public pulse!: boolean;

  constructor(private imageService: ImageService) { }
}

const DEFAULT_EMPTY_AVATAR = 'img/question-mark.jpg';