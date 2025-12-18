import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BoardComponent } from "../../../components/board/board.component";
import { CommonModule } from '@angular/common';
import { Hit } from '../../../domain-objects/hit';
import { Target, TargetStatus, Team } from '../cricket-game.service';
import { TeamColours } from '../../../domain-objects/team-colours';

@Component({
  selector: 'app-play-cricket',
  imports: [BoardComponent, CommonModule],
  templateUrl: './play-cricket.component.html',
  styleUrl: './play-cricket.component.scss'
})
export class PlayCricketComponent {
  @Input() public team!: string;

  @Input() public teamColour!: string;

  @Input() public player!: string;

  @Input() public targets!: Target[];

  @Input() public canUndo: boolean = false;

  public teamOneColour = TeamColours.getForTeam(1);
  public teamTwoColour = TeamColours.getForTeam(2);

  public recordedHits: Hit[] = [];

  public get numbersHitThisTurn() {
    return this.recordedHits.map(x => x.toDisplayText()).join(', ');
  }

  @Output() public hits = new EventEmitter<Hit[]>();
  @Output() public forfeit = new EventEmitter();
  @Output() public undo = new EventEmitter<void>();

  @ViewChild('confirmDialog', { static: true })
  public dialog!: ElementRef<HTMLDialogElement>;

  @ViewChild('confirmForfeitDialog', { static: true })
  public forfeitDialog!: ElementRef<HTMLDialogElement>;

  public get colouredNumbers() {
    const targetColours = this.targets.reduce((allTargets, target) => ({
      ...allTargets,
      [target.target]: toTargetColour(target.status),
    }), {});
    return {
      ...GREY_ENTIRE_BOARD,
      ...targetColours
    }
  }

  public get bullseyeColour() {
    const bullseyeTarget = this.targets.find(t => t.target === 25);

    if (!bullseyeTarget) {
      return undefined;
    }

    if (bullseyeTarget.status === TargetStatus.OpenTeam1) {
      return TeamColours.getForTeam(1);
    }

    if (bullseyeTarget.status === TargetStatus.OpenTeam2) {
      return TeamColours.getForTeam(2);
    }

    if (bullseyeTarget.status === TargetStatus.Closed) {
      return '#d3d3d3';
    }

    return undefined;
  }

  public get marks() {
    const targetMarks = this.targets.reduce((marks, target) => ({
      ...marks,
      [target.target]: [{
        text: hitsToMarks(target.teamOneHits),
        colour: TeamColours.getForTeam(1),
        shouldRotate: true
      }, {
        text: hitsToMarks(target.teamTwoHits),
        colour: TeamColours.getForTeam(2),
        shouldRotate: true
      }]
    }), {});

    const bullseyeTarget = this.targets.find(t => t.target === 25);
    const bullseyeMarks = {
      ['11']: [{ text: hitsToMarks(bullseyeTarget!.teamOneHits), colour: TeamColours.getForTeam(1), shouldRotate: true }],
      ['6']: [{ text: hitsToMarks(bullseyeTarget!.teamTwoHits), colour: TeamColours.getForTeam(2), shouldRotate: true }]
    }

    return {
      ...targetMarks,
      ...bullseyeMarks
    }
  }

  public get teamOneScore() {
    return this.targets.reduce((score, target) => score + target.pointsForTeamOne, 0);
  }

  public get teamTwoScore() {
    return this.targets.reduce((score, target) => score + target.pointsForTeamTwo, 0);
  }

  public recordHit(hit: Hit) {
    this.recordedHits.push(hit);

    if (this.recordedHits.length === 3) {
      this.dialog.nativeElement.showModal();
    }
  }

  public forfeitClicked() {
    this.forfeitDialog.nativeElement.showModal();
  }

  public closeForfeitDialog() {
    this.forfeitDialog.nativeElement.close();
  }

  public confirmForfeit() {
    this.forfeit.emit();
  }

  public resetTargets() {
    this.recordedHits = [];
  }

  public confirmTargets() {
    this.hits.emit(this.recordedHits);
    this.recordedHits = [];
  }

  public undoTurn() {
    this.recordedHits = [];
    this.undo.emit();
  }
}

function toTargetColour(status: TargetStatus): string {
  if (status === TargetStatus.Available) {
    return 'green';
  } else if (status === TargetStatus.OpenTeam1) {
    return TeamColours.getForTeam(1);
  } else if (status === TargetStatus.OpenTeam2) {
    return TeamColours.getForTeam(2);
  }
  return '#d3d3d3';
}

function hitsToMarks(hits: number) {
  if (hits === 1) {
    return 'I';
  } else if (hits === 2) {
    return 'II';
  }

  return '  ';
}

const GREY_ENTIRE_BOARD = {
  '1': '#d3d3d3',
  '2': '#d3d3d3',
  '3': '#d3d3d3',
  '4': '#d3d3d3',
  '5': '#d3d3d3',
  '6': '#d3d3d3',
  '7': '#d3d3d3',
  '8': '#d3d3d3',
  '9': '#d3d3d3',
  '10': '#d3d3d3',
  '11': '#d3d3d3',
  '12': '#d3d3d3',
  '13': '#d3d3d3',
  '14': '#d3d3d3',
  '15': '#d3d3d3',
  '16': '#d3d3d3',
  '17': '#d3d3d3',
  '18': '#d3d3d3',
  '19': '#d3d3d3',
  '20': '#d3d3d3',
}