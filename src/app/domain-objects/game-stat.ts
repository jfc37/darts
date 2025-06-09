import { HitPoint } from "./hit";
import { Player } from "./player";

export interface GameStat {
    totalHits: number[];
    rounds: RoundStat[];
}

export interface RoundStat {
    round: number;
    hits: number[];
    points: HitPoint[];
}

export function updateGameStats(localStorageName: string, players: Player[]) {
    const existingGameStat = localStorage.getItem(localStorageName);
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

    localStorage.setItem(localStorageName, JSON.stringify(gameStats));
}