import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-character-selection',
  imports: [],
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

  @Output() characterSelected = new EventEmitter<string>();

  public handlePlayerSelection(character: string): void {
    this.characterSelected.emit(character);
  }
}
