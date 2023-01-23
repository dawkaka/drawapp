import { BoundingBox, SelectedItem } from "../types"

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
            return { x: item.x, y: item.y, width: item.width, height: item.height }
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