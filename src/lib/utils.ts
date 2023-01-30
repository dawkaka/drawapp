import { SetStateAction } from "jotai"
import { AppState, BoundingBox, CanvasItem, LayerMoves, Point, SelectedItem } from "../types"
import { renderBounds } from "./render"

export function getRandomID() {
    const alphabets = "abc8debg7hijkl0mn6GH5IJKLMNo9pq1rstuv2wxy3zABCD4EFOPQRSTUVWSYZ"
    let id = ""
    for (let i = 0; i < 12; i++) {
        let ind = Math.floor(Math.random() * 61)
        id += alphabets[ind]
    }
    return id
}


export function getBoundingBox(item: SelectedItem): BoundingBox | null {
    switch (item.type) {
        case "rectangle":
        case "ellipse":
        case "diamond":
            let sx = item.width < 0 ? item.x + item.strokeWidth + 1 : item.x - item.strokeWidth - 1
            let sy = item.height < 0 ? item.y + item.strokeWidth + 1 : item.y - item.strokeWidth - 1
            let ex = item.width < 0 ? item.width - item.strokeWidth * 2 - 2 : item.width + item.strokeWidth * 2 + 2
            let ey = item.height < 0 ? item.height - item.strokeWidth * 2 - 2 : item.height + item.strokeWidth * 2 + 2
            let ptl = { x: sx - 10, y: sy - 10, width: 10, height: 10 }
            let ptr = { x: sx + ex, y: sy - 10, width: 10, height: 10 }
            let pbl = { x: sx - 10, y: sy + ey, width: 10, height: 10 }
            let pbr = { x: sx + ex, y: sy + ey, width: 10, height: 10 }
            let mt = { x: sx - 5 + ex / 2, y: sy - 10, width: 10, height: 10 }
            let mr = { x: sx + ex, y: sy - 5 + ey / 2, width: 10, height: 10 }
            let mb = { x: sx - 5 + ex / 2, y: sy + ey, width: 10, height: 10 }
            let ml = { x: sx - 10, y: sy - 5 + ey / 2, width: 10, height: 10 }

            return {
                type: item.type,
                x: sx,
                y: sy,
                width: ex,
                height: ey,
                resizeAreas: {
                    ptl, ptr, pbl, pbr,
                    mt, mr, mb, ml
                }
            }
        case "line":
        case "arrow":
            if (item.points.length > 1) {
                return {
                    type: item.type,
                    x: item.x,
                    y: item.y,
                    width: item.points[1].x,
                    height: item.points[1].y,
                    curveControl: { x: item.x + item.points[0].x, y: item.y + item.points[0].y }
                }
            }
            break;
        case "text":
            return {
                type: item.type,
                x: item.x - 10,
                y: item.y - 10,
                width: item.width + 20,
                height: item.height + 20
            }
        case "image":
            return {
                type: item.type,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
                resizeAreas: {
                    ptl: { x: item.x - 10, y: item.y - 10, width: 10, height: 10 },
                    ptr: { x: item.x + item.width, y: item.y - 10, width: 10, height: 10 },
                    pbl: { x: item.x - 10, y: item.height + item.y, width: 10, height: 10 },
                    pbr: { x: item.x + item.width, y: item.height + item.y, width: 10, height: 10 }
                }
            }
        default:
            break;
    }
    return null
}

export function isWithinItem(pointerX: number, pointerY: number, item: SelectedItem) {
    const bounds = getBoundingBox(item)
    if (bounds) {
        let sx = bounds.x
        let sy = bounds.y
        let ex = bounds.width
        let ey = bounds.height
        if (bounds.width < 0 && bounds.height < 0) {
            sx += bounds.width
            ex = -1 * bounds.width
            sy += bounds.height
            ey = -1 * bounds.height
        } else if (bounds.width < 0 && bounds.height > 0) {
            sx += bounds.width
            ex = -1 * bounds.width
            ey = bounds.height
        } else if (bounds.height < 0 && bounds.width > 0) {
            ex = bounds.width
            sy += bounds.height
            ey = -1 * bounds.height
        }
        switch (item.type) {
            case "rectangle":
            case "ellipse":
            case "diamond":
            case "text":
            case "image":
                if (pointerX < sx || pointerY < sy) return false
                if (pointerX > sx + ex || pointerY > sy + ey) return false
                return true
            case "arrow":
            case "line":
                if (pointerX < sx || pointerY < sy) return false
                if (pointerX > sx + ex || pointerY > sy + ey) return false
                return true
            default:
                break;
        }
    }
    return false
}

