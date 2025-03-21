import { Component } from '@angular/core';
import { EnterTeamsComponent } from "./enter-teams/enter-teams.component";
import { EnterNumbersComponent } from './enter-numbers/enter-numbers.component';

@Component({
  selector: 'app-killer',
  imports: [EnterTeamsComponent, EnterNumbersComponent],
  templateUrl: './killer.container.html',
  styleUrl: './killer.container.scss'
})
export class KillerContainer {
  // public step: KillerStep = 'enter-teams';
  // public teams: string[] = [];
  public step: KillerStep = 'enter-numbers';
  public teams: string[] = ['aaa', 'bbb'];

  public handleTeamsChanged(teams: string[]) {
    this.teams = teams;
    this.step = 'enter-numbers';
  } 
}

type KillerStep = 'enter-teams' | 'enter-numbers' | 'play';

export interface KillerGame {
  teams: KillerTeam[];
}

export interface KillerTeam {
  name: string;
  targets: KillerTarget[];
}

export interface KillerTarget {
  number: number;
  health: number;
}