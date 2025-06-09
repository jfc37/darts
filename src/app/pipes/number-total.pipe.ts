import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'numberTotal'
})
export class NumberTotalPipe implements PipeTransform {

    transform(value: number[]): string {
        const totalThrows = value.length * 3;
        const totalHits = value.reduce((acc, curr) => acc + curr, 0);

        if (totalThrows === 0) {
            return `${totalHits} / ${totalThrows}`;
        }

        const percentage = (totalHits / totalThrows).toFixed(3);
        return `${totalHits} / ${totalThrows} (${percentage})`;
    }
}