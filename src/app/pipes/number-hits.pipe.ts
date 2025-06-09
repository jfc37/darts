import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'numberHits'
})
export class NumberHitsPipe implements PipeTransform {

    transform(value: number[], hits: number): string {
        return value.filter(x => x == hits).length.toString();
    }
}