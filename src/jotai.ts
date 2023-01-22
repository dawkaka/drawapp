import { atom } from "jotai";
import { AppState as AppStateType, CanvasItem } from "./types";

export const AppState = atom<AppStateType>({
    strokeColor: "black",
    strokeWidth: 3,
    stroke: "solid",
    tool: "line",
    fillColor: "transparent",
    imageBlob: "",
})


export const AppDrawings = atom<CanvasItem[]>([])
