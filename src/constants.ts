import { AppState } from "./types"

export const defaultValues: AppState = {
    strokeColor: "black",
    strokeWidth: 3,
    stroke: "solid",
    tool: "select",
    opacity: 1,
    fillColor: "transparent",
    imageBlob: "",
    multipleSelections: [],
    selectedItemID: "",
    fontFamily: "Kalam",
    fontSize: 25,
    textStyle: "fill",
    textAlign: "left"
}