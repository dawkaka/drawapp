import { atom } from "jotai";
import { AppState as AppStateType, CanvasItem } from "./types";

export const AppState = atom<AppStateType>({
    strokeColor: "black",
    strokeWidth: 3,
    stroke: "solid",
    tool: "line",
    opacity: 1,
    fillColor: "transparent",
    imageBlob: "",
    selectedItem: ""
})


export const AppDrawings = atom<CanvasItem[]>([])
