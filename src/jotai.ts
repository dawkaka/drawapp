import { atom } from "jotai";
import { AppState } from "./types";

export const appState = atom<AppState>({
    strokeColor: "black",
    strokeWidth: 3,
    tool: "line",
    fillColor: "transparent",
    imageBlob: "",
})