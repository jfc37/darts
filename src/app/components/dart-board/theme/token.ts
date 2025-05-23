import { Theme } from './theme';

export const enum Token {
  canvasBg = '--dartbot-canvas-bg',
  boardBg = '--dartbot-board-bg',
  sectorBg1 = '--dartbot-sector-bg-1',
  sectorBg2 = '--dartbot-sector-bg-2',
  sectorBg3 = '--dartbot-sector-bg-3',
  sectorBg4 = '--dartbot-sector-bg-4',
  wireShow = '--dartbot-wire-show',
  wireWidth = '--dartbot-wire-width',
  wireColor = '--dartbot-wire-color',
  wireShadowShow = '--dartbot-wire-shadow-show',
  wireShadowColor = '--dartbot-wire-shadow-color',
  wireShadowBlur = '--dartbot-wire-shadow-blur',
  wireShadowOffsetX = '--dartbot-wire-shadow-offset-x',
  wireShadowOffsetY = '--dartbot-wire-shadow-offset-y',
  wireRingOffset = '--dartbot-wire-ring-offset',
  numberShow = '--dartbot-number-show',
  numberWidth = '--dartbot-number-width',
  numberColor = '--dartbot-number-color',
  numberFont = '--dartbot-number-font',
  numberSize = '--dartbot-number-size',
  numberInset = '--dartbot-number-inset',
  numberWireShow = '--dartbot-number-wire-show',
  numberWireWidth = '--dartbot-number-wire-width',
  numberWireColor = '--dartbot-number-wire-color',
  hitFillColor = '--dartbot-hit-fill-color',
  hitRadius = '--dartbot-hit-radius',
  hitStokeColor = '--dartbot-hit-stoke-color',
  hitStrokeWidth = '--dartbot-hit-stoke-width',
}

export const tokenDefaults = {
  [Token.canvasBg]: 'transparent',
  [Token.boardBg]: '#080808',
  [Token.sectorBg1]: '#111',
  [Token.sectorBg2]: '#b33',
  [Token.sectorBg3]: '#ffe',
  [Token.sectorBg4]: '#252',
  [Token.wireShow]: '1',
  [Token.wireWidth]: '0.8',
  [Token.wireColor]: '#f1f1f1',
  [Token.wireShadowShow]: '1',
  [Token.wireShadowColor]: '#000',
  [Token.wireShadowBlur]: '2',
  [Token.wireShadowOffsetX]: '0',
  [Token.wireShadowOffsetY]: '0.5',
  [Token.wireRingOffset]: '10',
  [Token.numberShow]: '1',
  [Token.numberWidth]: '1.75',
  [Token.numberColor]: '#f1f1f1',
  [Token.numberFont]: '"Consolas", Monospace',
  [Token.numberSize]: '27',
  [Token.numberInset]: '5',
  [Token.numberWireShow]: '1',
  [Token.numberWireWidth]: '2.5',
  [Token.numberWireColor]: '#f1f1f1',
  [Token.hitRadius]: '4',
  [Token.hitFillColor]: 'rgba(255, 165, 0, 0.65)',
  [Token.hitStokeColor]: '#cc8400',
  [Token.hitStrokeWidth]: '0.3',
};

export const createTheme = (style: CSSStyleDeclaration): Theme => {
  const str = (t: Token) => style.getPropertyValue(t) || tokenDefaults[t];
  const num = (t: Token) => parseFloat(str(t));
  const bool = (t: Token) => str(t) === '1';

  return {
    canvasBackground: str(Token.canvasBg),
    boardBackground: str(Token.boardBg),
    sectorBackground: [
      str(Token.sectorBg1),
      str(Token.sectorBg2),
      str(Token.sectorBg3),
      str(Token.sectorBg4),
    ],
    wireShow: bool(Token.wireShow),
    wireWidth: num(Token.wireWidth),
    wireColor: str(Token.wireColor),
    wireShadowShow: bool(Token.wireShadowShow),
    wireShadowColor: str(Token.wireShadowColor),
    wireShadowBlur: num(Token.wireShadowBlur),
    wireShadowOffsetX: num(Token.wireShadowOffsetX),
    wireShadowOffsetY: num(Token.wireShadowOffsetY),
    wireRingOffset: num(Token.wireRingOffset),
    numberShow: bool(Token.numberShow),
    numberWidth: num(Token.numberWidth),
    numberColor: str(Token.numberColor),
    numberFont: str(Token.numberFont),
    numberSize: num(Token.numberSize),
    numberInset: num(Token.numberInset),
    numberWireShow: bool(Token.numberWireShow),
    numberWireWidth: num(Token.numberWireWidth),
    numberWireColor: str(Token.numberWireColor),
    hitRadius: num(Token.hitRadius),
    hitFillColor: str(Token.hitFillColor),
    hitStokeColor: str(Token.hitStokeColor),
    hitStrokeWidth: num(Token.hitStrokeWidth),
  };
};
