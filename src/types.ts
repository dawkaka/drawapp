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

export interface Pencil extends Linear {
    type: "pencil"
}

export interface Line extends Linear {
    type: "line"
}

export interface Box extends CanvasItemConstants {
    strokeWidth: StrokeWidth;
    strokeStyle: string;
    fillStyle: string;
    edgesType: "sharp" | "round"
}

export type CanvasItem = Pencil | Line


export type Tool = "select" | "rectangle" | "ellipse" | "diamond" | "image" | "arrow" | "line" | "text" | "eraser" | "pencil"