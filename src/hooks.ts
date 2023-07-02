import { useAtom } from 'jotai';
import { AppState } from './jotai';
import { CurrentStateMap } from './types';

export function useInitialState() {
  const [mainState] = useAtom(AppState);
  const initialState: CurrentStateMap = {
    line: {
      id: '',
      type: 'line',
      points: [{ x: 0, y: 0 }],
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      strokeStyle: mainState.strokeColor,
      strokeWidth: mainState.strokeWidth,
      stroke: mainState.stroke,
      opacity: mainState.opacity,
    },
    pencil: {
      id: '',
      type: 'pencil',
      points: [{ x: 0, y: 0 }],
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      strokeStyle: mainState.strokeColor,
      strokeWidth: mainState.strokeWidth,
      opacity: mainState.opacity,
    },
    rectangle: {
      id: '',
      type: 'rectangle',
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      strokeStyle: mainState.strokeColor,
      strokeWidth: mainState.strokeWidth,
      fillStyle: mainState.fillColor,
      edgesType: 'sharp',
      borderRadius: mainState.borderRadius,
      stroke: mainState.stroke,
      opacity: mainState.opacity,
    },
    diamond: {
      id: '',
      type: 'diamond',
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      strokeStyle: mainState.strokeColor,
      strokeWidth: mainState.strokeWidth,
      fillStyle: mainState.fillColor,
      edgesType: 'sharp',
      stroke: mainState.stroke,
      borderRadius: mainState.borderRadius,
      opacity: mainState.opacity,
    },
    ellipse: {
      id: '',
      type: 'ellipse',
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      strokeStyle: mainState.strokeColor,
      strokeWidth: mainState.strokeWidth,
      fillStyle: mainState.fillColor,
      stroke: mainState.stroke,
      opacity: mainState.opacity,
    },
    arrow: {
      id: '',
      type: 'arrow',
      points: [{ x: 0, y: 0 }],
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      strokeStyle: mainState.strokeColor,
      strokeWidth: mainState.strokeWidth,
      stroke: mainState.stroke,
      opacity: mainState.opacity,
      head: mainState.arrowHead,
      tail: mainState.arrowTail,
      structure: mainState.arrowStructure,
    },
    image: {
      id: '',
      type: 'image',
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      data: mainState.imageBlob,
      opacity: mainState.opacity,
    },
    text: {
      id: '',
      opacity: mainState.opacity,
      type: 'text',
      width: 0,
      height: 0,
      x: -1000,
      y: -1000,
      text: '',
      textStyle: mainState.textStyle,
      fontFamily: mainState.fontFamily,
      fontSize: mainState.fontSize,
      strokeWidth: mainState.strokeWidth,
      strokeStyle: mainState.strokeColor,
      fillStyle: mainState.fillColor,
      alignment: mainState.textAlign,
      textBold: mainState.textBold,
      textItalic: mainState.textItalic,
      textStrikethrough: mainState.textStrikethrough,
      textUnderline: mainState.textUnderline,
    },
  };
  return initialState;
}
