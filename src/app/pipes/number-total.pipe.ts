import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'numberTotal'
})
export class NumberTotalPipe implements PipeTransform {

    transform(value: number[], maxScorePerThrow: number = 1): string {
        const totalThrows = value.length * 3;
        const totalPossibleScore = totalThrows * maxScorePerThrow;
        const totalHits = value.reduce((acc, curr) => acc + curr, 0);

        if (totalPossibleScore === 0) {
            return `${totalHits} / ${totalPossibleScore}`;
        }

        const percentage = (totalHits / totalPossibleScore).toFixed(3);
        return `${totalHits} / ${totalPossibleScore} (${percentage})`;
    }
}
