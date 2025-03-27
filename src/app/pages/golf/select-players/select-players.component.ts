import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CharacterSelectionComponent } from '../../../components/character-selection/character-selection.component';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../../../components/player/player.component';

@Component({
  selector: 'app-select-players',
  imports: [CommonModule, CharacterSelectionComponent, PlayerComponent],
  templateUrl: './select-players.component.html',
  styleUrl: './select-players.component.scss'
})
export class SelectPlayersComponent {

  @Output()
  public playersSelected = new EventEmitter<string[]>;

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public players: string[] = [];
  public selectingPlayer = 1;

  public handleCharacterSelected(name: string): void {
    this.players.push(name);
    this.selectingPlayer++;

    if (this.selectingPlayer == 5) {
      this.dialog.nativeElement.showModal();
    }
  }

  public finishedSelecting() {
    this.dialog.nativeElement.showModal();
  }

  resetPlayers() {
    this.players = [];
    this.selectingPlayer = 1;
  }

  public confirmPlayers() {
    this.playersSelected.emit(this.players);
  }
}