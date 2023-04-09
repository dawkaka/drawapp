import { SetStateAction } from "jotai"
import { AppState, BoundingBox, CanvasItem, LayerMoves, MultipleSelection, Point, RectBounds, ResizePoints, SelectedItem } from "../types"
import history from "./history"
import { Cursor } from "../constants"

export function getRandomID() {
    const alphabets = "abc8debg7hijkl0mn6GH5IJKLMNo9pq1rstuv2wxy3zABCD4EFOPQRSTUVWSYZ"
    let id = ""
    for (let i = 0; i < 12; i++) {
        let ind = Math.floor(Math.random() * alphabets.length)
        id += alphabets[ind]
    }
    return id
}

export function getBoundingBox(item: SelectedItem): BoundingBox | null {
    switch (item.type) {
        case "rectangle":
        case "ellipse":
        case "diamond":
            var sx = item.x
            var sy = item.y
            var ex = item.width
            var ey = item.height
            var ptl = { x: sx - 5, y: sy - 5, width: 10, height: 10 }
            var ptr = { x: sx + ex - 5, y: sy - 5, width: 10, height: 10 }
            var pbl = { x: sx - 5, y: sy + ey - 5, width: 10, height: 10 }
            var pbr = { x: sx + ex - 5, y: sy + ey - 5, width: 10, height: 10 }
            var mt = { x: sx - 5 + ex / 2, y: sy - 5, width: 10, height: 10 }
            var mr = { x: sx + ex - 5, y: sy - 5 + ey / 2, width: 10, height: 10 }
            var mb = { x: sx - 5 + ex / 2, y: sy + ey - 5, width: 10, height: 10 }
            var ml = { x: sx - 5, y: sy - 5 + ey / 2, width: 10, height: 10 }

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
                x: item.x - 5,
                y: item.y - 5,
                width: item.width + 10,
                height: item.height + 10,
            }
        case "image":
            return {
                type: item.type,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
                resizeAreas: {
                    ptl: { x: item.x - 5, y: item.y - 5, width: 10, height: 10 },
                    ptr: { x: item.x + item.width - 5, y: item.y - 5, width: 10, height: 10 },
                    pbl: { x: item.x - 5, y: item.height + item.y - 5, width: 10, height: 10 },
                    pbr: { x: item.x + item.width - 5, y: item.height + item.y - 5, width: 10, height: 10 }
                }
            }
        case "pencil":
            const rect = getPointsBoundingRect(item.points, item.x, item.y)
            var sx = rect.x - 5
            var sy = rect.y - 5
            var ex = rect.width + 10
            var ey = rect.height + 10
            var ptl = { x: sx - 5, y: sy - 5, width: 10, height: 10 }
            var ptr = { x: sx + ex - 5, y: sy - 5, width: 10, height: 10 }
            var pbl = { x: sx - 5, y: sy + ey - 5, width: 10, height: 10 }
            var pbr = { x: sx + ex - 5, y: sy + ey - 5, width: 10, height: 10 }
            var mt = { x: sx - 5 + ex / 2, y: sy - 5, width: 10, height: 10 }
            var mr = { x: sx + ex - 5, y: sy - 5 + ey / 2, width: 10, height: 10 }
            var mb = { x: sx - 5 + ex / 2, y: sy + ey - 5, width: 10, height: 10 }
            var ml = { x: sx - 5, y: sy - 5 + ey / 2, width: 10, height: 10 }
            return {
                type: "pencil",
                x: sx,
                y: sy,
                width: ex,
                height: ey,
                resizeAreas: {
                    ptl, ptr, pbl, pbr,
                    mt, mr, mb, ml
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
            case "pencil":
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
            case "pencil":
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

export function resizeMultipleItems(dir: string, dx: number, dy: number, selections: string[], items: CanvasItem[], selX: number, selY: number, selW: number, selH: number): CanvasItem[] {

    const itemsPosition: number[] = []
    items.forEach((item, ind) => {
        if (selections.includes(item.id)) {
            itemsPosition.push(ind)
        }
    })

    const bb = { x: selX, y: selY, width: selW, height: selH }

    let d = Math.sqrt(dx * dx + dy * dy)
    switch (dir) {
        case "br":
            if (dx < 0 || dy < 0) {
                d = 0 - d
            }
            break;
        case "tl":
            if (dx > 0 || dy > 0) {
                d = 0 - d
            }
            break;
        case "tr":
            if (dx > 0 || dy < 0) {
                d = 0 - d
            }
            break;
        case "bl":
            if (dx < 0 || dy > 0) {
                d = 0 - d
            }
            break;
        default:
            break;
    }

    const targetWidth = bb.width + d
    const scaleFactor = targetWidth / bb.width

    for (const ind of itemsPosition) {
        const item = items[ind]
        const dx = item.x - bb.x
        const dy = item.y - bb.y
        let selAspectRatio = item.width / item.height
        if (item.type === "line" || item.type === "arrow") {
            item.width = Math.abs(item.points[1].x)
            item.height = Math.abs(item.points[1].y)
            selAspectRatio = Math.abs(item.points[1].x) / Math.abs(item.points[1].y)
        }
        let newWidth, newHeight, newX, newY
        switch (dir) {
            case "br":
                newWidth = item.width * scaleFactor
                newHeight = newWidth / selAspectRatio
                newX = bb.x + dx * scaleFactor
                newY = bb.y + dy * scaleFactor
                break;
            case "tl":
                newWidth = item.width * scaleFactor
                newHeight = newWidth / selAspectRatio
                newX = bb.x + bb.width - (dx + item.width) * scaleFactor
                newY = bb.y + bb.height - (dy + item.height) * scaleFactor
                break;
            case "tr":
                newWidth = item.width * scaleFactor
                newHeight = newWidth / selAspectRatio
                newX = bb.x + dx * scaleFactor
                newY = bb.y + bb.height - (dy + item.height) * scaleFactor
                break;
            case "bl":
                newWidth = item.width * scaleFactor
                newHeight = newWidth / selAspectRatio
                newX = bb.x + bb.width - (dx + item.width) * scaleFactor
                newY = bb.y + dy * scaleFactor
                break;
            default:
                newWidth = item.width
                newHeight = item.height
                newX = item.x
                newY = item.y
                break;
        }
        if (item.type === "line" || item.type === "arrow") {
            const { points } = item
            const { x, y } = points[1]
            points[1].x = newWidth ? x < 0 ? -newWidth : newWidth : points[1].x
            points[1].y = newHeight ? y < 0 ? -newHeight : newHeight : points[1].y
            points[0].x = points[1].x / 2
            points[0].y = points[1].y / 2
            items[ind] = {
                ...item,
                x: newX ? newX : item.x,
                y: newY ? newY : item.y,
                points

            }
        } else {
            items[ind] = {
                ...item,
                x: newX ? newX : item.x,
                y: newY ? newY : item.y,
                width: newWidth ? newWidth : item.width,
                height: newHeight ? newHeight : item.height
            }
        }

    }

    return [...items]
}

export function getCursor(dir: string): Cursor {
    switch (dir) {
        case "pbl":
        case "bl":
            return Cursor.SwResize
        case "pbr":
        case "br":
            return Cursor.SeResize
        case "ptl":
        case "tl":
            return Cursor.NwResize
        case "ptr":
        case "tr":
            return Cursor.NeResize
        case "ml":
            return Cursor.EResize
        case "mr":
            return Cursor.WResize
        case "mt":
            return Cursor.NResize
        case "mb":
            return Cursor.SResize
        case "pe":
        case "ps":
            return Cursor.Move
        case "rectangle":
        case "line":
        case "diamond":
        case "ellipse":
        case "arrow":
        case "pencil":
            return Cursor.Crosshair
        case "move":
            return Cursor.Grab
        default:
            return Cursor.Auto
    }
}


export function resizeSelected(dir: string, dx: number, dy: number, item: SelectedItem, items: CanvasItem[]) {
    const targetIndex = items.findIndex(val => val.id === item.id)
    if (targetIndex === -1) return items
    if (dir === "pbr") {
        let item = { ...items[targetIndex] }
        if (item.type === "pencil") {
            item.points = resizeHandDrawnPath(item.points, dx, dy)
            items[targetIndex] = item

        } else {
            item.width += dx
            item.height += dy
            items[targetIndex] = item
        }
    }

    if (dir === "ptl") {
        let item = { ...items[targetIndex] }
        item.x += dx
        item.y += dy
        item.width += -1 * dx
        item.height += -1 * dy
        items[targetIndex] = item
    }
    if (dir === "ptr") {
        let item = { ...items[targetIndex] }
        item.width += dx
        item.y += dy
        item.height += -1 * dy
        items[targetIndex] = item
    }
    if (dir === "pbl") {
        let item = { ...items[targetIndex] }
        item.width += - 1 * dx
        item.height += dy
        item.x += dx
        items[targetIndex] = item
    }
    if (dir === "mb") {
        let item = { ...items[targetIndex] }
        item.height += dy
        items[targetIndex] = item
    }
    if (dir === "mt") {
        let item = { ...items[targetIndex] }
        item.y += dy
        item.height += - 1 * dy
        items[targetIndex] = item
    }

    if (dir === "mr") {
        let item = { ...items[targetIndex] }
        item.width += dx
        items[targetIndex] = item
    }

    if (dir === "ml") {
        let item = { ...items[targetIndex] }
        item.x += dx
        item.width += -1 * dx
        items[targetIndex] = item
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

    return [...items]
}

export function getItemEnclosingPoint(pointerX: number, pointerY: number, items: CanvasItem[]): string {
    let boundingItems: { id: string, area: number, fill: boolean }[] = []
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
                    boundingItems.push({ id: item.id, area: Math.abs(item.points[1].x * item.points[1].y), fill: false })
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

                    boundingItems.push({ id: item.id, area: Math.abs(item.width * item.height), fill: item.type === "image" ? true : item.fillStyle !== "transparent" })
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

                    boundingItems.push({ id: item.id, area: Math.abs(item.width * item.height), fill: true })
                }
                break;
            case "pencil":
                const boundingRect = getPointsBoundingRect(item.points, item.x, item.y)
                if (isPointInsideRectangle(pointerX, pointerY, boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height)) {
                    boundingItems.push({ id: item.id, area: Math.abs(boundingRect.width * boundingRect.height), fill: false })
                }
            default:
                break;
        }

    }
    let smallest = { id: "", area: Number.MAX_VALUE }
    boundingItems.forEach(i => {
        if (i.area < smallest.area) {
            smallest = { id: i.id, area: i.area }
        }
    })
    for (let v of boundingItems) {
        if (v.id === smallest.id) {
            return v.id
        } else if (v.fill) {
            return v.id
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
                var { x: xx, y: yy, height, width } = item
                var points: Point[] = [{ x: xx, y: yy }, { x: xx + width, y: yy }, { x: xx, y: yy + height }, { x: xx + width, y: yy + height }]
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
                break;
            case "pencil":
                const rect = getPointsBoundingRect(item.points, item.x, item.y)
                var { x: xx, y: yy, height, width } = rect
                var points: Point[] = [{ x: xx, y: yy }, { x: xx + width, y: yy }, { x: xx, y: yy + height }, { x: xx + width, y: yy + height }]
                if (points.every(point => isPointInsideRectangle(point.x, point.y, x, y, w, h))) {
                    selectedItems.push(item.id)
                }
                break;
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
            case "pencil":
                const rect = getPointsBoundingRect(item.points, item.x, item.y)
                bounds.x = Math.min(bounds.x, Math.min(rect.x, rect.x + rect.width))
                bounds.y = Math.min(bounds.y, Math.min(rect.y, rect.y + rect.height))
                bounds.width = Math.max(bounds.width, Math.max(rect.x, rect.x + rect.width))
                bounds.height = Math.max(bounds.height, Math.max(rect.y, rect.y + rect.height))
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
            break;
        case "pencil":
            setState({
                ...currentState,
                strokeColor: item.strokeStyle,
                strokeWidth: item.strokeWidth,
                opacity: item.opacity,
                tool: item.type
            })
            break;
        default:
            break;
    }
}


export function simplifyPath(points: Point[], distance: number) {
    const newPoints = [];
    newPoints.push(points[0]);

    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - newPoints[newPoints.length - 1].x;
        const dy = points[i].y - newPoints[newPoints.length - 1].y;
        const len = Math.sqrt(dx * dx + dy * dy);

        if (len > distance) {
            newPoints.push(points[i]);
        }
    }

    return newPoints;
}


export function getPointsBoundingRect(points: Point[], x: number, y: number) {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    for (let i = 0; i < points.length; i++) {
        if (points[i].x < minX) {
            minX = points[i].x;
        }
        if (points[i].y < minY) {
            minY = points[i].y;
        }
        if (points[i].x > maxX) {
            maxX = points[i].x;
        }
        if (points[i].y > maxY) {
            maxY = points[i].y;
        }
    }

    return {
        x: x + minX,
        y: y + minY,
        width: maxX - minX,
        height: maxY - minY
    };
}

function resizeHandDrawnPath(points: Point[], dx: number, dy: number) {
    // Compute the bounding box of the points
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
    }

    // Compute the center of the bounding box
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Compute the scaling factors based on the desired width and height
    const targetWidth = maxX - minX;
    const targetHeight = maxY - minY;
    const scaleX = (targetWidth + dx) / targetWidth;
    const scaleY = (targetHeight + dy) / targetHeight;

    // Scale and translate the points
    const result = [];
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const x = (point.x - centerX) * scaleX + centerX;
        const y = (point.y - centerY) * scaleY + centerY;
        result.push({ x, y });
    }
    return result;
}

export function getInverseColorForTheme(color: string): string {
    const theme = localStorage.getItem("theme")
    if (!theme) return color
    if (theme === "light" && color === "#FFFFFF") {
        return "#000000"
    } else if (theme === "dark" && color === "#000000") {
        return "#FFFFFF"
    }
    return color
}