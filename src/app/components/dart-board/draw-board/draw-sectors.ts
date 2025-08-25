/* eslint-disable prefer-destructuring */
import { Theme } from '../theme';
import { Board, getSectorValue } from './board';

const PI2 = Math.PI * 2;

/**
 * Draw the sectors of the board.
 * @param board Board dimensions
 * @param theme Theme to use for drawing
 * @param context HTML canvas context to draw to
 */
export const drawSectors = (
  board: Board,
  theme: Theme,
  context: CanvasRenderingContext2D,
) => {
  context.save();

  // Draw the board background
  context.beginPath();
  context.arc(0, 0, board.radius, 0, PI2, false);
  context.fillStyle = theme.boardBackground;
  context.fill();

  // Draw the sectors
  for (let s = 0; s < board.sectors.length; s += 1) {
    drawSector(board, theme, context, s);
  }

  // Draw the bullseye
  const c1 = board.outerBullseyeColour ?? theme.sectorBackground[(1 % 2) * 2 + 1];
  const c2 = board.innerBullseyeColour ?? theme.sectorBackground[(0 % 2) * 2 + 1];
  context.fillStyle = c1;
  context.beginPath();
  context.moveTo(0, 0);
  context.arc(0, 0, board.rings[1], 0, PI2);
  context.fill();
  context.beginPath();
  context.moveTo(0, 0);
  context.fillStyle = c2;
  context.arc(0, 0, board.rings[0], 0, PI2);
  context.fill();

  context.restore();
};

const drawSector = (
  board: Board,
  theme: Theme,
  context: CanvasRenderingContext2D,
  s: number,
) => {
  context.save();
  const sectorWidth = PI2 / board.sectors.length;
  const start = PI2 / 4 + sectorWidth / 2;
  const angleStart = start - sectorWidth * s;
  const angleEnd = angleStart - sectorWidth;
  const sectorRadius = board.rings[board.rings.length - 1];

  context.beginPath();
  context.moveTo(0, 0);
  context.arc(0, 0, sectorRadius, angleStart, angleEnd, true);
  context.closePath();
  const sectorBackground = board.sectorColours[getSectorValue(board, s)];
  context.fillStyle = sectorBackground || theme.sectorBackground[(s % 2) * 2];
  context.fill();

  for (let r = 2; r < board.rings.length; r += 1) {
    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, board.rings[r], angleStart, angleEnd, true);
    context.arc(0, 0, board.rings[r - 1], angleEnd, angleStart);
    context.closePath();
    if (r == 3) {
      const color = theme.sectorBackground[(s % 2) * 2 + (r % 2)];
      const tripleColour = board.tripleColours[getSectorValue(board, s)];

      context.fillStyle = tripleColour || color;
      context.fill();
    }
    if (r == 5) {
      const color = theme.sectorBackground[(s % 2) * 2 + (r % 2)];
      const doubleColour = board.doubleColours[getSectorValue(board, s)];

      context.fillStyle = doubleColour || color;
      context.fill();
    }
  }
  context.restore();
};
