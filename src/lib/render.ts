import type { Arrow, BoundingBox, CanvasItem, Diamond, Ellipse, Image, Line, MultipleSelection, Pencil, Rectangle, Text } from "../types";

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
    ctx.moveTo(item.x, item.y);

    // Loop through the points and draw a line to each one
    for (let i = 1; i < item.points.length; i++) {
        // Calculate the control points for this segment
        const cp1 = {
            x: (item.x + item.points[i - 1].x + item.x + item.points[i].x) / 2,
            y: (item.y + item.points[i - 1].y + item.y + item.points[i].y) / 2
        };
        const cp2 = {
            x: cp1.x + (Math.random() * 2 - 1) * item.strokeWidth * 0.2,
            y: cp1.y + (Math.random() * 2 - 1) * item.strokeWidth * 0.2
        };

        // Draw a Bezier curve to the next point
        ctx.bezierCurveTo(cp2.x, cp2.y, cp1.x, cp1.y, item.x + item.points[i].x, item.y + item.points[i].y);
    }

    // Stroke the path
    ctx.stroke();
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
    ctx.strokeStyle = "darkorange"
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    switch (bounds.type) {
        case "rectangle":
        case "ellipse":
        case "diamond":
        case "image":
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height)
            for (let v of Object.values(bounds.resizeAreas)) {
                ctx.save()
                ctx.strokeStyle = "darkorange"
                ctx.fillStyle = "white"
                ctx.lineWidth = 3
                ctx.beginPath()
                ctx.arc(v.x + 5, v.y + 5, 5, 0, 360)
                ctx.stroke()
                ctx.fill()
                ctx.restore()

            }
            break;
        case "line":
        case "arrow":
            ctx.save()
            ctx.strokeStyle = "darkorange"
            ctx.fillStyle = "white"

            ctx.beginPath()
            ctx.moveTo(bounds.x, bounds.y)
            ctx.lineTo(bounds.x + bounds.width, bounds.y + bounds.height)
            ctx.stroke()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(bounds.x, bounds.y, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(bounds.x + bounds.width, bounds.y + bounds.height, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(bounds.curveControl.x, bounds.curveControl.y, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            ctx.restore()

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

export function drawSelection(ctx: CanvasRenderingContext2D, selection: { x: number, y: number, w: number, h: number }) {
    const { x, y, w, h } = selection
    ctx.save()
    ctx.strokeStyle = "darkorange"
    ctx.fillStyle = "darkorange"
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.globalAlpha = 0.05
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.stroke()
    ctx.restore()
}

export function drawMultipleSelectionBounds(ctx: CanvasRenderingContext2D, selection: MultipleSelection) {
    const { x, y, width: w, height: h } = selection
    ctx.save()
    ctx.strokeStyle = "darkorange"
    ctx.setLineDash([5, 5]);
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.stroke()
    ctx.restore()

    for (let v of Object.values(selection.resizeAreas)) {
        ctx.save()
        ctx.strokeStyle = "darkorange"
        ctx.fillStyle = "white"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(v.x + 5, v.y + 5, 5, 0, 360)
        ctx.stroke()
        ctx.fill()
        ctx.restore()

    }

}