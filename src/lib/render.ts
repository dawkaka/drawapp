import { Arrow, CanvasItem, Diamond, Ellipse, Line, Linear, Pencil, Point, Rectangle } from "../types";

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
        case "diamond":
            diamondDraw(ctx, item)
            break;
        case "ellipse":
            ellipseDraw(ctx, item)
            break;
        case "arrow":
            arrowDraw(ctx, item)
            break;
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
            case "diamond":
                diamondDraw(ctx, item)
                break
            case "ellipse":
                ellipseDraw(ctx, item)
                break;
            case "arrow":
                arrowDraw(ctx, item)
                break;
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
    ctx.globalAlpha = item.opacity
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
    ctx.globalAlpha = item.opacity
    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
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
    ctx.globalAlpha = item.opacity

    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
    ctx.beginPath()
    ctx.rect(item.x, item.y, item.width, item.height)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
}


function diamondDraw(ctx: CanvasRenderingContext2D, item: Diamond) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = item.strokeStyle
    ctx.fillStyle = item.fillStyle
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.globalAlpha = item.opacity
    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
    ctx.beginPath();
    ctx.moveTo(item.width / 2, 0)
    ctx.lineTo(item.width, item.height / 2);
    ctx.lineTo(item.width / 2, item.height);
    ctx.lineTo(0, item.height / 2)
    ctx.closePath();
    ctx.fill()
    ctx.stroke();
    ctx.restore();
}

function ellipseDraw(ctx: CanvasRenderingContext2D, item: Ellipse) {
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = item.strokeStyle
    ctx.fillStyle = item.fillStyle
    ctx.globalAlpha = item.opacity
    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
    ctx.beginPath();
    ctx.ellipse(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, item.height / 2, 0, 0, 360)
    ctx.fill()
    ctx.stroke();
    ctx.restore();
}

function arrowDraw(ctx: CanvasRenderingContext2D, item: Arrow) {
    if (!item.points || item.points.length < 2) return
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = item.strokeStyle
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.globalAlpha = item.opacity
    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
    ctx.beginPath();
    const points = item.points
    ctx.translate(item.x, item.y)
    ctx.moveTo(0, 0)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.save();
    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
    ctx.translate(points[1].x, points[1].y);
    let angle = Math.atan2(points[1].y, points[1].x)
    ctx.rotate(angle);
    ctx.moveTo(0, 0);
    const five = 0.3 * (Math.max(Math.abs(points[1].y), Math.abs(points[1].x)))
    ctx.lineTo(Math.max(-five, -25), Math.max(-1 * (five * 0.4), -10));
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.max(-five, -25), Math.min(five * 0.4, 10));
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}