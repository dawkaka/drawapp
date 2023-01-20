import { useAtom } from "jotai";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useInitialState } from "../hooks";
import { appState } from "../jotai";
import { renderElements, renderCurrentDrawing } from "../lib/render";
import { CanvasItem, Line, Linear, Pencil, Point } from "../types";

export default function Canvas() {
    const [state, setState] = useState({ drawInProcess: false, startRectX: 0, startRectY: 0 })
    const [mainState] = useAtom(appState)
    const [points, setPoints] = useState<CanvasItem[]>([])
    const intialStates = useInitialState()
    const [current, setCurrent] = useState<{ line: Line, pencil: Pencil }>(intialStates)


    function updateState(event: any, rect: DOMRect, drawInProcess: boolean) {
        if (!drawInProcess) {
            switch (mainState.tool) {
                case "line":
                    setCurrent({
                        ...current,
                        line: {
                            type: "line",
                            points: [{ x: 0, y: 0 }],
                            width: 0,
                            height: 0,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth
                        }
                    })
                    break;
                case "pencil":
                    setCurrent({
                        ...current,
                        pencil: {
                            type: "pencil",
                            points: [{ x: 0, y: 0 }],
                            width: 0,
                            height: 0,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth
                        }
                    })
                default:
                    break;
            }
        } else {
            switch (mainState.tool) {
                case "line":
                    setCurrent({
                        ...current,
                        line: {
                            ...current.line,
                            points: [{ x: 0, y: 0 }, {
                                x: event.pageX - rect.left - current.pencil.x,
                                y: event.pageY - rect.top - current.pencil.y,
                            }],
                        }
                    })
                    break;
                case "pencil":
                    setCurrent({
                        ...current,
                        pencil: {
                            ...current.pencil,
                            points: [...current.pencil.points, {
                                x: event.pageX - rect.left - current.pencil.x,
                                y: event.pageY - rect.top - current.pencil.y,
                            }]
                        }
                    })
                default:
                    break;
            }
        }

    }

    function handleMouseDown(event: any) {
        let rect = document.getElementById("canvas")!.getBoundingClientRect();
        updateState(event, rect, state.drawInProcess)
        setState({
            drawInProcess: true, startRectX: event.pageX - rect.left,
            startRectY: event.pageY - rect.top
        });
    }

    useEffect(() => {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c!.getContext("2d")!;
        ctx.canvas.width = window.devicePixelRatio * window.innerWidth
        ctx.canvas.height = window.devicePixelRatio * window.innerHeight
        renderElements(ctx, JSON.parse(localStorage.getItem("points")!))
    }, [])


    function handleMouseMove(event: any) {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let rect = c.getBoundingClientRect();
        if (state.drawInProcess) {
            updateState(event, rect, true)
        }
    }


    useEffect(() => {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        ctx.clearRect(0, 0, window.devicePixelRatio * window.innerWidth, window.devicePixelRatio * window.innerHeight)
        if (points.length > 0) {
            renderElements(ctx, points)
        }
        if (mainState.tool === "pencil") {
            renderCurrentDrawing(ctx, current.pencil)
        } else {
            renderCurrentDrawing(ctx, current.line)
        }
    }, [points, current])


    function handleMouseUp(event: any) {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        if (current) {
            if (mainState.tool === "pencil") {
                setPoints([...points, current.pencil])
            } else {
                setPoints([...points, current.line])
            }
            localStorage.setItem("points", JSON.stringify([...points, current]))
            setCurrent(intialStates)
        }
        setState({ ...state, drawInProcess: false })
    }


    return (
        <canvas
            id="canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
        </canvas>
    )
}