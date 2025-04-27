import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { forwardRef } from "@angular/core";
import { GameStat } from '../../../services/target-practice-game.service';

@Component({
  selector: 'app-stats',
  imports: [forwardRef(() => NumberHitsPipe), forwardRef(() => NumberTotalPipe), forwardRef(() => MostRecentScoresPipe)],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  stats!: GameStat;

  constructor() {
    const existingGameStat = localStorage.getItem('game');
    this.stats = existingGameStat ? JSON.parse(existingGameStat) : { totalHits: [], rounds: [] };
  }
}

@Pipe({
  name: 'numberHits'
})
export class NumberHitsPipe implements PipeTransform {

  transform(value: number[], hits: number): string {
    return value.filter(x => x == hits).length.toString();
  }
}

@Pipe({
  name: 'numberTotal'
})
export class NumberTotalPipe implements PipeTransform {

  transform(value: number[]): string {
    const totalThrows = value.length * 3;
    const totalHits = value.reduce((acc, curr) => acc + curr, 0);

    return `${totalHits} / ${totalThrows}`;
  }
}

@Pipe({
  name: 'mostRecentScores'
})
export class MostRecentScoresPipe implements PipeTransform {

  transform(value: GameStat): string {
    // return the three most recent scores
    const recentScores = value.rounds.slice(-3).map(round => round.hits.reduce((acc, curr) => acc + curr, 0));
    return recentScores.join(', ');
  }
}
