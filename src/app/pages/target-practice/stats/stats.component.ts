import { Component, Pipe, PipeTransform } from '@angular/core';
import { forwardRef } from "@angular/core";
import { GameStat, RoundStat } from '../../../services/target-practice-game.service';

@Component({
  selector: 'app-stats',
  imports: [forwardRef(() => NumberHitsPipe), forwardRef(() => NumberTotalPipe), forwardRef(() => MostRecentScoresPipe)],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  stats!: GameStat;
  recentStats!: GameStat;
  worstRecentRounds!: RoundStat[];
  bestRecentRounds!: RoundStat[];

  constructor() {
    const existingGameStat = localStorage.getItem('game');
    this.stats = existingGameStat ? JSON.parse(existingGameStat) : { totalHits: [], rounds: [] };

    this.recentStats = {
      totalHits: this.stats.totalHits.slice(0, 5),
      rounds: this.stats.rounds.map(round => ({ ...round, hits: round.hits.slice(0, 5) }))
    }

    this.worstRecentRounds = this.recentStats.rounds.sort((a, b) => sumRoundTotal(a) - sumRoundTotal(b) > 0 ? 1 : -1)
      .slice(0, 5);

    this.bestRecentRounds = this.recentStats.rounds.sort((a, b) => sumRoundTotal(a) - sumRoundTotal(b) > 0 ? -1 : 1)
      .slice(0, 5);
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

    if (totalThrows === 0) {
      return `${totalHits} / ${totalThrows}`;
    }

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

function sumRoundTotal(round: RoundStat): number {
  return round.hits.reduce((accu, curr) => accu + curr, 0);
}