import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-team-selection',
  imports: [CommonModule],
  templateUrl: './team-selection.component.html',
  styleUrl: './team-selection.component.scss'
})
export class TeamSelectionComponent {
  @Output()
  public playersSelected = new EventEmitter<string[]>;

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public selectingPlayer = 1;
  public avatars: string[] = [DEFAULT_EMPTY_AVATAR, DEFAULT_EMPTY_AVATAR, DEFAULT_EMPTY_AVATAR, DEFAULT_EMPTY_AVATAR];
  public allCharacters = [
    "img/andy.jpg",
    "img/chris.jpg",
    "img/rich.jpg",
    "img/joe.jpg",
  ];
  public handlePlayerSelection(name: string): void {
    this.avatars[this.selectingPlayer - 1] = name;
    this.selectingPlayer++;

    if (this.selectingPlayer == 5) {
      this.dialog.nativeElement.showModal();
    }
  }

  resetPlayers() {
    this.avatars[0] = DEFAULT_EMPTY_AVATAR;
    this.avatars[1] = DEFAULT_EMPTY_AVATAR;
    this.avatars[2] = DEFAULT_EMPTY_AVATAR;
    this.avatars[3] = DEFAULT_EMPTY_AVATAR;

    this.selectingPlayer = 1;
  }

  public confirmPlayers() {
    this.playersSelected.emit(this.avatars);
  }
}

const DEFAULT_EMPTY_AVATAR = 'img/question-mark.jpg';