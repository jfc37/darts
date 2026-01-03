import { Pipe, PipeTransform } from "@angular/core";
import { GameStat } from "../domain-objects/game-stat";

@Pipe({
    name: 'mostRecentScores'
})
export class MostRecentScoresPipe implements PipeTransform {

    transform(value: GameStat): string {
        const maxScore = value.rounds.reduce((accu, curr) => accu + (3 * (curr.maxScorePerThrow ?? 1)), 0);
        const lastestGame = value.totalHits[0] != null ? value.rounds.reduce((accu, curr) => accu + curr.hits[0], 0) : null;
        const secondLastestGame = value.totalHits[1] != null ? value.rounds.reduce((accu, curr) => accu + curr.hits[1], 0) : null;
        const thirdLastestGame = value.totalHits[2] != null ? value.rounds.reduce((accu, curr) => accu + curr.hits[2], 0) : null;

        return [lastestGame, secondLastestGame, thirdLastestGame].filter(x => x != null).map(totalHits => fullGameHitsToDisplayableScore(totalHits!, maxScore)).join(', ');
    }
}

function fullGameHitsToDisplayableScore(totalHits: number, maxScore: number): string {
    const percentage = maxScore === 0 ? '0.000' : (totalHits / maxScore).toFixed(3);
    return `${totalHits} / ${maxScore} (${percentage})`;
}
