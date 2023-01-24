import { BoundingBox, CanvasItem, SelectedItem } from "../types"
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
            return {
                x: item.width < 0 ? item.x + item.strokeWidth + 1 : item.x - item.strokeWidth - 1,
                y: item.height < 0 ? item.y + item.strokeWidth + 1 : item.y - item.strokeWidth - 1,
                width: item.width < 0 ? item.width - item.strokeWidth * 2 - 2 : item.width + item.strokeWidth * 2 + 2,
                height: item.height < 0 ? item.height - item.strokeWidth * 2 - 2 : item.height + item.strokeWidth * 2 + 2
            }
        case "line":
        case "arrow":
            if (item.points.length > 1) {
                return { x: item.x, y: item.y, width: item.points[1].x, height: item.points[1].y }
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
            sy += bounds.width
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

export function moveItem(dX: number, dY: number, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    if (targetIndex > -1) {
        items[targetIndex].x += dX
        items[targetIndex].y += dY
        return items
    }
    return null
}