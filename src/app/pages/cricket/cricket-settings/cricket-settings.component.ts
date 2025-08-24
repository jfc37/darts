import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CricketSettings } from '../cricket-game.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cricket-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './cricket-settings.component.html',
  styleUrl: './cricket-settings.component.scss'
})
export class CricketSettingsComponent {
  @Output() public settingsSelected = new EventEmitter<CricketSettings>();

  public settings: CricketSettings = new CricketSettings();

  public confirmSettings() {
    this.settingsSelected.emit(this.settings);
  }
}