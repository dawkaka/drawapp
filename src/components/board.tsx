import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useInitialState } from "../hooks";
import { AppDrawings, AppState, SelectionAtom } from "../jotai";
import { renderElements, renderCurrentDrawing, renderBounds } from "../lib/render";
import { getBoundingBox, getItemEnclosingPoint, getRandomID, isWithinItem, isWithinResizeArea, moveItem, resizeSelected } from "../lib/utils";
import { CurrentState } from "../types";

export default function Canvas() {
    const [state, setState] = useState({ drawInProcess: false, resizeDir: "", drew: false, startRectX: 0, startRectY: 0, moveStart: false })
    const [mainState, updateMainState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const intialStates = useInitialState()
    const [current, setCurrent] = useState<CurrentState>(intialStates)

    const [selectedItem] = useAtom(SelectionAtom)

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
                            stroke: mainState.stroke,
                            opacity: mainState.opacity
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
                            opacity: mainState.opacity
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
                            fillStyle: mainState.fillColor,
                            stroke: mainState.stroke,
                            opacity: mainState.opacity,
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
                            fillStyle: mainState.fillColor,
                            stroke: mainState.stroke,
                            opacity: mainState.opacity,
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
                            fillStyle: mainState.fillColor,
                            stroke: mainState.stroke,
                            opacity: mainState.opacity,
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
                            stroke: mainState.stroke,
                            opacity: mainState.opacity,
                        }
                    })
                    break;
                case "image":
                    if (mainState.imageBlob) {
                        setCurrent({
                            ...current,
                            image: {
                                ...current.image,
                                x: event.pageX - rect.left,
                                y: event.pageY - rect.top,
                                strokeStyle: mainState.strokeColor,
                                strokeWidth: mainState.strokeWidth,
                                fillStyle: mainState.fillColor,
                                data: mainState.imageBlob,
                                opacity: mainState.opacity,
                            }
                        })
                    }
                    break;
                case "text":
                    setCurrent({
                        ...current,
                        text: {
                            ...current.text,
                            x: event.pageX - rect.left,
                            y: event.pageY - rect.top,
                            opacity: mainState.opacity,
                            fontFamily: mainState.fontFamily,
                            fontSize: mainState.fontSize,
                            textStyle: mainState.textStyle,
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
                            id: getRandomID(),
                            points: [
                                {
                                    x: (event.pageX - rect.left - current.line.x) / 2,
                                    y: (event.pageY - rect.top - current.line.y) / 2
                                },
                                {
                                    x: event.pageX - rect.left - current.line.x,
                                    y: event.pageY - rect.top - current.line.y,
                                }],
                        }
                    })
                    break;
                case "pencil":
                    setCurrent({
                        ...current,
                        pencil: {
                            ...current.pencil,
                            id: getRandomID(),
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
                            id: getRandomID(),
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
                            id: getRandomID(),
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
                            id: getRandomID(),
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
                            id: getRandomID(),
                            points: [
                                {
                                    x: (event.pageX - rect.left - current.arrow.x) / 2,
                                    y: (event.pageY - rect.top - current.arrow.y) / 2
                                },
                                {
                                    x: event.pageX - rect.left - current.arrow.x,
                                    y: event.pageY - rect.top - current.arrow.y,
                                }
                            ],
                        }
                    })
                    break;
                case "image":
                    if (mainState.imageBlob) {
                        setCurrent({
                            ...current,
                            image: {
                                ...current.image,
                                id: getRandomID(),
                                x: event.pageX - rect.left,
                                y: event.pageY - rect.top,
                                strokeStyle: mainState.strokeColor,
                                strokeWidth: mainState.strokeWidth,
                                fillStyle: mainState.fillColor,
                                data: mainState.imageBlob
                            }
                        })
                    }
                default:
                    break;
            }
        }

    }

    function handleMouseDown(event: any) {
        if (mainState.tool !== "select") {
            let rect = document.getElementById("canvas")!.getBoundingClientRect();
            updateState(event, rect, state.drawInProcess)
            setState({
                ...state,
                drawInProcess: true, startRectX: event.pageX - rect.left,
                startRectY: event.pageY - rect.top
            });
        } else if (selectedItem !== null) {
            let px = event.pageX as number
            let py = event.pageY as number
            const resizeDir = isWithinResizeArea(px, py, selectedItem)
            if (resizeDir) {
                setState({
                    ...state, startRectX: px,
                    startRectY: py,
                    resizeDir: resizeDir
                })
            } else if (isWithinItem(px, py, selectedItem)) {
                setState({
                    ...state, moveStart: true, startRectX: px,
                    startRectY: py
                })
            }
        }
    }

    useEffect(() => {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c!.getContext("2d")!;
        ctx.canvas.width = window.devicePixelRatio * window.innerWidth
        ctx.canvas.height = window.devicePixelRatio * window.innerHeight
        renderElements(ctx, JSON.parse(localStorage.getItem("canvasItems") || "[]"))
    }, [])

    function handleMouseMove(event: any) {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let rect = c.getBoundingClientRect();
        if (state.drawInProcess) {
            updateState(event, rect, true)
            setState({ ...state, drew: true })
        } else if (state.moveStart && selectedItem) {
            let px = event.pageX as number
            let py = event.pageY as number
            setState({ ...state, startRectX: px, startRectY: py })
            const updatedItems = moveItem(px - state.startRectX, py - state.startRectY, selectedItem, items)
            if (updatedItems) {
                setItems([...updatedItems])
            }
        } else if (state.resizeDir && selectedItem) {
            let px = event.pageX as number
            let py = event.pageY as number
            setState({ ...state, startRectX: px, startRectY: py })
            const updatedItems = resizeSelected(state.resizeDir, px - state.startRectX, py - state.startRectY, selectedItem, items)
            setItems(updatedItems)
        }
    }


    useEffect(() => {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        ctx.clearRect(0, 0, window.devicePixelRatio * window.innerWidth, window.devicePixelRatio * window.innerHeight)
        if (items.length > 0) {
            renderElements(ctx, items)
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

        if (selectedItem) {
            const bounds = getBoundingBox(selectedItem)
            if (bounds) {
                renderBounds(ctx, bounds)
            }
        }
    }, [items, current, selectedItem])


    function handleMouseUp(event: any) {
        let itemID = ""
        if (mainState.tool === "text") return
        if (current) {
            if (mainState.tool === "pencil") {
                setItems([...items, current.pencil])
                itemID = current.pencil.id
                localStorage.setItem("canvasItems", JSON.stringify([...items, current.pencil]))
            } else if (mainState.tool === "line") {
                setItems([...items, current.line])
                localStorage.setItem("canvasItems", JSON.stringify([...items, current.line]))
                itemID = current.line.id

            } else if (mainState.tool === "rectangle") {
                setItems([...items, current.rectangle])
                localStorage.setItem("canvasItems", JSON.stringify([...items, current.rectangle]))
                itemID = current.rectangle.id
            } else if (mainState.tool === "diamond") {
                setItems([...items, current.diamond])
                itemID = current.diamond.id
                localStorage.setItem("canvasItems", JSON.stringify([...items, current.diamond]))

            } else if (mainState.tool === "ellipse") {
                itemID = current.ellipse.id
                setItems([...items, current.ellipse])
                localStorage.setItem("canvasItems", JSON.stringify([...items, current.ellipse]))
            } else if (mainState.tool === "arrow") {
                itemID = current.arrow.id
                setItems([...items, current.arrow])
                localStorage.setItem("canvasItems", JSON.stringify([...items, current.arrow]))
            }
            setCurrent(intialStates)
        }
        if (state.drew && mainState.tool !== "select") {
            updateMainState({ ...mainState, tool: "select", selectedItemID: itemID })
        }
        setState({ ...state, drawInProcess: false, moveStart: false, drew: false, resizeDir: "" })
    }

    function handleClick(event: any) {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;

        updateMainState({ ...mainState, selectedItemID: getItemEnclosingPoint(event.pageX, event.pageY, items) })

    }
    function handleText(event: any) {
        console.log("here")
        if (mainState.tool === "text") {
            setCurrent({
                ...current,
                text: {
                    ...current.text,
                    text: current.text.text += "ha"
                }
            })
        }
    }

    console.log(current.text)
    return (
        <canvas
            className="appearance-none outline-0"
            id="canvas"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleClick}
            onKeyDown={handleText}
        >
        </canvas>
    )
}