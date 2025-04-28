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
    const percentage = (totalHits / totalThrows).toFixed(3);

    return `${totalHits} / ${totalThrows} (${percentage})`;
  }
}

@Pipe({
  name: 'mostRecentScores'
})
export class MostRecentScoresPipe implements PipeTransform {

  transform(value: GameStat): string {
    const lastestGame = value.totalHits[0] != null ? value.rounds.reduce((accu, curr) => accu + curr.hits[0], 0) : null;
    const secondLastestGame = value.totalHits[1] != null ? value.rounds.reduce((accu, curr) => accu + curr.hits[1], 0) : null;
    const thirdLastestGame = value.totalHits[2] != null ? value.rounds.reduce((accu, curr) => accu + curr.hits[2], 0) : null;

    return [lastestGame, secondLastestGame, thirdLastestGame].filter(x => x != null).map(fullGameHitsToDisplayableScore).join(', ');
  }
}

function fullGameHitsToDisplayableScore(totalHits: number): string {
  const percentage = (totalHits / 60).toFixed(3);
  return `${totalHits} / 60 (${percentage})`;
}