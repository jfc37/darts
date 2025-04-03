import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CharacterSelectionComponent } from '../../../components/character-selection/character-selection.component';
import { PlayerComponent } from '../../../components/player/player.component';
import { TEAM_COLOURS } from '../../../services/killer-game.service';

@Component({
  selector: 'app-team-selection',
  imports: [CommonModule, CharacterSelectionComponent, PlayerComponent],
  templateUrl: './team-selection.component.html',
  styleUrl: './team-selection.component.scss'
})
export class TeamSelectionComponent {
  @Output()
  public playersSelected = new EventEmitter<string[]>;

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public selectingPlayer = 1;
  public avatars: string[] = [];

  public team1Colour = TEAM_COLOURS[0];
  public team2Colour = TEAM_COLOURS[1];

  public handleCharacterSelected(name: string): void {
    this.avatars.push(name);
    this.selectingPlayer++;

    if (this.selectingPlayer == 5) {
      this.dialog.nativeElement.showModal();
    }
  }

  resetPlayers() {
    this.avatars = [];
    this.selectingPlayer = 1;
  }

  public confirmPlayers() {
    this.playersSelected.emit(this.avatars);
  }
}