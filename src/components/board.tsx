import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { renderPencilDrawing } from "../lib/render";

export default function Canvas() {
    const [state, setState] = useState({
        drawInProcess: false,
        startRectX: 0,
        startRectY: 0
    })
    const startUP = useRef<boolean>(false)
    const [points, setPoints] = useState<{ x: number, y: number }[]>([])

    function handleMouseDown(event: any) {
        let rect = document.getElementById("canvas")!.getBoundingClientRect();
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
        setPoints(JSON.parse(localStorage.getItem("points")!))
    }, [])

    function handleMouseMove(event: any) {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let rect = c.getBoundingClientRect();
        if (state.drawInProcess) {
            setPoints([...points, {
                x: event.pageX - rect.left,
                y: event.pageY - rect.top
            }])
        }
    }

    useEffect(() => {
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        ctx.clearRect(0, 0, window.devicePixelRatio * window.innerWidth, window.devicePixelRatio * window.innerHeight)
        renderPencilDrawing(ctx, points)
    }, [points])

    function handleMouseUp(event: any) {
        localStorage.setItem("points", JSON.stringify(points))
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
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