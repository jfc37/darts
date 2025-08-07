import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CharacterSelectionComponent } from '../../../components/character-selection/character-selection.component';
import { PlayerComponent } from '../../../components/player/player.component';
import { TeamColours } from '../../../domain-objects/team-colours';

@Component({
  selector: 'app-team-selection',
  imports: [CommonModule, CharacterSelectionComponent, PlayerComponent],
  templateUrl: './team-selection.component.html',
  styleUrl: './team-selection.component.scss'
})
export class TeamSelectionComponent {
  @Output()
  public playersSelected = new EventEmitter<string[]>;

  @Output()
  public switchTeamColours = new EventEmitter<void>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public selectingPlayer = 1;
  public avatars: string[] = [];

  public team1Colour = TeamColours.getForTeam(1);
  public team2Colour = TeamColours.getForTeam(2);

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

  public swapColours() {
    const temp = this.team1Colour;
    this.team1Colour = this.team2Colour;
    this.team2Colour = temp;

    this.switchTeamColours.emit();
  }

  public confirmPlayers() {
    this.playersSelected.emit(this.avatars);
  }
}