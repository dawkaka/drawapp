import { useAtom } from "jotai";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useInitialState } from "../hooks";
import { appState } from "../jotai";
import { renderElements, renderCurrentDrawing } from "../lib/render";
import { CanvasItem, CurrentState, Diamond, Line, Pencil, Rectangle } from "../types";

export default function Canvas() {
    const [state, setState] = useState({ drawInProcess: false, startRectX: 0, startRectY: 0 })
    const [mainState] = useAtom(appState)
    const [points, setPoints] = useState<CanvasItem[]>([])
    const intialStates = useInitialState()
    const [current, setCurrent] = useState<CurrentState>(intialStates)


    function updateState(event: any, rect: DOMRect, drawInProcess: boolean) {
        if (!drawInProcess) {
            switch (mainState.tool) {
                case "line":
                    setCurrent({
                        ...current,
                        line: {
                            ...current.line,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth,
                        }
                    })
                    break;
                case "pencil":
                    setCurrent({
                        ...current,
                        pencil: {
                            ...current.pencil,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth,
                        }
                    })
                    break;
                case "rectangle":
                    setCurrent({
                        ...current,
                        rectangle: {
                            ...current.rectangle,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth,
                            fillStyle: mainState.fillColor
                        }
                    })
                    break;
                case "diamond":
                    setCurrent({
                        ...current,
                        diamond: {
                            ...current.diamond,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth,
                            fillStyle: mainState.fillColor
                        }
                    })
                    break;
                case "ellipse":
                    setCurrent({
                        ...current,
                        ellipse: {
                            ...current.ellipse,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth,
                            fillStyle: mainState.fillColor
                        }
                    })
                    break;
                case "arrow":
                    setCurrent({
                        ...current,
                        arrow: {
                            ...current.arrow,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            strokeStyle: mainState.strokeColor,
                            strokeWidth: mainState.strokeWidth,
                        }
                    })
                    break;
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
                                x: event.pageX - rect.left,
                                y: event.pageY - rect.top,
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
                    break;
                case "rectangle":
                    setCurrent({
                        ...current,
                        rectangle: {
                            ...current.rectangle,
                            width: event.pageX - rect.left - current.rectangle.x,
                            height: event.pageY - rect.top - current.rectangle.y,
                        }
                    })
                    break;
                case "diamond":
                    setCurrent({
                        ...current,
                        diamond: {
                            ...current.diamond,
                            width: event.pageX - rect.left - current.diamond.x,
                            height: event.pageY - rect.top - current.diamond.y,
                        }
                    })
                    break;
                case "ellipse":
                    setCurrent({
                        ...current,
                        ellipse: {
                            ...current.ellipse,
                            width: event.pageX - rect.left - current.ellipse.x,
                            height: event.pageY - rect.top - current.ellipse.y,
                        }
                    })
                    break;
                case "arrow":
                    setCurrent({
                        ...current,
                        arrow: {
                            ...current.arrow,
                            points: [{ x: 0, y: 0 }, {
                                x: event.pageX - rect.left,
                                y: event.pageY - rect.top,
                            }],
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
        renderElements(ctx, JSON.parse(localStorage.getItem("points") || "[]"))
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
        } else if (mainState.tool === "line") {
            renderCurrentDrawing(ctx, current.line)
        } else if (mainState.tool === "rectangle") {
            renderCurrentDrawing(ctx, current.rectangle)
        } else if (mainState.tool === "diamond") {
            renderCurrentDrawing(ctx, current.diamond)
        } else if (mainState.tool === "ellipse") {
            renderCurrentDrawing(ctx, current.ellipse)
        } else if (mainState.tool === "arrow") {
            renderCurrentDrawing(ctx, current.arrow)
        }
    }, [points, current])


    function handleMouseUp(event: any) {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        if (current) {
            if (mainState.tool === "pencil") {
                setPoints([...points, current.pencil])
                localStorage.setItem("points", JSON.stringify([...points, current.pencil]))
            } else if (mainState.tool === "line") {
                setPoints([...points, current.line])
                localStorage.setItem("points", JSON.stringify([...points, current.line]))

            } else if (mainState.tool === "rectangle") {
                setPoints([...points, current.rectangle])
                localStorage.setItem("points", JSON.stringify([...points, current.rectangle]))
            } else if (mainState.tool === "diamond") {
                setPoints([...points, current.diamond])
                localStorage.setItem("points", JSON.stringify([...points, current.diamond]))
            } else if (mainState.tool === "ellipse") {
                setPoints([...points, current.ellipse])
                localStorage.setItem("points", JSON.stringify([...points, current.ellipse]))
            } else if (mainState.tool === "arrow") {
                setPoints([...points, current.arrow])
                localStorage.setItem("points", JSON.stringify([...points, current.arrow]))
            }
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