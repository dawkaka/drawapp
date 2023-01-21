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
            strokeWidth: mainState.strokeWidth
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
            edgesType: "sharp"
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
            edgesType: "sharp"
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
        }
    }
    return initialState
}