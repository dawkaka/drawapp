import type { Arrow, BoundingBox, CanvasItem, Diamond, Ellipse, Image, Line, MultipleSelection, Pencil, Point, Rectangle, Text } from "../types";
import { getInverseColorForTheme } from "./utils";

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
    ctx.strokeStyle = getInverseColorForTheme(item.strokeStyle)
    ctx.globalAlpha = item.opacity
    ctx.beginPath();
    ctx.moveTo(item.x + item.points[0].x, item.y + item.points[0].y);

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

function rectangleDraw(ctx: CanvasRenderingContext2D, item: Rectangle) {
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = getInverseColorForTheme(item.strokeStyle)
    ctx.fillStyle = getInverseColorForTheme(item.fillStyle)
    ctx.globalAlpha = item.opacity

    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }

    const x = item.width > 0 ? item.x : item.x + item.width,
        y = item.height > 0 ? item.y : item.y + item.height,
        h = Math.abs(item.height),
        w = Math.abs(item.width)
    const r = w < h ? (w / 100) * item.borderRadius : (h / 100) * item.borderRadius

    ctx.beginPath()
    ctx.moveTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + r + (h - r * 2))
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
}


function diamondDraw(ctx: CanvasRenderingContext2D, item: Diamond) {
    ctx.save();
    ctx.lineWidth = item.strokeWidth;
    ctx.strokeStyle = getInverseColorForTheme(item.strokeStyle);
    ctx.fillStyle = getInverseColorForTheme(item.fillStyle)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = item.opacity;
    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
    ctx.beginPath();
    const x = item.width > 0 ? item.x : item.x + item.width,
        y = item.height > 0 ? item.y : item.y + item.height,
        h = Math.abs(item.height),
        w = Math.abs(item.width)

    const verticalAngle = Math.atan(h / w);
    const horizontalAngle = Math.atan(w / h);
    const diagonal = Math.sqrt(w * w + h * h);
    const rVertical = (diagonal / 2 / 100) * item.borderRadius * Math.cos(verticalAngle);
    const rHorizontal = (diagonal / 2 / 100) * item.borderRadius * Math.cos(horizontalAngle);
    ctx.translate(x, y);
    ctx.moveTo(w / 2 - rVertical, rHorizontal);
    ctx.quadraticCurveTo(w / 2, 0, w / 2 + rVertical, rHorizontal);
    ctx.lineTo(w - rVertical, h / 2 - rHorizontal)
    ctx.quadraticCurveTo(w, h / 2, w - rVertical, h / 2 + rHorizontal);
    ctx.lineTo(w / 2 + rVertical, h - rHorizontal)
    ctx.quadraticCurveTo(w / 2, h, w / 2 - rVertical, h - rHorizontal);
    ctx.lineTo(rVertical, h / 2 + rHorizontal)
    ctx.quadraticCurveTo(0, h / 2, rVertical, h / 2 - rHorizontal);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}


function ellipseDraw(ctx: CanvasRenderingContext2D, item: Ellipse) {
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = getInverseColorForTheme(item.strokeStyle)
    ctx.fillStyle = getInverseColorForTheme(item.fillStyle)

    ctx.globalAlpha = item.opacity
    if (item.stroke === "dotted") {
        ctx.setLineDash([2, 5]);
    } else if (item.stroke === "dashed") {
        ctx.setLineDash([20, 15]);
    }
    ctx.beginPath();
    let x = item.x, y = item.y, w = item.width, h = item.height;
    if (item.width < 0) {
        x = item.x + item.width
        w = -item.width
    }
    if (item.height < 0) {
        y = item.y + item.height
        h = - item.height
    }
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 360)
    ctx.fill()
    ctx.stroke();
    ctx.restore();
}

// function calculatePeak(p1: Point, p2: Point, p3: Point): Point {
//     // Calculate the control point for the quadratic Bézier curve
//     const cx = p2.x;
//     const cy = p2.y;

