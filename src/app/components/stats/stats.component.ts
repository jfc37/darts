import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { forwardRef } from "@angular/core";
import { GameStat, RoundStat } from '../../services/target-practice-game.service';
import { MostRecentScoresPipe } from '../../pipes/most-recent-scores';
import { NumberTotalPipe } from '../../pipes/number-total.pipe';
import { NumberHitsPipe } from '../../pipes/number-hits.pipe';

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

  @Input()
  public set localStorageName(name: string) {
    if (!name) {
      return;
    }

    const existingGameStat = localStorage.getItem(name);
    this.stats = existingGameStat ? JSON.parse(existingGameStat) : { totalHits: [], rounds: [] };

    this.recentStats = {
      totalHits: this.stats.totalHits.slice(0, 5),
      rounds: this.stats.rounds.map(round => ({ ...round, hits: round.hits.slice(0, 5) }))
    }

    this.worstRecentRounds = [...this.recentStats.rounds].sort((a, b) => sumRoundTotal(a) - sumRoundTotal(b) > 0 ? 1 : -1)
      .slice(0, 5);

    this.bestRecentRounds = [...this.recentStats.rounds].sort((a, b) => sumRoundTotal(a) - sumRoundTotal(b) > 0 ? -1 : 1)
      .slice(0, 5);
  }
}

function sumRoundTotal(round: RoundStat): number {
  return round.hits.reduce((accu, curr) => accu + curr, 0);
}