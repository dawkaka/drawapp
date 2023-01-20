import { useAtom } from "jotai"
import { appState } from "./jotai"
import { Line, Pencil } from "./types"


export function useInitialState() {
    const [mainState] = useAtom(appState)
    const initialState: { line: Line, pencil: Pencil } = {
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
        }
    }
    return initialState
}