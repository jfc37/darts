import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OhOneSettings } from '../../domain-objects/oh-one/oh-one-settings';

@Component({
  selector: 'app-oh-one-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './oh-one-settings.component.html',
  styleUrl: './oh-one-settings.component.scss'
})
export class OhOneSettingsComponent {
  @Output() public settingsSelected = new EventEmitter<OhOneSettings>();

  public settings: OhOneSettings = new OhOneSettings();

  public confirmSettings() {
    console.error('emitting settings', this.settings);
    this.settingsSelected.emit(this.settings);
  }
}