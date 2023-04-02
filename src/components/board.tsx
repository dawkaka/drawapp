import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Cursor, defaultValues } from "../constants";
import { useInitialState } from "../hooks";
import { AppDrawings, AppState, SelectionAtom } from "../jotai";
import { renderElements, renderCurrentDrawing, renderBounds, drawSelection, drawMultipleSelectionBounds } from "../lib/render";
import {
    calculatePointsDistance,
    getBoundingBox, getCursor, getItemEnclosingPoint, getMultipleSelection, getMultipleSelectionBounds, getRandomID,
    getSelectedItem, isPointInsideRectangle, isWithinItem, isWithinMultiSelectionResizeArea, isWithinResizeArea,
    moveItem, moveItems, resizeMultipleItems, resizeSelected, simplifyPath, updateAppStateFromSelectedItem
} from "../lib/utils";
import { CurrentState, MultipleSelection, Point, Text } from "../types";
import History from "../lib/history";

export default function Canvas() {
    const [state, setState] = useState({ drawInProcess: false, resizeDir: "", drew: false, multiSelected: false, startRectX: 0, startRectY: 0, moveStart: false, moved: false })
    const [mainState, updateMainState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const intialStates = useInitialState()
    const [current, setCurrent] = useState<CurrentState>(intialStates)
    const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 })
    const [panStart, setPanStart] = useState<{ x: number, y: number } | null>(null);
    const [selection, setSelection] = useState<{ x: number, y: number, w: number, h: number } | null>(null)
    const [multipleSelectionBounds, setMultipleSelectionBounds] = useState<MultipleSelection | null>(null)
    const stateRef = useRef<{ selectedItems: string[], multiMove: boolean, multiMoved: boolean }>({ multiMove: false, multiMoved: false, selectedItems: [] })
    const [selectedItem] = useAtom(SelectionAtom)
    const [cursor, setCursor] = useState<Cursor>(Cursor.Auto);

    function updateState(event: any, drawInProcess: boolean) {
        let x = event.pageX + (-1 * cameraOffset.x)
        let y = event.pageY + (-1 * cameraOffset.y)
        if (!drawInProcess) {
            switch (mainState.tool) {
                case "line":
                    setCurrent({
                        ...current,
                        line: {
                            ...current.line,
                            x,
                            y,
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
                            x: x,
                            y: y,
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
                            x: x,
                            y: y,
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
                            x: x,
                            y: y,
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
                            x: x,
                            y: y,
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
                            x: x,
                            y: y,
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
                            x: event.pageX,
                            y: event.pageY,
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
                                    x: (x - current.line.x) / 2,
                                    y: (y - current.line.y) / 2
                                },
                                {
                                    x: x - current.line.x,
                                    y: y - current.line.y,
                                }],
                        }
                    })
                    break;
                case "pencil":
                    const points = simplifyPath([...current.pencil.points, {
                        x: x - current.pencil.x,
                        y: y - current.pencil.y,
                    }], 5)
                    setCurrent({
                        ...current,
                        pencil: {
                            ...current.pencil,
                            id: getRandomID(),
                            points
                        }
                    })
                    break;
                case "rectangle":
                    setCurrent({
                        ...current,
                        rectangle: {
                            ...current.rectangle,
                            id: getRandomID(),
                            width: x - current.rectangle.x,
                            height: y - current.rectangle.y,
                        }
                    })
                    break;
                case "diamond":
                    setCurrent({
                        ...current,
                        diamond: {
                            ...current.diamond,
                            id: getRandomID(),
                            width: x - current.diamond.x,
                            height: y - current.diamond.y,
                        }
                    })
                    break;
                case "ellipse":
                    setCurrent({
                        ...current,
                        ellipse: {
                            ...current.ellipse,
                            id: getRandomID(),
                            width: x - current.ellipse.x,
                            height: y - current.ellipse.y,
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
                                    x: (x - current.arrow.x) / 2,
                                    y: (y - current.arrow.y) / 2
                                },
                                {
                                    x: x - current.arrow.x,
                                    y: y - current.arrow.y,
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
        let px = pageX as number
        let py = pageY as number
        let x = px + (-1 * cameraOffset.x)
        let y = py + (-1 * cameraOffset.y)
        if (mainState.tool === "select") {
            if (multipleSelectionBounds && isWithinMultiSelectionResizeArea(x, y, multipleSelectionBounds.resizeAreas)) {
                const resizeDir = isWithinMultiSelectionResizeArea(x, y, multipleSelectionBounds.resizeAreas)
                if (resizeDir) {
                    setState({
                        ...state,
                        resizeDir: resizeDir,
                        drawInProcess: true, startRectX: pageX,
                        startRectY: pageY,
                    });
                }
            } else {
                if (multipleSelectionBounds && isPointInsideRectangle(x, y, multipleSelectionBounds.x, multipleSelectionBounds.y, multipleSelectionBounds.width, multipleSelectionBounds.height)) {
                    stateRef.current.multiMove = true
                } else {
                    stateRef.current.multiMove = false
                }
                setState({
                    ...state,
                    drawInProcess: true, startRectX: pageX,
                    startRectY: pageY,
                });
            }

        } else if (!selectedItem) {
            updateState(event, state.drawInProcess)
            setState({
                ...state,
                drawInProcess: true, startRectX: pageX,
                startRectY: pageY,
            });
        } else if (selectedItem !== null) {
            const resizeDir = isWithinResizeArea(x, y, selectedItem)
            if (resizeDir) {
                setState({
                    ...state, startRectX: px,
                    startRectY: py,
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
        let px = event.pageX as number
        let py = event.pageY as number
        if (panStart) {
            setCursor(Cursor.Grabbing)
            setCameraOffset({ x: cameraOffset.x + (px - panStart.x), y: cameraOffset.y + (py - panStart.y) })
            setState({ ...state, startRectX: px, startRectY: py })
            setPanStart({ x: px, y: py })
        } else if (stateRef.current.multiMove) {
            setState({ ...state, startRectX: px, startRectY: py, moved: true })
            setCursor(Cursor.Move)
            const updatedItems = moveItems(px - state.startRectX, py - state.startRectY, mainState.multipleSelections, items)
            setMultipleSelectionBounds(getMultipleSelectionBounds(stateRef.current.selectedItems, items))
            if (updatedItems) {
                setItems(updatedItems)
            }
        } else if (state.resizeDir && multipleSelectionBounds) {
            setState({ ...state, startRectX: px, startRectY: py })
            const dy = py - state.startRectY
            const dx = px - state.startRectX
            let updatedItems = resizeMultipleItems(state.resizeDir, dy, dx, mainState.multipleSelections, items, multipleSelectionBounds.x, multipleSelectionBounds.y, multipleSelectionBounds.width, multipleSelectionBounds.height)
            if (state.resizeDir !== "br") {
                updatedItems = resizeMultipleItems(state.resizeDir, dy, dx, mainState.multipleSelections, items, multipleSelectionBounds.x, multipleSelectionBounds.y, multipleSelectionBounds.width, multipleSelectionBounds.height)
            }
            setItems(updatedItems)
            setMultipleSelectionBounds(getMultipleSelectionBounds(stateRef.current.selectedItems, items))

        } else if (mainState.tool === "select" && state.drawInProcess) {
            const w = event.pageX - state.startRectX
            const h = event.pageY - state.startRectY
            const x = state.startRectX + (-1 * cameraOffset.x)
            const y = state.startRectY + (-1 * cameraOffset.y)
            setSelection({ x, y, w, h })
            stateRef.current.selectedItems = getMultipleSelection(items, x, y, w, h)
            if (stateRef.current.selectedItems.length > 0) {
                setMultipleSelectionBounds(getMultipleSelectionBounds(stateRef.current.selectedItems, items))
                updateMainState({ ...mainState, multipleSelections: stateRef.current.selectedItems })
            }

        } else if (state.drawInProcess && mainState.tool !== "move") {
            updateState(event, true)
            setState({ ...state, drew: true })
        } else if (state.moveStart && selectedItem) {
            setCursor(Cursor.Move)
            setState({ ...state, startRectX: px, startRectY: py, moved: true })
            const updatedItems = moveItem(px - state.startRectX, py - state.startRectY, selectedItem, items)
            if (updatedItems) {
                setItems(updatedItems)
            }
        } else if (state.resizeDir && selectedItem) {
            setState({ ...state, startRectX: px, startRectY: py })
            const updatedItems = resizeSelected(state.resizeDir, px - state.startRectX, py - state.startRectY, selectedItem, items)
            setItems(updatedItems)
        } else {
            const x = px + (-1 * cameraOffset.x)
            const y = py + (-1 * cameraOffset.y)
            if (selectedItem || multipleSelectionBounds) {
                let resizeDir = selectedItem ? isWithinResizeArea(x, y, selectedItem) : multipleSelectionBounds ? isWithinMultiSelectionResizeArea(x, y, multipleSelectionBounds?.resizeAreas) : ""
                if (resizeDir) {
                    setCursor(getCursor(resizeDir))
                } else {
                    if (
                        (
                            selectedItem &&
                            isWithinItem(x, y, selectedItem)
                        ) ||
                        (
                            multipleSelectionBounds &&
                            isPointInsideRectangle(x, y, multipleSelectionBounds.x, multipleSelectionBounds.y, multipleSelectionBounds.width, multipleSelectionBounds.height)
                        )
                    ) {
                        setCursor(Cursor.Move)
                    } else {
                        setCursor(Cursor.Auto)
                    }
                }
            } else {
                setCursor(getCursor(mainState.tool))
            }
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

        let x = cameraOffset.x < 0 ? cameraOffset.x : 0 - cameraOffset.x;
        let y = cameraOffset.y < 0 ? cameraOffset.y : 0 - cameraOffset.y;
        let width = window.devicePixelRatio * window.innerWidth + Math.abs(cameraOffset.x * 2);
        let height = window.devicePixelRatio * window.innerHeight + Math.abs(cameraOffset.y * 2);
        ctx.clearRect(x, y, width, height);
        if (items.length > 0) {
            renderElements(ctx, items)
            localStorage.setItem("canvasItems", JSON.stringify(items))
        }

        if (mainState.tool !== "select" && mainState.tool !== "eraser" && mainState.tool !== "move") {
            renderCurrentDrawing(ctx, current[mainState.tool])
        }
        if (multipleSelectionBounds) {
            drawMultipleSelectionBounds(ctx, multipleSelectionBounds)
        }
        if (selection) {
            drawSelection(ctx, selection)
        } else if (selectedItem) {
            const bounds = getBoundingBox(selectedItem)
            if (bounds) {
                renderBounds(ctx, bounds)
            }
        }
    }, [items, current, selectedItem, selection, multipleSelectionBounds])

    useEffect(() => {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        ctx.translate(cameraOffset.x, cameraOffset.y)
        let x = cameraOffset.x < 0 ? cameraOffset.x : 0 - cameraOffset.x;
        let y = cameraOffset.y < 0 ? cameraOffset.y : 0 - cameraOffset.y;
        let width = window.devicePixelRatio * window.innerWidth + Math.abs(cameraOffset.x * 2);
        let height = window.devicePixelRatio * window.innerHeight + Math.abs(cameraOffset.y * 2);
        ctx.clearRect(x, y, width, height);
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

    useEffect(() => {
        setCursor(getCursor(mainState.tool))
    }, [mainState.tool])

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
        if ((state.drew && mainState.tool !== "select") || (mainState.tool !== "move" && state.resizeDir === "")) {
            updateMainState({ ...mainState, tool: "select", selectedItemID: itemID })
        }
        if (state.moved || state.resizeDir !== "") {
            History.addHistory(items)
        }
        stateRef.current.multiMove = false
        if (multipleSelectionBounds) {
            if (!selection && !state.moved && !state.resizeDir) {
                setMultipleSelectionBounds(null)
            }
            setState({ ...state, drawInProcess: false, startRectX: 0, startRectY: 0, multiSelected: true, moveStart: false, moved: false, drew: false })
        } else {
            setState({ ...state, drawInProcess: false, startRectX: 0, startRectY: 0, multiSelected: false, moveStart: false, moved: false, drew: false })
        }
        setPanStart(null)
    }

    function handleClick(event: any) {
        let x = event.pageX + (-1 * cameraOffset.x)
        let y = event.pageY + (-1 * cameraOffset.y)
        let selectedItemID = selectedItem ? selectedItem.id : ""
        if (state.resizeDir === "" || (!selectedItem && !multipleSelectionBounds)) {
            selectedItemID = getItemEnclosingPoint(x, y, items)
        }
        setState({ ...state, resizeDir: "" })
        setSelection(null)
        updateMainState({ ...mainState, multipleSelections: multipleSelectionBounds ? mainState.multipleSelections : [], selectedItemID: multipleSelectionBounds ? "" : selectedItemID })
    }

    return (
        <main className="relative">
            {(mainState.tool === "text" && current.text.x !== 0) ? <textarea
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
                        x: current.text.x + (-1 * cameraOffset.x),
                        y: current.text.y + (-1 * cameraOffset.y),
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
                    backgroundColor: "white",
                    cursor
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