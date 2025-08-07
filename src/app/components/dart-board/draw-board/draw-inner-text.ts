import { Theme } from '../theme';
import { Board, getSectorValue } from './board';

const PI2 = Math.PI * 2;

export const drawInnerTexts = (
  board: Board,
  theme: Theme,
  context: CanvasRenderingContext2D,
) => {
  if (!theme.numberShow) {
    return;
  }
  for (let s = 0; s < board.sectors.length; s += 1) {
    drawInnerText(context, board, theme, s);
  }
};

const drawInnerText = (
  context: CanvasRenderingContext2D,
  board: Board,
  theme: Theme,
  i: number,
) => {
  const dartNumber = getSectorValue(board, i);
  const innerText = board.innerText[dartNumber];
  if (!innerText) {
    return;
  }

  const onlyOneText = innerText.length == 1;

  innerText.forEach((item, index) => {

    context.save();

    context.lineWidth = theme.numberWidth;
    const { numberFont, numberSize } = theme;
    context.fillStyle = item.colour;
    context.font = `${numberSize}px ${numberFont}`;

    // Rotate the canvas until we get to the correct sector
    const { sectors } = board;
    const sectorWidth = (Math.PI * 2) / sectors.length;
    const start = onlyOneText ? PI2 / 4 + sectorWidth / 2 : index == 0 ? PI2 / 4 + sectorWidth / 1.5 : PI2 / 4 + sectorWidth / 4;
    const sectorStart = start - sectorWidth * i;
    const numberStart = sectorStart - sectorWidth / 2;
    context.rotate(numberStart);

    // Measure the text to position it in the center of the sector
    const textHeight = context.measureText('N').width;
    const textWidth = context.measureText(item.text).width;
    const radius = board.radius - textHeight / 2 - 30;
    context.translate(radius, 0);

    // Draw the number
    if (theme.wireShadowShow) {
      context.shadowBlur = theme.wireShadowBlur;
      context.shadowColor = theme.wireShadowColor;
      context.shadowOffsetX = theme.wireShadowOffsetX;
      context.shadowOffsetY = theme.wireShadowOffsetY;
    }

    const a = sectorWidth * i;
    const adjust = a > Math.PI / 2 && a < 2 * Math.PI * 0.75 ? 1 : 0;
    const numAngle = Math.PI / 2 + adjust * Math.PI;
    if (item.shouldRotate) {
      context.rotate(numAngle);
    } else {
      // If the text should not rotate, we need to adjust the angle
      // so that it appears upright in the sector
      context.rotate(numAngle + Math.PI / 2);
    }


    context.scale(-1, 1);
    context.fillText(item.text, -(textWidth / 2), textHeight / 2);
    context.restore();
  });


};
