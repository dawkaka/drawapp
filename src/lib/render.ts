import { CanvasItem, Line, Linear, Pencil, Point } from "../types";

export function renderPencilDrawing(ctx: CanvasRenderingContext2D, item: Pencil | Line) {
    ctx.save()
    console.log(item.type)
    switch (item.type) {
        case "pencil":
            ctx.lineWidth = item.strokeWidth
            ctx.strokeStyle = item.strokeStyle
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.beginPath();
            for (let i = 0; i < item.points.length; i++) {
                let p = item.points[i]
                ctx.lineTo(item.x + p.x, item.y + p.y);
                ctx.moveTo(item.x + p.x, item.y + p.y);
            }
            ctx.stroke()
            break;
        case "line":
            if (!item.points || item.points.length < 2) return
            console.log(item.x, item.y, item.points)
            ctx.lineWidth = item.strokeWidth
            ctx.strokeStyle = item.strokeStyle
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.beginPath();
            const points = item.points
            ctx.moveTo(item.x, item.y)
            ctx.lineTo(points[1].x, points[1].y)
            ctx.stroke()
        default:
            break;
    }
    ctx.restore()
}


export function renderElements(ctx: CanvasRenderingContext2D, items: Linear[]) {
    console.log(items)
}