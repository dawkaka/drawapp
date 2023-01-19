import { Point } from "../types";

export function renderPencilDrawing(ctx: CanvasRenderingContext2D, points: Point[]) {
    ctx.beginPath();
    ctx.lineWidth = 3
    ctx.strokeStyle = "solid"
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    for (let i = 0; i < points.length; i += 3) {
        let point = points[i];
        if (i + 4 < points.length) {
            ctx.bezierCurveTo(points[i + 1].x, points[i + 1].y, points[i + 2].x, points[i + 2].y, points[i + 3].x, points[i + 3].y)
            ctx.moveTo(points[i + 3].x, points[i + 3].y);
        }
    }
    ctx.stroke()
}