//     // Calculate the coefficients of the quadratic equation for the curve
//     const a = p3.x * (cy - p1.y) + p1.x * (p3.y - cy) + cx * (p1.y - p3.y);
//     const b = p1.x * p1.x + cy * cy - 2 * cy * p1.y + p1.y * p1.y + cx * cx - 2 * cx * p1.x + p3.x * p3.x + p3.y * p3.y - 2 * p3.y * cy;
//     const c = p1.y * cx - p3.x * cy + p3.y * p1.x - p1.y * p3.x - cx * p3.y + cy * p1.x;

//     // Calculate the x-coordinate of the peak point
//     const px = (-1 * b) / (2 * a);

//     // Calculate the y-coordinate of the peak point
//     const py = a * px * px + b * px + c;

//     return { x: px, y: py };
// }

function calculateQuadraticControlPoint(start: Point, peak: Point, end: Point): Point {
    return {
        x: (2 * peak.x) - 0.5 * (start.x + end.x),
        y: (2 * peak.y) - 0.5 * (start.y + end.y),
    };
}


function lineDraw(ctx: CanvasRenderingContext2D, item: Line) {
    if (!item.points || item.points.length < 2) return
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = getInverseColorForTheme(item.strokeStyle)
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
    const startPoint = { x: 0, y: 0 }
    const controlPoint = calculateQuadraticControlPoint(startPoint, points[0], points[1])
    const endPoint = points[1]
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
    ctx.stroke()
    ctx.restore()
}