export function isWithinResizeArea(pointerX: number, pointerY: number, item: SelectedItem) {
    const bounds = getBoundingBox(item)
    if (bounds) {
        switch (bounds.type) {
            case "rectangle":
            case "ellipse":
            case "diamond":
            case "image":
                for (const [key, val] of Object.entries(bounds.resizeAreas)) {
                    if (pointerX > val.x && pointerY > val.y && pointerX < val.x + 10 && pointerY < val.y + 10) {
                        return key
                    }
                }
                break;
            case "arrow":
            case "line":
                if (pointerX > bounds.x - 5 && pointerX < bounds.x + 10 && pointerY > bounds.y - 5 && pointerY < bounds.y + 10) {
                    return "ps"
                }
                if (
                    pointerX - bounds.x > bounds.width - 5 &&
                    pointerX - bounds.x < bounds.width + 10 &&
                    pointerY - bounds.y > bounds.height - 5 &&
                    pointerY - bounds.y < bounds.height + 10
                ) {
                    return "pe"
                }

                if (
                    pointerX > bounds.curveControl.x - 5 &&
                    pointerX < bounds.curveControl.x + 10 &&
                    pointerY > bounds.curveControl.y - 5 &&
                    pointerY < bounds.curveControl.y + 10
                ) {
                    return "pc"
                }
                break
            default:
                break;
        }
    }
    return ""
}

export function moveItem(dX: number, dY: number, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    if (targetIndex > -1) {
        items[targetIndex].x += dX
        items[targetIndex].y += dY
        return [...items]
    }
    return items
}

export function moveItemPosition(type: LayerMoves, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    let temp = items[targetIndex]
    if (type === "step-backward" && targetIndex > 0) {
        items[targetIndex] = items[targetIndex - 1]
        items[targetIndex - 1] = temp
    } else if (type === "step-forward" && targetIndex < items.length - 1) {
        items[targetIndex] = items[targetIndex + 1]
        items[targetIndex + 1] = temp
    } else if (type === "to-back" && targetIndex !== 0) {
        items = items.filter(t => t.id !== item.id)
        items.unshift(temp)
        return items
    } else if (type === "to-front" && targetIndex < items.length - 1) {
        items = items.filter(t => t.id !== item.id)
        items.push(temp)
        return items
    }
    return [...items]
}


export function resizeSelected(dir: string, dx: number, dy: number, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    if (targetIndex === -1) return items
    if (dir === "pbr") {
        items[targetIndex].width += dx
        items[targetIndex].height += dy
        return [...items]
    }
    if (dir === "ptl") {
        items[targetIndex].x += dx
        items[targetIndex].y += dy
        items[targetIndex].width += -1 * dx
        items[targetIndex].height += -1 * dy
        return [...items]
    }
    if (dir === "ptr") {
        items[targetIndex].width += dx
        items[targetIndex].y += dy
        items[targetIndex].height += -1 * dy
        return [...items]
    }
    if (dir === "pbl") {
        items[targetIndex].width += - 1 * dx
        items[targetIndex].height += dy
        items[targetIndex].x += dx
        return [...items]
    }
    if (dir === "mb") {
        items[targetIndex].height += dy
        return [...items]
    }
    if (dir === "mt") {
        items[targetIndex].y += dy
        items[targetIndex].height += - 1 * dy
        return [...items]
    }
    if (dir === "mr") {
        items[targetIndex].width += dx
        return [...items]
    }
    if (dir === "ml") {
        items[targetIndex].x += dx
        items[targetIndex].width += -1 * dx
        return [...items]
    }
    if (dir === "ps") {
        let item = items[targetIndex]
        if (item.type === "arrow" || item.type === "line") {
            items[targetIndex].x += dx
            items[targetIndex].y += dy
            if (item.points.length > 1) {
                const { x, y } = item.points[1]
                item.points[1].x += -dx
                item.points[1].y += -dy
                if (item.points[0].x === x / 2 && item.points[0].y === y / 2) {
                    item.points[0].x += -dx / 2
                    item.points[0].y += -dy / 2
                }
            }
        }
        return [...items]
    }

    if (dir === "pe") {
        let item = items[targetIndex]
        if (item.type === "arrow" || item.type === "line") {
            if (item.points.length > 1) {
                const { x, y } = item.points[1]
                item.points[1].x += dx
                item.points[1].y += dy
                if (item.points[0].x === x / 2 && item.points[0].y === y / 2) {
                    item.points[0].x += dx / 2
                    item.points[0].y += dy / 2
                }
            }
        }
        return [...items]
    }

    // if (dir === "pc") {
    //     let item = items[targetIndex]
    //     if (item.type === "arrow" || item.type === "line") {
    //         if (item.points.length > 1) {
    //             item.points[0].x += dx
    //             item.points[0].y += dy
    //         }
    //     }
    //     return [...items]
    // }
    return items
}

