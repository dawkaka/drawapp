import { CanvasItem, Line, Linear, Pencil, Point } from "../types";

export function renderCurrentDrawing(ctx: CanvasRenderingContext2D, item: Pencil | Line) {
    ctx.save()
    switch (item.type) {
        case "pencil":
            pencilDraw(ctx, item)
            break;
        case "line":
            lineDraw(ctx, item)
        default:
            break;
    }
    ctx.restore()
}


export function renderElements(ctx: CanvasRenderingContext2D, items: CanvasItem[]) {
    items.forEach(item => {
        ctx.save()
        switch (item.type) {
            case "pencil":
                pencilDraw(ctx, item)
                break;
            case "line":
                lineDraw(ctx, item)
            default:
                break;
        }
        ctx.restore()
    })
}


function pencilDraw(ctx: CanvasRenderingContext2D, item: Pencil) {
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
}

function lineDraw(ctx: CanvasRenderingContext2D, item: Line) {
    if (!item.points || item.points.length < 2) return
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = item.strokeStyle
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath();
    const points = item.points
    ctx.moveTo(item.x, item.y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.stroke()
}