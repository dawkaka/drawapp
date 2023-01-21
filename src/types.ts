export type Color = {
    color: string;
    hex: string
}

export interface AppState {
    strokeColor: string,
    strokeWidth: StrokeWidth,
    tool: Tool,
    fillColor: string,
}

export type Point = {
    x: number,
    y: number
}

interface CanvasItemConstants {
    width: number;
    height: number;
    x: number;
    y: number;
}

export type StrokeWidth = 2 | 3 | 4

export interface Linear extends CanvasItemConstants {
    points: Point[];
    strokeWidth: StrokeWidth;
    strokeStyle: string
}

export interface Box extends CanvasItemConstants {
    strokeWidth: StrokeWidth;
    strokeStyle: string;
    fillStyle: string;
    edgesType: "sharp" | "round"
}


export interface Pencil extends Linear {
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

export type CanvasItem = Pencil | Line | Rectangle | Diamond | Ellipse | Arrow


export type Tool = "select" | "rectangle" | "ellipse" | "diamond" | "image" | "arrow" | "line" | "text" | "eraser" | "pencil"


export interface CurrentState { line: Line, pencil: Pencil, rectangle: Rectangle, diamond: Diamond, ellipse: Ellipse, arrow: Arrow }