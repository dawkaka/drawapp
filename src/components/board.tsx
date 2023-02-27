import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { defaultValues } from "../constants";
import { useInitialState } from "../hooks";
import { AppDrawings, AppState, SelectionAtom } from "../jotai";
import { renderElements, renderCurrentDrawing, renderBounds } from "../lib/render";
import { getBoundingBox, getItemEnclosingPoint, getRandomID, getSelectedItem, isWithinItem, isWithinResizeArea, moveItem, resizeSelected, updateAppStateFromSelectedItem } from "../lib/utils";
import { CurrentState, Text } from "../types";
import History from "../lib/history";

export default function Canvas() {
    const [state, setState] = useState({ drawInProcess: false, resizeDir: "", drew: false, startRectX: 0, startRectY: 0, moveStart: false, moved: false })
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
                            strokeWidth: mainState.strokeWidth,
                            strokeStyle: mainState.strokeColor,
                            fillStyle: mainState.fillColor,
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
                default:
                    break;
            }
        }

    }

    function handleMouseDown(event: any) {
        let pageX;
        let pageY;
        if (event.type === 'touchstart') {
            pageX = event.touches[0].pageX;
            pageY = event.touches[0].pageY;
        } else {
            pageX = event.pageX;
            pageY = event.pageY;
        }
        if (!selectedItem) {
            let rect = document.getElementById("canvas")!.getBoundingClientRect();
            updateState(event, rect, state.drawInProcess)
            setState({
                ...state,
                drawInProcess: true, startRectX: pageX - rect.left,
                startRectY: pageY - rect.top
            });
        } else if (selectedItem !== null) {
            let px = pageX as number
            let py = pageY as number
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
        ctx.canvas.width = window.innerWidth
        ctx.canvas.height = window.innerHeight
        let itms = JSON.parse(localStorage.getItem("canvasItems") || "[]")
        setItems(itms)
        if (JSON.stringify(History.getCurrentState()) !== localStorage.getItem("canvasItems")) {
            History.addHistory(itms)
        }
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
            setState({ ...state, startRectX: px, startRectY: py, moved: true })
            const updatedItems = moveItem(px - state.startRectX, py - state.startRectY, selectedItem, items)
            if (updatedItems) {
                setItems(updatedItems)
            }
        } else if (state.resizeDir && selectedItem) {
            let px = event.pageX as number
            let py = event.pageY as number
            setState({ ...state, startRectX: px, startRectY: py })
            const updatedItems = resizeSelected(state.resizeDir, px - state.startRectX, py - state.startRectY, selectedItem, items)
            setItems(updatedItems)
        }
    }

    function handleTouchMove(event: any) {
        let c = document.getElementById("canvas") as HTMLCanvasElement;
        let rect = c.getBoundingClientRect();
        if (state.drawInProcess) {
            updateState(event.touches[0], rect, true);
            setState({ ...state, drew: true });
        } else if (state.moveStart && selectedItem) {
            let px = event.touches[0].pageX as number;
            let py = event.touches[0].pageY as number;
            setState({ ...state, startRectX: px, startRectY: py });
            const updatedItems = moveItem(px - state.startRectX, py - state.startRectY, selectedItem, items);
            if (updatedItems) {
                setItems(updatedItems);
            }
        } else if (state.resizeDir && selectedItem) {
            let px = event.touches[0].pageX as number;
            let py = event.touches[0].pageY as number;
            setState({ ...state, startRectX: px, startRectY: py });
            const updatedItems = resizeSelected(
                state.resizeDir,
                px - state.startRectX,
                py - state.startRectY,
                selectedItem,
                items
            );
            setItems(updatedItems);
        }
    }

    useEffect(() => {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        ctx.clearRect(0, 0, window.devicePixelRatio * window.innerWidth, window.devicePixelRatio * window.innerHeight)
        if (items.length > 0) {
            renderElements(ctx, items)
            localStorage.setItem("canvasItems", JSON.stringify(items))
        }
        if (mainState.tool !== "select" && mainState.tool !== "eraser") {
            renderCurrentDrawing(ctx, current[mainState.tool])
        }
        if (selectedItem) {
            const bounds = getBoundingBox(selectedItem)
            if (bounds) {
                renderBounds(ctx, bounds)
            }
        }
    }, [items, current, selectedItem])

    useEffect(() => {
        if (!selectedItem) {
            updateMainState(defaultValues)
        } else {
            const item = getSelectedItem(selectedItem.id, items)
            if (item) {
                updateAppStateFromSelectedItem(updateMainState, mainState, item)
            }
        }
    }, [selectedItem?.id])


    function handleMouseUp() {
        let itemID = ""
        if (mainState.tool !== "select" && mainState.tool !== "eraser" && current) {
            itemID = current[mainState.tool].id
            if (itemID) {
                setItems([...items, current[mainState.tool]])
                History.addHistory([...items, current[mainState.tool]])
            }
            setCurrent(intialStates)
        }

        if (state.drew && mainState.tool !== "select") {
            updateMainState({ ...mainState, tool: "select", selectedItemID: itemID })
        }
        if (state.moved || state.resizeDir !== "") {
            History.addHistory(items)
        }

        setState({ ...state, drawInProcess: false, moveStart: false, moved: false, drew: false, resizeDir: "" })
    }

    function handleClick(event: any) {
        updateMainState({ ...mainState, selectedItemID: getItemEnclosingPoint(event.pageX, event.pageY, items) })
    }

    // function handleText(event: React.KeyboardEvent<HTMLCanvasElement>) {
    //     if (mainState.tool === "text") {
    //         if (event.key === "Shift"
    //             || event.key === "Control"
    //             || event.key === "CapsLock"
    //             || event.key === "Alt"
    //             || event.key === "Escape"
    //             || event.key === "ArrowLeft"
    //             || event.key === "ArrowRight"
    //             || event.key === "ArrowUp"
    //             || event.key === "ArrowDown") return;
    //         let text = current.text.text
    //         if (event.key === "Backspace") {
    //             text = text.substring(0, text.length - 1)
    //         } else if (event.key === "Enter") {
    //             text += "\n"
    //         } else {
    //             text += event.key
    //         }
    //         setCurrent({
    //             ...current,
    //             text: {
    //                 ...current.text,
    //                 text
    //             }
    //         })
    //     }
    // }

    return (
        <main className="relative">
            {mainState.tool === "text" ? <textarea
                className="absolute outline-0"
                placeholder="Enter text"
                onBlur={(e) => {
                    if (e.target.value.trim() === "") return
                    const target = e.target as HTMLTextAreaElement
                    let c = document.getElementById("canvas") as HTMLCanvasElement
                    let ctx = c.getContext('2d')!;
                    ctx.save()
                    ctx.font = `bold ${current.text.fontSize}px ${current.text.fontFamily}`
                    const itemID = getRandomID()
                    const textLines = target.value.split("\n")
                    let max = ""
                    for (let line of textLines) {
                        if (line.length > max.length) {
                            max = line
                        }
                    }
                    const textItem: Text = {
                        ...current.text,
                        id: itemID,
                        text: target.value,
                        width: ctx.measureText(max).width,
                        height: textLines.length * current.text.fontSize
                    }
                    ctx.restore()
                    setCurrent(prevState => ({
                        ...prevState,
                        text: textItem
                    }))
                    setItems([...items, textItem])
                    setCurrent(intialStates)
                    updateMainState({ ...mainState, tool: "select", selectedItemID: itemID })

                }}
                tabIndex={0}
                style={{
                    top: current.text.y + 3 - current.text.fontSize / 2,
                    left: current.text.x,
                    fontFamily: current.text.fontFamily,
                    fontSize: current.text.fontSize,
                    color: current.text.strokeStyle,
                    fontWeight: "bold",
                }}
            ></textarea>
                : null
            }
            <canvas
                className="appearance-none outline-0"
                id="canvas"
                style={{
                    backgroundColor: "white"
                }}
                tabIndex={0}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleClick}
                onTouchStart={handleMouseDown}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
            >
            </canvas>

        </main>

    )
}