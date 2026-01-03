import { Component, Input } from '@angular/core';
import { forwardRef } from "@angular/core";
import { MostRecentScoresPipe } from '../../pipes/most-recent-scores';
import { NumberTotalPipe } from '../../pipes/number-total.pipe';
import { NumberHitsPipe } from '../../pipes/number-hits.pipe';
import { GameStat, RoundStat } from '../../domain-objects/game-stat';

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
    this.stats.rounds = this.stats.rounds.map(round => ({ ...round, maxScorePerThrow: round.maxScorePerThrow ?? 1 }));

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
