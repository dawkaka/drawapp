import type { Arrow, BoundingBox, CanvasItem, Diamond, Ellipse, Image, Line, Pencil, Rectangle, Text } from "../types";

let imageData: any = {}

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
        case "text":
            textDraw(ctx, item)
        default:
            break;
    }
}


export async function renderElements(ctx: CanvasRenderingContext2D, items: CanvasItem[]) {
    const ims = items.filter(item => item.type === "image") as Image[]
    if (ims.length > Object.keys(imageData).length) {
        imageData = await loadImages(ims) as any
    }

    items.forEach(item => {
        switch (item.type) {
            case "pencil":
                pencilDraw(ctx, item);
                break;
            case "line":
                lineDraw(ctx, item);
                break;
            case "rectangle":
                rectangleDraw(ctx, item);
                break;
            case "diamond":
                diamondDraw(ctx, item);
                break;
            case "ellipse":
                ellipseDraw(ctx, item);
                break;
            case "arrow":
                arrowDraw(ctx, item);
                break;
            case "text":
                textDraw(ctx, item);
                break;
            case "image":
                imageDraw(ctx, item, imageData[item.id]);
                break;
            default:
                break;
        }
    });
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
    ctx.translate(item.x, item.y)
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(points[0].x, points[0].y, points[1].x, points[1].y)
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
    ctx.quadraticCurveTo(points[0].x, points[0].y, points[1].x, points[1].y)
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

export function renderBounds(ctx: CanvasRenderingContext2D, bounds: BoundingBox) {
    ctx.save()
    ctx.lineWidth = 3
    ctx.strokeStyle = "darkorange"
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    switch (bounds.type) {
        case "rectangle":
        case "ellipse":
        case "diamond":
        case "image":
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height)
            for (let p of Object.values(bounds.resizeAreas)) {
                ctx.strokeRect(p.x, p.y, p.width, p.height)
            }
            break;
        case "line":
        case "arrow":
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height)
            ctx.strokeRect(bounds.x - 5, bounds.y - 5, 10, 10)
            ctx.strokeRect(bounds.x + bounds.width - 5, bounds.y + bounds.height - 5, 10, 10)
            ctx.strokeRect(bounds.curveControl.x - 5, bounds.curveControl.y - 5, 10, 10)
            break;
        case "text":
            ctx.strokeRect(bounds.x, bounds.y - 10, bounds.width, bounds.height)
            break
        default:
            break;
    }
    ctx.restore()
}

function textDraw(ctx: CanvasRenderingContext2D, item: Text) {
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = item.strokeStyle
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.fillStyle = item.strokeStyle
    ctx.globalAlpha = item.opacity
    ctx.font = `bold ${item.fontSize}px ${item.fontFamily}`
    const texts = item.text.split("\n")
    let h = 0
    for (let text of texts) {
        let x = item.x
        if (item.alignment === "right") {
            x = item.x + (item.width - ctx.measureText(text).width)
        } else if (item.alignment === "center") {
            x = item.x + (item.width - ctx.measureText(text).width) / 2
        }
        ctx.fillText(text, x, item.y + h + item.fontSize / 2)
        h += item.fontSize
    }
    ctx.restore()
}

function imageDraw(ctx: CanvasRenderingContext2D, item: Image, imageData: HTMLImageElement) {
    ctx.save();
    ctx.globalAlpha = item.opacity;
    ctx.scale(item.width < 0 ? -1 : 1, item.height < 0 ? -1 : 1)
    ctx.drawImage(imageData, item.width < 0 ? -item.x - item.width : item.x, item.height < 0 ? -item.y - item.height : item.y, item.width, item.height);
    ctx.restore();
}

function loadImages(images: Image[]) {
    let data: any = {
    }
    return new Promise((resolve, reject) => {

        for (let im of images) {
            const image = new Image();
            image.src = im.data;
            image.onload = function () {
                data[im.id] = image
                if (Object.keys(data).length === images.length) {
                    resolve(data)
                }
            };
            image.onerror = function (error) {
                reject(error);
            };
        }
    });
}