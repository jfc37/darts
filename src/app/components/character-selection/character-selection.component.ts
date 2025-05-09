import { Component, EventEmitter, Output } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-selection',
  imports: [CommonModule],
  templateUrl: './character-selection.component.html',
  styleUrl: './character-selection.component.scss'
})
export class CharacterSelectionComponent {
  public allCharacters = [
    "img/andy.jpg",
    "img/chris.jpg",
    "img/rich.jpg",
    "img/joe.jpg",
  ];

  public allCharacterImages$!: Observable<string[]>;

  @Output() characterSelected = new EventEmitter<string>();

  constructor(private imageService: ImageService) { }

  public ngOnInit() {
    this.allCharacterImages$ = this.imageService.getImages(this.allCharacters);
  }

  public handlePlayerSelection(character: string): void {
    this.characterSelected.emit(character);
  }
}
