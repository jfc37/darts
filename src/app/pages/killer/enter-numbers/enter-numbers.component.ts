import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardComponent, Hit } from '../../../components/board/board.component';

@Component({
  selector: 'app-enter-numbers',
  imports: [ReactiveFormsModule, FormsModule, BoardComponent],
  templateUrl: './enter-numbers.component.html',
  styleUrl: './enter-numbers.component.scss'
})
export class EnterNumbersComponent {
  @Input() public set teams(value: string[]) {
    this.teamStates = value.map(name => ({ name, numbers: [] }));
  }

  @Output() public KillerTeamsChanged = new EventEmitter<KillerTeam[]>();

  public currentTeam: string = '';
  public teamStates: KillerTeam[] = [];

  public ngOnInit() {
    this.currentTeam = this.teamStates[0].name;
  }


recordNumber(hit: Hit) {
  console.error(hit);
  }
}

export interface KillerTeam {
  name: string;
  numbers: number[];
}