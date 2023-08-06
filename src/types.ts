export type Color = {
  color: string;
  hex: string;
};

export interface AppState {
  strokeColor: string;
  strokeWidth: StrokeWidth;
  tool: Tool;
  stroke: Stroke;
  fillColor: string;
  borderRadius: number;
  imageBlob: string;
  opacity: number;
  multipleSelections: string[];
  selectedItemID: string;
  fontFamily: string;
  fontSize: number;
  textStyle: 'fill' | 'stroke';
  textAlign: 'center' | 'left' | 'right';
  textBold: boolean;
  textItalic: boolean;
  textUnderline: boolean;
  textStrikethrough: boolean;
  arrowStructure: 'curve' | 'sharp';
  arrowHead: ArrowHead;
  arrowTail: ArrowHead;
}

export type Point = {
  x: number;
  y: number;
};

interface CanvasItemConstants {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  opacity: number;
}

export type StrokeWidth = 2 | 3 | 4;
export type Stroke = 'dashed' | 'solid' | 'dotted';

export interface Linear extends CanvasItemConstants {
  points: Point[];
  strokeWidth: StrokeWidth;
  strokeStyle: string;
  stroke: Stroke;
}

export interface Box extends CanvasItemConstants {
  strokeWidth: StrokeWidth;
  strokeStyle: string;
  fillStyle: string;
  edgesType: 'sharp' | 'round';
  stroke: Stroke;
}

export interface Pencil extends Omit<Linear, 'stroke'> {
  type: 'pencil';
}

export interface Line extends Linear {
  type: 'line';
}

export type ArrowHead = 'arrow' | 'triangle' | 'line' | 'circle' | 'none';

export interface Arrow extends Linear {
  type: 'arrow';
  structure: 'curve' | 'sharp';
  head: ArrowHead;
  tail: ArrowHead;
}

export interface Rectangle extends Box {
  type: 'rectangle';
  borderRadius: number;
}

export interface Diamond extends Box {
  type: 'diamond';
  borderRadius: number;
}

export interface Ellipse extends Omit<Box, 'edgesType'> {
  type: 'ellipse';
}

export interface Image extends CanvasItemConstants {
  type: 'image';
  data: string;
}

export interface Text extends CanvasItemConstants {
  type: 'text';
  text: string;
  strokeWidth: StrokeWidth;
  strokeStyle: string;
  fillStyle: string;
  textStyle: 'fill' | 'stroke';
  fontFamily: string;
  fontSize: number;
  alignment: 'center' | 'left' | 'right';
  textBold: boolean;
  textItalic: boolean;
  textUnderline: boolean;
  textStrikethrough: boolean;
}

export type CanvasItem =
  | Pencil
  | Line
  | Rectangle
  | Diamond
  | Ellipse
  | Arrow
  | Image
  | Text;

export type RectBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BoundingBox =
  | (RectBounds & {
    type: 'rectangle' | 'ellipse' | 'diamond' | 'pencil';
    resizeAreas: {
      ptl: RectBounds;
      ptr: RectBounds;
      pbl: RectBounds;
      pbr: RectBounds;
      mt: RectBounds;
      mr: RectBounds;
      mb: RectBounds;
      ml: RectBounds;
    };
  })
  | (RectBounds & {
    type: 'line';
    curveControl: Point;
  })
  | (RectBounds & {
    type: 'arrow' | 'line';
    curveControl: Point;
    structure: 'curve' | 'sharp';
  })
  | (RectBounds & {
    type: 'image' | 'text';
    resizeAreas: {
      ptl: RectBounds;
      ptr: RectBounds;
      pbl: RectBounds;
      pbr: RectBounds;
    };
  });

type BoxSelection = {
  type: 'rectangle' | 'ellipse' | 'diamond' | 'image';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
};

type LinearSelection = {
  type: 'line' | 'arrow' | 'pencil';
  id: string;
  x: number;
  y: number;
  points: Point[];
  strokeWidth: number;
};

type TextSelection = {
  type: 'text';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
};

export type SelectedItem = BoxSelection | LinearSelection | TextSelection;

type DrawingTools =
  | 'rectangle'
  | 'ellipse'
  | 'diamond'
  | 'image'
  | 'arrow'
  | 'line'
  | 'text'
  | 'pencil';
export type NonDrawingTools = 'select' | 'move' | 'eraser';

export type Tool = NonDrawingTools | DrawingTools;

export interface CurrentState {
  line: Line;
  pencil: Pencil;
  rectangle: Rectangle;
  diamond: Diamond;
  ellipse: Ellipse;
  arrow: Arrow;
  image: Image;
  text: Text;
}

export type CurrentStateMap = {
  [key in DrawingTools]: CurrentState[key];
};

export type LayerMoves =
  | 'to-back'
  | 'step-backward'
  | 'to-front'
  | 'step-forward';

export interface ResizePoints {
  tl: Point;
  tr: Point;
  bl: Point;
  br: Point;
}

export interface MultipleSelection extends RectBounds {
  resizeAreas: ResizePoints;
}
