import { useAtom } from "jotai"
import { appState } from "./jotai"
import { Line, Pencil, Rectangle } from "./types"


export function useInitialState() {
    const [mainState] = useAtom(appState)
    const initialState: { line: Line, pencil: Pencil, rectangle: Rectangle } = {
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
        }
    }
    return initialState
}