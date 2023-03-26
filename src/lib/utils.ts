import { SetStateAction } from "jotai"
import { AppState, BoundingBox, CanvasItem, LayerMoves, MultipleSelection, Point, RectBounds, ResizePoints, SelectedItem } from "../types"
import history from "./history"
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

export function isWithinMultiSelectionResizeArea(x: number, y: number, resizeAreas: ResizePoints) {
    for (const [key, val] of Object.entries(resizeAreas)) {
        if (isPointInsideRectangle(x, y, val.x, val.y, 10, 10)) {
            return key
        }
    }
    return undefined
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

export function moveItem(dx: number, dy: number, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    if (targetIndex > -1) {
        items[targetIndex] = {
            ...items[targetIndex],
            x: items[targetIndex].x + dx,
            y: items[targetIndex].y + dy
        }
        return [...items]
    }
    return items
}

export function moveItems(dx: number, dy: number, selections: string[], items: CanvasItem[]) {
    const selItems: number[] = []
    items.forEach((item, ind) => {
        if (selections.includes(item.id)) {
            selItems.push(ind)
        }
    })

    for (let i = 0; i < selItems.length; i++) {
        const item = items[selItems[i]]
        items[selItems[i]] = {
            ...item,
            x: item.x + dx,
            y: item.y + dy
        }
    }
    return [...items]
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

export function calculatePointsDistance(x2: number, x1: number, y2: number, y1: number) {
    const xD = x2 - x1;
    const yD = y2 - y1;
    const distance = Math.sqrt(xD * xD + yD * yD);
    return distance;
}


export function resizeMultipleItems(dir: string, d: number, selections: string[], items: CanvasItem[], selX: number, selY: number, selW: number, selH: number): CanvasItem[] {
    const selectedItems = items.filter(item => selections.includes(item.id))

    // find the bounding box of the selection
    const bb = { x: selX, y: selY, width: selW, height: selH }

    // calculate the aspect ratio of the selection
    // const selAspectRatio = bb.width / bb.height

    // calculate the scaling factor based on the target width
    const targetWidth = bb.width + d
    const scaleFactor = targetWidth / bb.width

    // calculate the new dimensions for each item
    for (const item of selectedItems) {
        const dx = item.x - bb.x
        const dy = item.y - bb.y

        const selAspectRatio = item.width / item.height

        const newWidth = item.width * scaleFactor
        const newHeight = newWidth / selAspectRatio

        const newX = bb.x + dx * scaleFactor
        const newY = bb.y + dy * scaleFactor

        // update the item with the new dimensions and position
        items = items.map(i => {
            if (i.id === item.id) {
                return {
                    ...i,
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight
                }
            }
            return i
        })
    }

    return items

}


export function resizeSelected(dir: string, dx: number, dy: number, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    if (targetIndex === -1) return items
    if (dir === "pbr") {
        let item = { ...items[targetIndex] }
        item.width += dx
        item.height += dy
        items[targetIndex] = item
        return [...items]
    }
    if (dir === "ptl") {
        let item = { ...items[targetIndex] }
        item.x += dx
        item.y += dy
        item.width += -1 * dx
        item.height += -1 * dy
        items[targetIndex] = item
        return [...items]
    }
    if (dir === "ptr") {
        let item = { ...items[targetIndex] }
        item.width += dx
        item.y += dy
        item.height += -1 * dy
        items[targetIndex] = item
        return [...items]
    }
    if (dir === "pbl") {
        let item = { ...items[targetIndex] }
        item.width += - 1 * dx
        item.height += dy
        item.x += dx
        items[targetIndex] = item
        return [...items]
    }
    if (dir === "mb") {
        let item = { ...items[targetIndex] }
        item.height += dy
        items[targetIndex] = item

        return [...items]
    }
    if (dir === "mt") {
        let item = { ...items[targetIndex] }
        item.y += dy
        item.height += - 1 * dy
        items[targetIndex] = item

        return [...items]
    }

    if (dir === "mr") {
        let item = { ...items[targetIndex] }
        item.width += dx
        items[targetIndex] = item
        return [...items]
    }

    if (dir === "ml") {
        let item = { ...items[targetIndex] }
        item.x += dx
        item.width += -1 * dx
        items[targetIndex] = item
        return [...items]
    }

    if (dir === "ps") {
        let item = { ...items[targetIndex] }
        if (item.type === "arrow" || item.type === "line") {
            item.x += dx
            item.y += dy
            item.points = item.points.map(point => { return { ...point } });
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
        items[targetIndex] = item
        return [...items]
    }

    if (dir === "pe") {
        let item = { ...items[targetIndex] }
        if (item.type === "arrow" || item.type === "line") {
            item.points = item.points.map(point => { return { ...point } });
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
        items[targetIndex] = item
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
                        { x: item.x - 15, y: item.y - 15 },
                        { x: item.x + 15, y: item.y + 15 },
                        { x: item.x + item.points[1].x + 15, y: item.y + item.points[1].y + 15 },
                        { x: item.x + item.points[1].x - 15, y: item.y + item.points[1].y - 15 }
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
    const item = items.find(item => item.id === id)
    if (item) {
        return { ...item }
    }
}

export function getMultipleSelection(items: CanvasItem[], x: number, y: number, w: number, h: number): string[] {
    const selectedItems: string[] = []
    items.forEach((item) => {
        switch (item.type) {
            case "diamond":
            case "rectangle":
            case "image":
            case "ellipse":
            case "text":
                const { x: xx, y: yy, height, width } = item
                let points: Point[] = [{ x: xx, y: yy }, { x: xx + width, y: yy }, { x: xx, y: yy + height }, { x: xx + width, y: yy + height }]
                if (points.every(point => isPointInsideRectangle(point.x, point.y, x, y, w, h))) {
                    selectedItems.push(item.id)
                }
                break;
            case "arrow":
            case "line":
                if (item.x)
                    if (
                        isPointInsideRectangle(item.x, item.y, x, y, w, h) &&
                        isPointInsideRectangle(item.x + item.points[1].x, item.y + item.points[1].y, x, y, w, h)
                    ) {
                        selectedItems.push(item.id)
                    }
            default:
                break;
        }
    })
    return selectedItems
}


export function getMultipleSelectionBounds(selectedItems: string[], items: CanvasItem[]) {
    const selection = items.filter(item => selectedItems.includes(item.id))
    const bounds: MultipleSelection = {
        x: Infinity, y: Infinity, width: -Infinity, height: -Infinity,
        resizeAreas: {
            tl: { x: 0, y: 0 },
            tr: { x: 0, y: 0 },
            bl: { x: 0, y: 0 },
            br: { x: 0, y: 0 }
        }
    }
    selection.forEach(item => {
        switch (item.type) {
            case "diamond":
            case "rectangle":
            case "image":
            case "ellipse":
            case "text":
                bounds.x = Math.min(bounds.x, Math.min(item.x, item.x + item.width))
                bounds.y = Math.min(bounds.y, Math.min(item.y, item.y + item.height))
                bounds.width = Math.max(bounds.width, Math.max(item.x, item.x + item.width))
                bounds.height = Math.max(bounds.height, Math.max(item.y, item.y + item.height))
                break;
            case "arrow":
            case "line":
                bounds.x = Math.min(bounds.x, Math.min(item.x, item.x + item.points[1].x))
                bounds.y = Math.min(bounds.y, Math.min(item.y, item.y + item.points[1].y))
                bounds.width = Math.max(bounds.width, Math.max(item.x, item.x + item.points[1].x))
                bounds.height = Math.max(bounds.height, Math.max(item.y, item.y + item.points[1].y))
            default:
                break;
        }
    })
    const size = 5
    bounds.width = bounds.width - bounds.x + 10
    bounds.height = bounds.height - bounds.y + 10
    bounds.x -= 5
    bounds.y -= 5
    bounds.resizeAreas = {
        tl: { x: bounds.x - size, y: bounds.y - size },
        tr: { x: bounds.x + bounds.width - size, y: bounds.y - size },
        bl: { x: bounds.x - size, y: bounds.y + bounds.height - size },
        br: { x: bounds.x + bounds.width - size, y: bounds.y + bounds.height - size }
    }
    return bounds
}

export function isPointInsideRectangle(px: number, py: number, x: number, y: number, w: number, h: number) {
    if (px >= x && px <= x + w && py >= y && py <= y + h) {
        return true
    }
    return false
}

export function updateSingleItem(id: string, newVAlue: CanvasItem, items: CanvasItem[]): CanvasItem[] {
    const targetIndex = items.findIndex(item => item.id === id)
    if (targetIndex >= 0) {
        items[targetIndex] = newVAlue
        items = [...items]
        history.addHistory(items)
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
                tool: item.type,
                textAlign: item.alignment
            })
            break;
        case "arrow":
        case "line":
            setState({
                ...currentState,
                strokeColor: item.strokeStyle,
                strokeWidth: item.strokeWidth,
                opacity: item.opacity,
                stroke: item.stroke,
                tool: item.type
            })
            break;
        case "image":
            setState({
                ...currentState,
                tool: "image",
            })
        default:
            break;
    }
}
