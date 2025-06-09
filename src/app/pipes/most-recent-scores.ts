import { Pipe, PipeTransform } from "@angular/core";
import { GameStat } from "../domain-objects/game-stat";

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