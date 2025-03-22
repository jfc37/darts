import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  public numbers: number[] = Array.from({ length: 20 }, (_, i) => i + 1);

  @Input() player: string = '';

  @Input() unavailableNumbers: number[] = [];

  @Input() coloredNumbersSetOne: number[] = [];

  @Input() coloredNumbersSetTwo: number[] = [];

  @Output() hit = new EventEmitter<Hit>();

  public handleHit(className: string) {
    const hit = getHitFromClassName(className);
    this.hit.emit(hit);
  }

}

function getHitFromClassName(className: string): Hit {
  if (className === 'out') {
    return Hit.Missed();
  }

  if (className === 'inner-bull') {
    return Hit.InnerBull();
  }

  if (className === 'outer-bull') {
    return Hit.OuterBull();
  }

  if (className.startsWith('triple')) {
    const number = parseInt(className.replace('triple-', ''));
    return Hit.Triple(number);
  }

  if (className.startsWith('double')) {
    const number = parseInt(className.replace('double-', ''));
    return Hit.Double(number);
  }

  if (className.startsWith('single-inner')) {
    const number = parseInt(className.replace('single-inner-', ''));
    return Hit.SingleInner(number);
  }

  if (className.startsWith('single-outer')) {
    const number = parseInt(className.replace('single-outer-', ''));
    return Hit.SingleOuter(number);
  }

  alert(`Don't know how to handle hit with dart cell: ${className}`);
  throw new Error(`Don't know how to handle hit with dart cell: ${className}`);;
}

export class Hit {
  /**
   * Number on the board that was hit
   */
  public number: number;

  /**
   * Score value of the hit
   */
  public value: number;

  /**
   * Multiplier of the hit
   */
  public multiplier: DartCell;

  /**
   * True if board was missed entirely
   */
  public missed: boolean;

  private constructor(number: number, value: number, multiplier: DartCell, missed: boolean) {
    this.number = number;
    this.value = value;
    this.multiplier = multiplier;
    this.missed = missed;
  }

  static Missed(): Hit {
    return new Hit(0, 0, DartCell.SingleInner, true);
  }

  static InnerBull(): Hit {
    return new Hit(50, 50, DartCell.InnererBullsEye, false);
  }

  static OuterBull(): Hit {
    return new Hit(25, 25, DartCell.OuterBullsEye, false);
  }

  static Triple(number: number): Hit {
    return new Hit(number, number * 3, DartCell.Triple, false);
  }

  static Double(number: number): Hit {
    return new Hit(number, number * 2, DartCell.Double, false);
  }

  static SingleInner(number: number): Hit {
    return new Hit(number, number, DartCell.SingleInner, false);
  }

  static SingleOuter(number: number): Hit {
    return new Hit(number, number, DartCell.SingleOuter, false);
  }
}

export enum DartCell {
  SingleInner = 1,
  SingleOuter = 2,
  Double = 3,
  Triple = 4,
  OuterBullsEye = 5,
  InnererBullsEye = 6,
}