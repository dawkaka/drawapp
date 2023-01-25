import { BoundingBox, CanvasItem, LayerMoves, SelectedItem } from "../types"
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
                    curveControl: { x: item.x + item.points[1].x / 2, y: item.y + item.points[1].y / 2 }
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
                for (const [key, val] of Object.entries(bounds.resizeAreas)) {
                    if (pointerX > val.x && pointerY > val.y && pointerX < val.x + 10 && pointerY < val.y + 10) {
                        return key
                    }
                }
                break;
            case "arrow":
            case "line":
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
        return items
    }
    return null
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
    return items
}