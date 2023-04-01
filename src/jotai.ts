import { atom } from "jotai";
import { AppState as AppStateType, CanvasItem, SelectedItem } from "./types";
import { defaultValues } from "./constants"

export const AppState = atom<AppStateType>(defaultValues)

export const AppDrawings = atom<CanvasItem[]>([])


export const SelectionAtom = atom((get): SelectedItem | null => {
    const { selectedItemID: ID } = get(AppState)
    if (ID === "") return null
    const item = get(AppDrawings).find(item => item.id === ID)
    if (item) {
        switch (item.type) {
            case "rectangle":
            case "ellipse":
            case "diamond":
            case "text":
                return { id: item.id, type: item.type, x: item.x, y: item.y, width: item.width, height: item.height, strokeWidth: item.strokeWidth }
            case "line":
            case "arrow":
            case "pencil":
                return { id: item.id, type: item.type, x: item.x, y: item.y, points: item.points, strokeWidth: item.strokeWidth }
            case "image":
                return { id: item.id, type: item.type, x: item.x, y: item.y, width: item.width, height: item.height, strokeWidth: 0 }
            default:
                break;
        }
    }
    return null
})
