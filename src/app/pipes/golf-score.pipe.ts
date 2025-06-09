import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'golfScore'
})
export class GolfScorePipe implements PipeTransform {
  transform(value: number): string {
    if (value < 0) {
      return value.toString();
    }

    if (value == 0) {
      return 'even';
    }

    return `+${value}`;
  }
}