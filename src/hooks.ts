import { useAtom } from "jotai"
import { appState } from "./jotai"
import { CurrentState, Diamond, Ellipse, Line, Pencil, Rectangle } from "./types"


export function useInitialState() {
    const [mainState] = useAtom(appState)
    const initialState: CurrentState = {
        line: {
            type: "line",
            points: [{ x: 0, y: 0 }],
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth,
            stroke: mainState.stroke
        },
        pencil: {
            type: "pencil",
            points: [{ x: 0, y: 0 }],
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth
        },
        rectangle: {
            type: "rectangle",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth,
            fillStyle: mainState.fillColor,
            edgesType: "sharp",
            stroke: mainState.stroke
        },
        diamond: {
            type: "diamond",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth,
            fillStyle: mainState.fillColor,
            edgesType: "sharp",
            stroke: mainState.stroke
        },
        ellipse: {
            type: "ellipse",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth,
            fillStyle: mainState.fillColor,
            stroke: mainState.stroke
        },
        arrow: {
            type: "arrow",
            points: [{ x: 0, y: 0 }],
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth,
            stroke: mainState.stroke
        },
        image: {
            type: "image",
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            data: mainState.imageBlob,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth,
            fillStyle: mainState.fillColor,
            edgesType: "sharp"
        }
    }
    return initialState
}