export function getItemEnclosingPoint(pointerX: number, pointerY: number, items: CanvasItem[]): string {

    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i]
        switch (item.type) {
            case "line":
            case "arrow":
                if (
                    isPointInsidePolygon(pointerX, pointerY,
                        { x: item.x - 15, y: item.y },
                        { x: item.x + 15, y: item.y },
                        { x: item.x + item.points[1].x + 15, y: item.y + item.points[1].y },
                        { x: item.x + item.points[1].x - 15, y: item.y + item.points[1].y }
                    )
                ) {
                    return item.id
                }
                break;
            case "diamond":
            case "ellipse":
            case "rectangle":
            case "image":
                if (
                    isPointInsidePolygon(pointerX, pointerY,
                        { x: item.x - 15, y: item.y },
                        { x: item.x + item.width + 15, y: item.y },
                        { x: item.x + item.width + 15, y: item.y + item.height },
                        { x: item.x - 15, y: item.y + item.height }
                    )
                ) {

                    return item.id
                }
                break;
            case "text":
                if (
                    isPointInsidePolygon(pointerX, pointerY,
                        { x: item.x, y: item.y },
                        { x: item.x + item.width, y: item.y },
                        { x: item.x + item.width, y: item.y + item.height },
                        { x: item.x, y: item.y + item.height }
                    )
                ) {

                    return item.id
                }

            default:
                break;
        }

    }
    return ""
}


function isPointInsidePolygon(cx: number, cy: number, p1: Point, p2: Point, p3: Point, p4: Point): boolean {
    //==by chatGPT
    const polygon = [p1, p2, p3, p4]
    let point = { x: cx, y: cy }
    let intersections = 0;
    for (let i = 0; i < polygon.length; i++) {
        let p1 = polygon[i];
        let p2 = polygon[(i + 1) % polygon.length];

        // Check if point is on an edge
        if (point.y > Math.min(p1.y, p2.y) && point.y <= Math.max(p1.y, p2.y) && point.x < Math.max(p1.x, p2.x)) {
            let xIntersection = (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;

            // Check if point is on a vertex
            if (xIntersection == point.x) {
                return true;
            }
            // Check if point is to the left of the edge
            if (xIntersection > point.x) {
                intersections++;
            }
        }
    }
    return intersections % 2 != 0;
}


export function getSelectedItem(id: string, items: CanvasItem[]): CanvasItem | undefined {
    return items.find(item => item.id === id)
}

export function updateSingleItem(id: string, newVAlue: CanvasItem, items: CanvasItem[]): CanvasItem[] {
    const targetIndex = items.findIndex(item => item.id === id)
    if (targetIndex >= 0) {
        items[targetIndex] = newVAlue
        return [...items]
    }
    return items
}

export function deleteItem(id: string, items: CanvasItem[]): CanvasItem[] {
    return items.filter(item => item.id !== id)
}

export function updateAppStateFromSelectedItem(setState: (update: SetStateAction<AppState>) => void, currentState: AppState, item: CanvasItem) {
    switch (item.type) {
        case "diamond":
        case "ellipse":
        case "rectangle":
            setState({
                ...currentState,
                strokeColor: item.strokeStyle,
                fillColor: item.fillStyle,
                strokeWidth: item.strokeWidth,
                opacity: item.opacity,
                stroke: item.stroke,
                tool: item.type
            })
            break;
        case "text":
            setState({
                ...currentState,
                strokeColor: item.strokeStyle,
                fillColor: item.fillStyle,
                strokeWidth: item.strokeWidth,
                opacity: item.opacity,
                fontFamily: item.fontFamily,
                fontSize: item.fontSize,
                tool: item.type
            })
        default:
            break;
    }
}
