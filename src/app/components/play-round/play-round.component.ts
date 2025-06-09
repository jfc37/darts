import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { PlayerComponent } from "../player/player.component";
import { StandardScoreCardComponent } from "../standard-score-card/standard-score-card.component";
import { NumberTotalPipe } from '../../pipes/number-total.pipe';
import { Player } from '../../domain-objects/player';
import { GameStat } from '../../domain-objects/game-stat';
import { Hit, HitPoint } from '../../domain-objects/hit';

@Component({
  selector: 'app-play-round',
  imports: [PlayerComponent, BoardComponent, StandardScoreCardComponent, NumberTotalPipe],
  templateUrl: './play-round.component.html',
  styleUrl: './play-round.component.scss'
})
export class PlayRoundComponent {
  @Input()
  public players!: Player[];

  @Input() round!: number;

  @Input()
  public set localStorageName(name: string) {
    if (!name) {
      return;
    }

    const existingGameStat = localStorage.getItem(name);
    const stats: GameStat = existingGameStat ? JSON.parse(existingGameStat) : { totalHits: [], rounds: [] };

    this.recentRoundStats = stats.rounds.reduce((allRounds, round) => ({
      ...allRounds,
      [round.round]: {
        lastGame: round.hits.slice(0, 1),
        lastFiveGames: round.hits.slice(0, 5),
        lastTenGames: round.hits.slice(0, 10),
        lastTwentyGames: round.hits.slice(0, 20),
        totalGames: round.hits
      }
    }), {});

    this.heatMap = stats.rounds.reduce((map, round) => ({
      ...map,
      [round.round]: (round.points || []).slice(0, 15)
    }), {});
  }

  @Output() public hits = new EventEmitter<Hit[]>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public recentRoundStats: { [key: number]: RecentScores } = {};
  public heatMap: { [key: number]: HitPoint[] } = {};

  public get colouredNumbers() {
    return {
      [this.round]: ACTIVE_NUMBER_COLOUR
    }
  }

  public recordedHits: Hit[] = [];
  public get numbersHitThisTurn() {
    return this.recordedHits.map(x => x.toVerboseDisplayText()).join(', ')
  }

  public recordHit(hit: Hit) {
    this.recordedHits.push(hit);

    if (this.recordedHits.length === 3) {
      this.dialog.nativeElement.showModal();
    }
  }

  public resetTargets() {
    this.recordedHits = [];
  }

  public confirmTargets() {
    this.hits.emit(this.recordedHits);
    this.recordedHits = [];
  }
}

export const ACTIVE_NUMBER_COLOUR = 'blue';

interface RecentScores {
  lastGame: number[],
  lastFiveGames: number[],
  lastTenGames: number[],
  lastTwentyGames: number[],
  totalGames: number[],
}