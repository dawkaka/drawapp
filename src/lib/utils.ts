import { BoundingBox, CanvasItem, SelectedItem } from "../types"

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
                x: item.x - item.strokeWidth - 1,
                y: item.y - item.strokeWidth - 1,
                width: item.width + item.strokeWidth * 2 + 2,
                height: item.height + item.strokeWidth * 2 + 2
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
        switch (item.type) {
            case "rectangle":
            case "ellipse":
            case "diamond":
                if (pointerX < item.x || pointerY < item.y) return false
                if (pointerX > item.x + item.width || pointerY > item.y + item.height) return false
                return true
            case "arrow":
            case "line":
                if (pointerX < bounds.x || pointerY < bounds.y) return false
                if (pointerX > bounds.x + bounds.width || pointerY > bounds.y + bounds.height) return false
                return true
            default:
                break;
        }
    }
    return false
}

export function moveItem(distX: number, distY: number, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    console.log(distX, distY)
    if (targetIndex > -1) {
        items[targetIndex].x += distX
        items[targetIndex].y += distY
        return items
    }
    return null
}