function arrowDraw(ctx: CanvasRenderingContext2D, item: Arrow) {
    if (!item.points || item.points.length < 2) return
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = getInverseColorForTheme(item.strokeStyle)
    ctx.fillStyle = getInverseColorForTheme(item.strokeStyle)
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
    const startPoint = { x: 0, y: 0 }
    const controlPoint = calculateQuadraticControlPoint(startPoint, points[0], points[1])
    const endPoint = points[1]

    function arrow(x: number, y: number, size: number, angle: number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.moveTo(0, 0);
        ctx.lineTo(size, -1 * size / 2);
        ctx.moveTo(0, 0);
        ctx.lineTo(size, size / 2);
        ctx.stroke();
        ctx.restore();
    }

    function triangle(x: number, y: number, size: number, angle: number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath()
        ctx.moveTo(0, 0);
        ctx.lineTo(size, -1 * size / 2);
        ctx.lineTo(size, size / 2);
        ctx.closePath()
        ctx.fillStyle = getInverseColorForTheme("#FFFFFF") === "#FFFFFF" ? "#000000" : "#FFFFFF"
        ctx.fill()
        ctx.stroke();
        ctx.restore();
    }

    function line(x: number, y: number, size: number, angle: number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.moveTo(0, - size / 2);
        ctx.lineTo(0, size / 2);
        ctx.stroke();
        ctx.restore();
    }

    function circle(x: number, y: number, size: number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath()
        const r = Math.min(6, Math.abs(size / 2))
        ctx.arc(0, 0, r, 0, 360)
        ctx.fillStyle = getInverseColorForTheme("#FFFFFF") === "#FFFFFF" ? "#000000" : "#FFFFFF"
        ctx.fill()
        ctx.stroke();
        ctx.restore();
    }

    if (item.structure === "curve") {
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
        ctx.stroke()
        const angle = Math.atan2(endPoint.y - controlPoint.y, endPoint.x - controlPoint.x);
        const angle2 = Math.atan2(controlPoint.y, controlPoint.x);
        const arrowSize = Math.min(15, 0.3 * (Math.max(Math.abs(endPoint.y - points[0].y), Math.abs(endPoint.x - points[0].x))))

        if (item.head !== "none") {
            if (item.head === "arrow") {
                arrow(0, 0, arrowSize, angle2)
            } else if (item.head === "triangle") {
                triangle(0, 0, arrowSize, angle2)
            } else if (item.head === "line") {
                line(0, 0, arrowSize, angle2)
            } else {
                circle(0, 0, arrowSize)
            }
        }

        if (item.tail !== "none") {
            if (item.tail === "arrow") {
                arrow(endPoint.x, endPoint.y, 0 - arrowSize, angle)
            } else if (item.tail === "triangle") {
                triangle(endPoint.x, endPoint.y, 0 - arrowSize, angle)
            } else if (item.tail === "line") {
                line(endPoint.x, endPoint.y, 0 - arrowSize, angle)
            } else {
                circle(endPoint.x, endPoint.y, arrowSize)
            }
        }

    } else {
        let center = { x: endPoint.x, y: 0 }

        ctx.lineTo(center.x, center.y)
        ctx.lineTo(endPoint.x, endPoint.y)
        ctx.stroke()

        const arrowSize = Math.min(15, 0.5 * Math.min(Math.abs(endPoint.y), Math.abs(center.x)))
        if (item.head !== "none") {
            let angle = -180 * Math.PI / 180
            if (endPoint.x > 0) {
                angle = 0
            }
            if (item.head === "arrow") {
                arrow(0, 0, arrowSize, angle)
            } else if (item.head === "triangle") {
                triangle(0, 0, arrowSize, angle)
            } else if (item.head === "line") {
                line(0, 0, arrowSize, angle)
            } else {
                circle(0, 0, arrowSize)
            }
        }

        if (item.tail !== "none") {
            let angle = -90 * Math.PI / 180
            if (endPoint.y > 0) {
                angle = 90 * Math.PI / 180
            }
            if (item.tail === "arrow") {
                arrow(endPoint.x, endPoint.y, -arrowSize, angle)
            } else if (item.tail === "triangle") {
                triangle(endPoint.x, endPoint.y, -arrowSize, angle)
            } else if (item.tail === "line") {
                line(endPoint.x, endPoint.y, -arrowSize, angle)
            } else {
                circle(endPoint.x, endPoint.y, arrowSize)
            }
        }
    }

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
        case "pencil":
        case "image":
        case "text":
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
            ctx.save()
            ctx.strokeStyle = "darkorange"
            ctx.fillStyle = "white"

            ctx.translate(bounds.x, bounds.y)
            ctx.beginPath()
            ctx.moveTo(0, 0)
            var startPoint = { x: 0, y: 0 }
            var controlPoint = calculateQuadraticControlPoint(startPoint, bounds.curveControl, { x: bounds.width, y: bounds.height })
            var endPoint = { x: bounds.width, y: bounds.height }
            ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)

            ctx.stroke()

            ctx.beginPath()
            ctx.arc(0, 0, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(bounds.width, bounds.height, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(bounds.curveControl.x, bounds.curveControl.y, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            ctx.restore()

            break;
        case "arrow":
            ctx.save()
            ctx.strokeStyle = "darkorange"
            ctx.fillStyle = "white"
            ctx.translate(bounds.x, bounds.y)
            ctx.beginPath()
            ctx.moveTo(0, 0)
            var startPoint = { x: 0, y: 0 }
            var controlPoint = calculateQuadraticControlPoint(startPoint, bounds.curveControl, { x: bounds.width, y: bounds.height })
            var endPoint = { x: bounds.width, y: bounds.height }
            if (bounds.structure === "curve") {
                ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
            } else {
                let center = { x: endPoint.x, y: 0 }
                ctx.lineTo(center.x, center.y)
                ctx.lineTo(endPoint.x, endPoint.y)
            }

            ctx.stroke()

            ctx.beginPath()
            ctx.arc(0, 0, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(bounds.width, bounds.height, 5, 0, 360)
            ctx.stroke()
            ctx.fill()

            if (bounds.structure === "curve") {
                ctx.beginPath()
                ctx.arc(bounds.curveControl.x, bounds.curveControl.y, 5, 0, 360)
                ctx.stroke()
                ctx.fill()
            }

            ctx.restore()

            break;
        default:
            break;
    }
    ctx.restore()
}

function textDraw(ctx: CanvasRenderingContext2D, item: Text) {
    ctx.save()
    ctx.lineWidth = item.strokeWidth
    ctx.strokeStyle = getInverseColorForTheme(item.strokeStyle)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.fillStyle = getInverseColorForTheme(item.strokeStyle)
    ctx.globalAlpha = item.opacity
    ctx.font = `${item.fontSize}px ${item.fontFamily}`
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