import { Component } from '@angular/core';
import { EnterTeamsComponent } from "./enter-teams/enter-teams.component";

@Component({
  selector: 'app-killer',
  imports: [EnterTeamsComponent],
  templateUrl: './killer.container.html',
  styleUrl: './killer.container.scss'
})
export class KillerContainer {
  public step: KillerStep = 'enter-teams';
  public teams: string[] = [];

  public handleTeamsChanged(teams: string[]) {
    this.teams = teams;
    this.step = 'enter-targets';
  } 
}

type KillerStep = 'enter-teams' | 'enter-targets' | 'play';

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