import { Injectable } from '@angular/core';
import { Hit } from '../components/board/board.component';

@Injectable({
  providedIn: 'root'
})
export class TargetPracticeGameService {

  constructor() { }

  public createGame(): TargetPracticeGame {
    return TargetPracticeGame.InitialseNewGame();
  }
}

export class TargetPracticeGame {
  public phase: TargetPracticeGamePhase = TargetPracticeGamePhase.SelectPlayers;
  public players!: Player[];
  public roundIndex: number = 0;
  public roundOrder: number[] = getRandomRounds();

  public get activePlayer() {
    return this.players.find(x => x.isActive)!;
  }

  public get round() {
    return this.roundOrder[this.roundIndex];
  }

  private constructor() {

  }

  public static InitialseNewGame(): TargetPracticeGame {
    return new TargetPracticeGame();
  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => Player.NewPlayer(player));
    this.players[0].isActive = true;
    this.phase = TargetPracticeGamePhase.Play;
  }

  public recordRound(hits: Hit[]) {
    this.activePlayer.recordRound(hits, this.roundOrder[this.roundIndex]);
    this.changeToNextPlayer();
  }


  private changeToNextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.activePlayer);
    const isLastPlayer = currentPlayerIndex == this.players.length - 1;

    if (isLastPlayer) {
      if (this.roundIndex == TOTAL_ROUNDS - 1) {
        this.phase = TargetPracticeGamePhase.GameOver;
        updateGameStats(this.players);
        return;
      } else {
        this.roundIndex++;
        this.activePlayer.isActive = false;
        this.players[0].isActive = true;
        return;
      }
    } else {
      this.activePlayer.isActive = false;
      this.players[currentPlayerIndex + 1].isActive = true;
    }
  }
}

export class Player {
  public name: string;
  public isActive: boolean = false;
  public rounds: Round[] = [];

  private constructor(name: string) {
    this.name = name;
  }

  public recordRound(hits: Hit[], round: number) {
    this.rounds.push(new Round(round, hits));
  }

  public get score(): string {
    const totalThrows = this.rounds.length * 3;
    const totalMakes = this.rounds.reduce((acc, round) => acc + round.makes, 0);

    if (totalThrows === 0) {
      return `${totalMakes} / ${totalThrows}`;
    }

    const percentage = (totalMakes / totalThrows).toFixed(3);
    return `${totalMakes} / ${totalThrows} (${percentage})`;
  }

  public get totalMakes(): number {
    return this.rounds.reduce((acc, round) => acc + round.makes, 0);
  }

  public scoreForRound(round: number): string {
    const roundIndex = this.rounds.findIndex(x => x.hole == round);
    const roundHits = this.rounds[roundIndex];
    return `${roundHits.makes} / 3`;

  }

  static NewPlayer(name: string): Player {
    return new Player(name);
  }
}

export class Round {
  public hole: number;
  private _hits: Hit[];

  constructor(hole: number, hits: Hit[]) {
    this.hole = hole;
    this._hits = hits;
  }

  public get misses(): number {
    return this._hits.filter(x => x.number != this.hole).length;
  }

  public get makes(): number {
    return this._hits.filter(x => x.number == this.hole).length;
  }
}

/**
 * Represents the current phase of the game
 */
export enum TargetPracticeGamePhase {
  SelectPlayers = 'select-players',

  /**
   * Playing the game
   */
  Play = 'play',

  /**
   * The game has ended
   */
  GameOver = 'game-over'
}


const TOTAL_ROUNDS = 20;

export interface GameStat {
  totalHits: number[];
  rounds: RoundStat[];
}

export interface RoundStat {
  round: number;
  hits: number[];
}

function updateGameStats(players: Player[]) {
  const existingGameStat = localStorage.getItem('game');
  const gameStats: GameStat = existingGameStat ? JSON.parse(existingGameStat) : { totalHits: [], rounds: [] };

  gameStats.totalHits = [...players.map(player => player.totalMakes), ...gameStats.totalHits];
  players.forEach(player => {
    player.rounds.sort((a, b) => a.hole < b.hole ? -1 : 1).forEach(round => {
      const existingRoundStat = gameStats.rounds.find(x => x.round == round.hole);
      if (existingRoundStat) {
        existingRoundStat.hits = [round.makes, ...existingRoundStat.hits];
      } else {
        gameStats.rounds.push({ round: round.hole, hits: [round.makes] });
      }
    })
  })

  localStorage.setItem('game', JSON.stringify(gameStats));
}

/**
 * Returns an array with number 1 to 20 in a random order
 */
function getRandomRounds() {
  const rounds = Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1);
  for (let i = rounds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rounds[i], rounds[j]] = [rounds[j], rounds[i]];
  }
  return rounds;
}