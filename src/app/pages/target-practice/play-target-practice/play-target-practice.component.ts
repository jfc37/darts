import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GameStat, HitPoint, Player } from '../../../services/target-practice-game.service';
import { Hit, BoardComponent } from '../../../components/board/board.component';
import { PlayerComponent } from "../../../components/player/player.component";
import { TargetPracticeScoreCardComponent } from "../target-practice-score-card/target-practice-score-card.component";
import { NumberTotalPipe } from "../stats/stats.component";

@Component({
  selector: 'app-play-target-practice',
  imports: [PlayerComponent, BoardComponent, TargetPracticeScoreCardComponent, NumberTotalPipe],
  templateUrl: './play-target-practice.component.html',
  styleUrl: './play-target-practice.component.scss'
})
export class PlayTargetPracticeComponent {
  @Input()
  public players!: Player[];

  @Input() round!: number;

  @Output() public hits = new EventEmitter<Hit[]>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  public recentRoundStats: { [key: number]: RecentScores };
  public heatMap: { [key: number]: HitPoint[] } = {};

  public get colouredNumbers() {
    return {
      [this.round]: ACTIVE_NUMBER_COLOUR
    }
  }

  public recordedHits: Hit[] = [];
  public get numbersHitThisTurn() {
    return this.recordedHits.map(x => x.number).join(', ')
  }

  constructor() {
    const existingGameStat = localStorage.getItem('game');
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