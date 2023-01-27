export type Color = {
    color: string;
    hex: string
}

export interface AppState {
    strokeColor: string,
    strokeWidth: StrokeWidth,
    tool: Tool,
    stroke: Stroke,
    fillColor: string,
    imageBlob: string,
    opacity: number,
    selectedItemID: string,
    fontFamily: string,
    fontSize: number,
    textStyle: "fill" | "stroke"
}

export type Point = {
    x: number,
    y: number
}

interface CanvasItemConstants {
    id: string
    width: number;
    height: number;
    x: number;
    y: number;
    opacity: number
}

export type StrokeWidth = 2 | 3 | 4
export type Stroke = "dashed" | "solid" | "dotted"

export interface Linear extends CanvasItemConstants {
    points: Point[];
    strokeWidth: StrokeWidth;
    strokeStyle: string;
    stroke: Stroke
}

export interface Box extends CanvasItemConstants {
    strokeWidth: StrokeWidth;
    strokeStyle: string;
    fillStyle: string;
    edgesType: "sharp" | "round";
    stroke: Stroke
}


export interface Pencil extends Omit<Linear, "stroke"> {
    type: "pencil"
}

export interface Line extends Linear {
    type: "line"
}

export interface Arrow extends Linear {
    type: "arrow"
}

export interface Rectangle extends Box {
    type: "rectangle"
}

export interface Diamond extends Box {
    type: "diamond"
}

export interface Ellipse extends Omit<Box, "edgesType"> {
    type: "ellipse"
}

export interface Image extends Omit<Box, "stroke"> {
    type: "image",
    data: string
}

export interface Text extends CanvasItemConstants {
    type: "text"
    text: string,
    textStyle: "fill" | "stroke",
    fontFamily: string,
    fontSize: number
}

export type CanvasItem = Pencil | Line | Rectangle | Diamond | Ellipse | Arrow | Image | Text

type RectBounds = { x: number, y: number, width: number, height: number }

export type BoundingBox = RectBounds & {
    type: "rectangle" | "ellipse" | "diamond",
    resizeAreas: { ptl: RectBounds, ptr: RectBounds, pbl: RectBounds, pbr: RectBounds, mt: RectBounds, mr: RectBounds, mb: RectBounds, ml: RectBounds }
} |
    RectBounds & {
        type: "arrow" | "line",
        curveControl: Point
    }

type BoxSelection = {
    type: "rectangle" | "ellipse" | "diamond";
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    strokeWidth: number;
}

type LinearSelection = {
    type: "line" | "arrow"
    id: string;
    x: number;
    y: number;
    points: Point[];
    strokeWidth: number
}

export type SelectedItem = BoxSelection | LinearSelection

export type Tool = "select" | "rectangle" | "ellipse" | "diamond" | "image" | "arrow" | "line" | "text" | "eraser" | "pencil"


export interface CurrentState {
    line: Line, pencil: Pencil, rectangle: Rectangle,
    diamond: Diamond, ellipse: Ellipse,
    arrow: Arrow, image: Image,
    text: Text
}

export type LayerMoves = "to-back" | "step-backward" | "to-front" | "step-forward"