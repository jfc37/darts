import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GolfSettings } from '../../domain-objects/golf/golf-settings';

@Component({
  selector: 'app-golf-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './golf-settings.component.html',
  styleUrl: './golf-settings.component.scss'
})
export class GolfSettingsComponent {
  @Output() public settingsSelected = new EventEmitter<GolfSettings>();

  public settings: GolfSettings = new GolfSettings();

  public confirmSettings() {
    console.error('emitting settings', this.settings);
    this.settingsSelected.emit(this.settings);
  }
}