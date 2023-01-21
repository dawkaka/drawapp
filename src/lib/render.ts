import { CanvasItem, Diamond, Line, Linear, Pencil, Point, Rectangle } from "../types";

export function renderCurrentDrawing(ctx: CanvasRenderingContext2D, item: CanvasItem) {
    switch (item.type) {
        case "pencil":
            pencilDraw(ctx, item)
            break;
        case "line":
            lineDraw(ctx, item)
            break;
        case "rectangle":
            rectangleDraw(ctx, item)
            break
        default:
            break;
    }
}


export function renderElements(ctx: CanvasRenderingContext2D, items: CanvasItem[]) {
    items.forEach(item => {
        switch (item.type) {
            case "pencil":
                pencilDraw(ctx, item)
                break;
            case "line":
                lineDraw(ctx, item)
                break;
            case "rectangle":
                rectangleDraw(ctx, item)
                break
            default:
                break;
        }
    })
}


function pencilDraw(ctx: CanvasRenderingContext2D, item: Pencil) {
    ctx.save()
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
    ctx.restore()
}

function lineDraw(ctx: CanvasRenderingContext2D, item: Line) {
    if (!item.points || item.points.length < 2) return
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = item.strokeStyle
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath();
    const points = item.points
    ctx.moveTo(item.x, item.y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.stroke()
    ctx.restore()
}

function rectangleDraw(ctx: CanvasRenderingContext2D, item: Rectangle) {
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = item.strokeStyle
    ctx.fillStyle = item.fillStyle
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.rect(item.x, item.y, item.width, item.height)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
}


function diamondDraw(ctx: CanvasRenderingContext2D, item: Diamond) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.beginPath();
    ctx.moveTo(0, item.height / 2);
    ctx.lineTo(item.width / 2, 0);
    ctx.lineTo(0, -1 * item.height / 2);
    ctx.lineTo(-1 * item.width / 2, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}