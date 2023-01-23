import { atom } from "jotai";
import { AppState as AppStateType, CanvasItem, SelectedItem } from "./types";

export const AppState = atom<AppStateType>({
    strokeColor: "black",
    strokeWidth: 3,
    stroke: "solid",
    tool: "line",
    opacity: 1,
    fillColor: "transparent",
    imageBlob: "",
    selectedItemID: ""
})

export const AppDrawings = atom<CanvasItem[]>([])


export const SelectionAtom = atom((get): SelectedItem | null => {
    const { selectedItemID: ID } = get(AppState)
    const item = get(AppDrawings).find(item => item.id === ID)
    if (item) {
        switch (item.type) {
            case "rectangle":
            case "ellipse":
            case "diamond":
                return { type: item.type, x: item.x, y: item.y, width: item.width, height: item.height }
            case "line":
            case "arrow":
                return { type: item.type, x: item.x, y: item.y, points: item.points }
            default:
                break;
        }
    }
    return null
})
