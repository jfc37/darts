import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-enter-teams',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './enter-teams.component.html',
  styleUrl: './enter-teams.component.scss'
})
export class EnterTeamsComponent {
  teamsForm = new FormArray([
    new FormControl('', [Validators.required, Validators.minLength(1)]),
    new FormControl('', [Validators.required, Validators.minLength(1)]),
  ]);

  @Output() teamsChanged = new EventEmitter<string[]>();

  public handleSubmit() {
    this.teamsChanged.emit(this.teamsForm.value.filter((team: string | null) => team !== null) as string[]);
  }
}