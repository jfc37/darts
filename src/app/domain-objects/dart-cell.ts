export enum DartCell {
    SingleInner = 2,
    SingleOuter = 4,
    Double = 5,
    Triple = 3,
    OuterBullsEye = 1,
    InnererBullsEye = 0,
}

export const DART_CELL_TEXT = {
    [DartCell.SingleInner]: 'single',
    [DartCell.SingleOuter]: 'single',
    [DartCell.Double]: 'double',
    [DartCell.Triple]: 'triple',
    [DartCell.OuterBullsEye]: 'outer bulls eye',
    [DartCell.InnererBullsEye]: 'inner bulls eye',
}

export const VERBOSE_DART_CELL_TEXT = {
    [DartCell.SingleInner]: 'single inner',
    [DartCell.SingleOuter]: 'single outer',
    [DartCell.Double]: 'double',
    [DartCell.Triple]: 'triple',
    [DartCell.OuterBullsEye]: 'outer bulls eye',
    [DartCell.InnererBullsEye]: 'inner bulls eye',
}