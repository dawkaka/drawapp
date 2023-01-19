export type Color = {
    color: string;
    hex: string
}

export type Point = {
    x: number,
    y: number
}

export type Tool = "select" | "rectangle" | "ellipse" | "diamond" | "image" | "arrow" | "line" | "text" | "eraser" | "pencil"