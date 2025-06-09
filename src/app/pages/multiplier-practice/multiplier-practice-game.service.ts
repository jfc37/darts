import { Injectable } from '@angular/core';
import { Hit } from '../../components/board/board.component';
import { multiplierPracticeHit, Player } from '../../services/target-practice-game.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplierPracticeGameService {

  constructor() { }

  public createGame(): MultiplierPracticeGame {
    return MultiplierPracticeGame.InitialseNewGame();
  }
}

export class MultiplierPracticeGame {
  public phase: MultiplierPracticeGamePhase = MultiplierPracticeGamePhase.SelectPlayers;
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

  public static InitialseNewGame(): MultiplierPracticeGame {
    return new MultiplierPracticeGame();
  }

  public setPlayers(players: string[]) {
    this.players = players.map(player => Player.NewPlayer(player, multiplierPracticeHit));
    this.players[0].isActive = true;
    this.phase = MultiplierPracticeGamePhase.Play;
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
        this.phase = MultiplierPracticeGamePhase.GameOver;
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

/**
 * Represents the current phase of the game
 */
export enum MultiplierPracticeGamePhase {
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


const TOTAL_ROUNDS = 2;

export interface GameStat {
  totalHits: number[];
  rounds: RoundStat[];
}

export interface RoundStat {
  round: number;
  hits: number[];
  points: HitPoint[];
}

export interface HitPoint {
  radius: number;
  angle: number;
}

function updateGameStats(players: Player[]) {
  const existingGameStat = localStorage.getItem('multiplierGame');
  const gameStats: GameStat = existingGameStat ? JSON.parse(existingGameStat) : { totalHits: [], rounds: [] };

  gameStats.totalHits = [...players.map(player => player.totalMakes), ...gameStats.totalHits];
  players.forEach(player => {
    player.rounds.sort((a, b) => a.hole < b.hole ? -1 : 1).forEach(round => {
      const existingRoundStat = gameStats.rounds.find(x => x.round == round.hole);
      if (existingRoundStat) {
        existingRoundStat.hits = [round.makes, ...existingRoundStat.hits];
        existingRoundStat.points = [...round.points, ...(existingRoundStat.points || [])];
      } else {
        gameStats.rounds.push({ round: round.hole, hits: [round.makes], points: round.points });
      }
    })
  })

  localStorage.setItem('multiplierGame', JSON.stringify(gameStats));
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