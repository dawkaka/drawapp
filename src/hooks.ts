import { useAtom } from "jotai"
import { AppState } from "./jotai"
import { CurrentState, Diamond, Ellipse, Line, Pencil, Rectangle } from "./types"


export function useInitialState() {
    const [mainState] = useAtom(AppState)
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
            stroke: mainState.stroke,
            opacity: mainState.opacity,
        },
        pencil: {
            type: "pencil",
            points: [{ x: 0, y: 0 }],
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            strokeStyle: mainState.strokeColor,
            strokeWidth: mainState.strokeWidth,
            opacity: mainState.opacity,
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
            stroke: mainState.stroke,
            opacity: mainState.opacity,
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
            stroke: mainState.stroke,
            opacity: mainState.opacity,
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
            stroke: mainState.stroke,
            opacity: mainState.opacity,
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
            stroke: mainState.stroke,
            opacity: mainState.opacity,
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
            edgesType: "sharp",
            opacity: mainState.opacity,
        }
    }
    return initialState
}