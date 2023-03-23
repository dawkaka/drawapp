import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { defaultValues } from "../constants";
import { useInitialState } from "../hooks";
import { AppDrawings, AppState, SelectionAtom } from "../jotai";
import { renderElements, renderCurrentDrawing, renderBounds } from "../lib/render";
import {
    getBoundingBox, getItemEnclosingPoint, getRandomID,
    getSelectedItem, isWithinItem, isWithinResizeArea,
    moveItem, resizeSelected, updateAppStateFromSelectedItem
} from "../lib/utils";
import { CurrentState, NonDrawingTools, Text, Tool } from "../types";
import History from "../lib/history";

export default function Canvas() {
    const [state, setState] = useState({ drawInProcess: false, resizeDir: "", drew: false, startRectX: 0, startRectY: 0, moveStart: false, moved: false })
    const [mainState, updateMainState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const intialStates = useInitialState()
    const [current, setCurrent] = useState<CurrentState>(intialStates)
    const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 })
    const [panStart, setPanStart] = useState<{ x: number, y: number } | null>(null);

    const [selectedItem] = useAtom(SelectionAtom)


    function updateState(event: any, drawInProcess: boolean) {
        if (!drawInProcess) {
            switch (mainState.tool) {
                case "line":
                    setCurrent({
                        ...current,
                        line: {
                            ...current.line,
                            x: event.pageX + cameraOffset.x,
                            y: event.pageY + cameraOffset.y,
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
                            x: event.pageX + cameraOffset.x,
                            y: event.pageY + cameraOffset.y,
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
                            x: event.pageX + cameraOffset.x,
                            y: event.pageY + cameraOffset.y,
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
                            x: event.pageX + cameraOffset.x,
                            y: event.pageY + cameraOffset.y,
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
                            x: event.pageX + cameraOffset.x,
                            y: event.pageY + cameraOffset.y,
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
                            x: event.pageX + cameraOffset.x,
                            y: event.pageY + cameraOffset.y,
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
                            x: event.pageX + cameraOffset.x,
                            y: event.pageY + cameraOffset.y,
                            opacity: mainState.opacity,
                            fontFamily: mainState.fontFamily,
                            fontSize: mainState.fontSize,
                            textStyle: mainState.textStyle,
                            strokeWidth: mainState.strokeWidth,
                            strokeStyle: mainState.strokeColor,
                            fillStyle: mainState.fillColor,
                            alignment: mainState.textAlign
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
                                    x: (event.pageX + cameraOffset.x - current.line.x) / 2,
                                    y: (event.pageY + cameraOffset.y - current.line.y) / 2
                                },
                                {
                                    x: event.pageX + cameraOffset.x - current.line.x,
                                    y: event.pageY + cameraOffset.y - current.line.y,
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
                                x: event.pageX + cameraOffset.x - current.pencil.x,
                                y: event.pageY + cameraOffset.y - current.pencil.y,
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
                            width: event.pageX + cameraOffset.x - current.rectangle.x,
                            height: event.pageY + cameraOffset.y - current.rectangle.y,
                        }
                    })
                    break;
                case "diamond":
                    setCurrent({
                        ...current,
                        diamond: {
                            ...current.diamond,
                            id: getRandomID(),
                            width: event.pageX + cameraOffset.x - current.diamond.x,
                            height: event.pageY + cameraOffset.y - current.diamond.y,
                        }
                    })
                    break;
                case "ellipse":
                    setCurrent({
                        ...current,
                        ellipse: {
                            ...current.ellipse,
                            id: getRandomID(),
                            width: event.pageX + cameraOffset.x - current.ellipse.x,
                            height: event.pageY + cameraOffset.y - current.ellipse.y,
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
                                    x: (event.pageX + cameraOffset.x - current.arrow.x) / 2,
                                    y: (event.pageY + cameraOffset.y - current.arrow.y) / 2
                                },
                                {
                                    x: event.pageX + cameraOffset.x - current.arrow.x,
                                    y: event.pageY + cameraOffset.y - current.arrow.y,
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
        if (mainState.tool === "move") {
            setPanStart({ x: pageX, y: pageY })
            return
        }

        if (!selectedItem) {
            updateState(event, state.drawInProcess)
            setState({
                ...state,
                drawInProcess: true, startRectX: pageX,
                startRectY: pageY,
            });
        } else if (selectedItem !== null) {
            let px = pageX as number
            let py = pageY as number
            let x = px + (-1 * cameraOffset.x)
            let y = py + (-1 * cameraOffset.y)
            const resizeDir = isWithinResizeArea(x, y, selectedItem)
            if (resizeDir) {
                setState({
                    ...state, startRectX: px + cameraOffset.x,
                    startRectY: py + cameraOffset.y,
                    resizeDir: resizeDir
                })
            } else if (isWithinItem(x, y, selectedItem)) {
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
        if (panStart) {
            let px = event.pageX as number
            let py = event.pageY as number
            setCameraOffset({ x: cameraOffset.x + (px - panStart.x), y: cameraOffset.y + (py - panStart.y) })
            setState({ ...state, startRectX: px, startRectY: py })
            setPanStart({ x: px, y: py })
        } else if (state.drawInProcess && mainState.tool !== "move") {
            updateState(event, true)
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
        if (state.drawInProcess) {
            updateState(event.touches[0], true);
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

        let x = cameraOffset.x < 0 ? cameraOffset.x : 0 - cameraOffset.x
        let y = cameraOffset.y < 0 ? cameraOffset.y : 0 - cameraOffset.y
        ctx.clearRect(x, y, window.devicePixelRatio * window.innerWidth + (-1 * x), window.devicePixelRatio * window.innerHeight + (-1 * y))
        if (items.length > 0) {
            renderElements(ctx, items)
            localStorage.setItem("canvasItems", JSON.stringify(items))
        }

        if (mainState.tool !== "select" && mainState.tool !== "eraser" && mainState.tool !== "move") {
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
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        ctx.translate(cameraOffset.x, cameraOffset.y)
        let x = cameraOffset.x < 0 ? cameraOffset.x : 0 - cameraOffset.x
        let y = cameraOffset.y < 0 ? cameraOffset.y : 0 - cameraOffset.y
        ctx.clearRect(x, y, window.devicePixelRatio * window.innerWidth + (-1 * x), window.devicePixelRatio * window.innerHeight + (-1 * y))

        if (items.length > 0) {
            renderElements(ctx, items)
            localStorage.setItem("canvasItems", JSON.stringify(items))
        }
        return () => {
            ctx.translate(-cameraOffset.x, -cameraOffset.y);
        }
    }, [cameraOffset])

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
        if (mainState.tool !== "select" && mainState.tool !== "eraser" && mainState.tool !== "move" && current) {
            itemID = current[mainState.tool].id
            if (itemID) {
                setItems([...items, current[mainState.tool]])
                History.addHistory([...items, current[mainState.tool]])
            }
            setCurrent(intialStates)
        }

        if ((state.drew && mainState.tool !== "select") || mainState.tool !== "move") {
            updateMainState({ ...mainState, tool: "select", selectedItemID: itemID })
        }
        if (state.moved || state.resizeDir !== "") {
            History.addHistory(items)
        }

        setState({ ...state, drawInProcess: false, startRectX: 0, startRectY: 0, moveStart: false, moved: false, drew: false, resizeDir: "" })
        setPanStart(null)
    }

    function handleClick(event: any) {
        let x = event.pageX + (-1 * cameraOffset.x)
        let y = event.pageY + (-1 * cameraOffset.y)
        updateMainState({ ...mainState, selectedItemID: getItemEnclosingPoint(x, y, items) })
    }

    return (
        <main className="relative">
            {mainState.tool === "text" ? <textarea
                className="absolute outline-0 overflow-hidden"
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
                onKeyUp={(e) => {
                    let c = document.getElementById("canvas") as HTMLCanvasElement
                    let ctx = c.getContext('2d')!;
                    ctx.save()
                    ctx.font = `bold ${current.text.fontSize}px ${current.text.fontFamily}`
                    const textLines = e.currentTarget.value.split("\n")
                    let max = ""
                    for (let line of textLines) {
                        if (line.length > max.length) {
                            max = line
                        }
                    }
                    e.currentTarget.style.width = "1px";
                    e.currentTarget.style.width = ctx.measureText(max).width + 40 + "px"
                    e.currentTarget.style.maxWidth = "100%";
                    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                    e.currentTarget.style.maxHeight = "100%";
                    ctx.restore()
                }}

                autoComplete="off"
                autoCorrect="off"
                autoFocus
                tabIndex={0}
                rows={1}
                style={{
                    border: "1px solid darkorange",
                    padding: 8,
                    scrollbarWidth: "none",
                    resize: "none",
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