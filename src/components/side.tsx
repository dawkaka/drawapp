import { useAtom } from "jotai"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { AppDrawings, AppState } from "../jotai"
import { renderElements } from "../lib/render"
import ColorPanel from "./colorpick"
import Modal from "./modal"
import { Actions, FillToolsOptions, ImageOptions, Layers, Opacity, TextOptions } from "./toolOptions"
import Tools from "./tools"
import history from "../lib/history"

export default function Side() {
    const [closed, setClosed] = useState(true)
    const [{ tool }] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [modal, setModal] = useState(false)
    const [width, setWidth] = useState(300)
    const sideRef = useRef(null)
    const [theme, setTheme] = useState<"dark" | "light">("light")

    useLayoutEffect(() => {
        const t = localStorage.getItem("theme")
        if (t) {
            setTheme(t === "dark" ? "dark" : "light")
        }
    }, [])

    useEffect(() => {
        let w = window.innerWidth
        if (w < 768) {
            const ww = Math.max(200, w * 0.35)
            setWidth(ww)
            setClosed(true)
        } else {
            setClosed(false)
        }
    }, [])

    function deleteAllItems() {
        setItems([])
        localStorage.setItem("canvasItems", "[]")
        setModal(false)
    }
    function downloadCanvasAsPNG() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement
        const link = document.createElement("a");
        let c = document.getElementById("canvas") as HTMLCanvasElement
        let ctx = c.getContext('2d')!;
        ctx.clearRect(0, 0, window.devicePixelRatio * window.innerWidth, window.devicePixelRatio * window.innerHeight)
        ctx.save()
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, window.devicePixelRatio * window.innerWidth, window.devicePixelRatio * window.innerHeight);
        ctx.restore()
        if (items.length > 0) {
            renderElements(ctx, items)
            localStorage.setItem("canvasItems", JSON.stringify(items))
        }
        link.download = "canvas.jpeg";
        link.href = canvas.toDataURL("image/jpeg");
        link.click();
    }

    function undo() {
        let itm = history.undo()
        setItems(itm)
        localStorage.setItem("canvasItems", JSON.stringify(itm))

    }

    function redo() {
        let itm = history.redo()
        setItems(itm)
        localStorage.setItem("canvasItems", JSON.stringify(itm))
    }

    function changeTheme() {
        let root = document.querySelector("#root")!
        if (theme === "light") {
            setTheme("dark")
            localStorage.setItem("theme", "dark")
            root.className = "dark"
            document.documentElement.style.colorScheme = "dark"
        } else {
            setTheme("light")
            localStorage.setItem("theme", "light")
            root.className = "light"
            document.documentElement.style.colorScheme = "light"
        }
    }

    return (
        <>
            <aside
                className="bg-[var(--accents-1)] fixed  flex flex-col items-center top-0 left-0 bottom-0 border-r border-[var(--accents-2)]  transition-all z-10 overflow-hidden"
                ref={sideRef}
                style={{
                    width: closed ? 0 : width + 'px'
                }}
            >
                {
                    modal && <Modal close={() => setModal(false)} clearFunc={deleteAllItems} />
                }

                <div className="bg-[var(--accents-1)] relative w-full h-full overflow-y-auto pb-10">
                    <ColorPanel />
                    <Tools />
                    <div className="flex flex-col gap-5 p-2 shadow bg-[var(--background)] mx-3 my-5 rounded p-5">
                        {
                            (tool === "ellipse" || tool === "rectangle" || tool === "diamond" || tool === "arrow" || tool === "line" || tool === "pencil") && <FillToolsOptions />
                        }
                        {
                            tool === "text" && <TextOptions />
                        }
                        {
                            tool === "image" && <ImageOptions />
                        }
                        <Opacity />
                        <Layers />
                        <Actions />
                    </div>
                </div>

                <div className="flex flex-col px-2 shadow bg-[var(--background)] text-[var(--accents-7)] rounded-lg md:rounded fixed right-2 md:right-auto md:flex-row md:absolute bottom-5 md:px-5 py-2 gap-5 md:z-11">

                    <button className="w-fit p-1 rounded hover:bg-[#faecd2] hover:text-[darkorange] border border-[var(--accents-2)]" onClick={() => setModal(true)}>
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="red" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2 4.656a.5.5 0 01.5-.5h9.7a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5z"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.272 3a.578.578 0 00-.578.578v.578h3.311v-.578A.578.578 0 008.428 3H6.272zm3.733 1.156v-.578A1.578 1.578 0 008.428 2H6.272a1.578 1.578 0 00-1.578 1.578v.578H3.578a.5.5 0 00-.5.5V12.2a1.578 1.578 0 001.577 1.578h5.39a1.578 1.578 0 001.577-1.578V4.656a.5.5 0 00-.5-.5h-1.117zm-5.927 1V12.2a.578.578 0 00.577.578h5.39a.578.578 0 00.577-.578V5.156H4.078z">
                            </path><path fillRule="evenodd" clipRule="evenodd" d="M6.272 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5zM8.428 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5z">
                            </path></svg>
                    </button>

                    <button className="w-fit p-1 rounded hover:bg-[#faecd2] hover:text-[darkorange] border border-[var(--accents-2)]" onClick={changeTheme}>
                        {
                            theme === "light" ? <svg width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" transform="matrix(-1, 0, 0, 1, 0, 0)">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                                    <path d="M785.334 194.943c174.789 174.787 174.789 459.179 0 633.967-174.787 174.787-459.178 174.787-633.967 0-13.206-13.205-26.22-28.336-39.807-46.314a19.672 19.672 0 0 1-2.223-20.012 19.777 19.777 0 0 1 16.54-11.442c98.838-6.698 191.601-48.753 261.234-118.386C530.853 489.014 546.472 258.475 423.392 96.51a19.553 19.553 0 0 1-2.249-19.981 19.554 19.554 0 0 1 16.54-11.497c129.587-8.759 256.325 38.583 347.651 129.911z" fill="#2577F">
                                    </path>
                                    <path d="M785.334 194.943c-14.266-14.268-29.484-27.325-45.354-39.399 151.302 175.925 143.723 442.269-22.987 608.98-121.85 121.85-307.044 190.195-461.161 142.154 60.038 35.511 140.886 47.603 167.101 50.984 129.417 13.067 263.464-29.816 362.401-128.753 174.789-174.787 174.789-459.179 0-633.966z" fill="#030504">
                                    </path>
                                </g>
                            </svg>
                                :
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#a)" fill="currentColor">
                                        <path d="M12 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1ZM4.929 3.515a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 0 0 1.414-1.414L4.93 3.515ZM1 11a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H1ZM18 12a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM17.657 16.243a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 1 0 1.414-1.414l-2.828-2.828ZM7.757 17.657a1 1 0 1 0-1.414-1.414L3.515 19.07a1 1 0 1 0 1.414 1.414l2.828-2.828ZM20.485 4.929a1 1 0 0 0-1.414-1.414l-2.828 2.828a1 1 0 1 0 1.414 1.414l2.828-2.828ZM13 19a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"></path>
                                    </g>
                                        <defs>
                                            <clipPath id="a">
                                                <path fill="#ffffff" d="M0 0h24v24H0z"></path>
                                            </clipPath>
                                        </defs>
                                    </g>
                                </svg>
                        }

                    </button>

                    <button
                        className="w-fit p-1 rounded hover:bg-[#faecd2]  hover:text-[darkorange]  border border-[var(--accents-2)]"
                        onClick={undo}
                    >
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scale(1, 1)" }}>
                            <path d="M10.6707 8.5081C10.6707 10.1923 9.3004 11.5625 7.61631 11.5625H6.5351C6.35593 11.5625 6.21074 11.4173 6.21074 11.2382V11.13C6.21074 10.9508 6.35591 10.8057 6.5351 10.8057H7.61631C8.88313 10.8057 9.91387 9.77492 9.91387 8.5081C9.91387 7.24128 8.88313 6.21054 7.61631 6.21054H5.62155L6.99534 7.58433C7.14289 7.73183 7.14289 7.97195 6.99534 8.11944C6.85216 8.26251 6.60298 8.2623 6.46013 8.11944L4.44045 6.09971C4.36898 6.02824 4.32959 5.93321 4.32959 5.8321C4.32959 5.73106 4.36898 5.63598 4.44045 5.56454L6.46024 3.54472C6.60309 3.40176 6.85248 3.40176 6.99535 3.54472C7.14291 3.69218 7.14291 3.93234 6.99535 4.07979L5.62156 5.45368H7.61631C9.3004 5.45368 10.6707 6.82393 10.6707 8.5081Z">
                            </path></svg>
                    </button>

                    <button
                        className="w-fit p-1 rounded hover:bg-[#faecd2]  hover:text-[darkorange]  border border-[var(--accents-2)]"
                        onClick={redo}
                    >
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scale(-1, 1)" }}>
                            <path d="M10.6707 8.5081C10.6707 10.1923 9.3004 11.5625 7.61631 11.5625H6.5351C6.35593 11.5625 6.21074 11.4173 6.21074 11.2382V11.13C6.21074 10.9508 6.35591 10.8057 6.5351 10.8057H7.61631C8.88313 10.8057 9.91387 9.77492 9.91387 8.5081C9.91387 7.24128 8.88313 6.21054 7.61631 6.21054H5.62155L6.99534 7.58433C7.14289 7.73183 7.14289 7.97195 6.99534 8.11944C6.85216 8.26251 6.60298 8.2623 6.46013 8.11944L4.44045 6.09971C4.36898 6.02824 4.32959 5.93321 4.32959 5.8321C4.32959 5.73106 4.36898 5.63598 4.44045 5.56454L6.46024 3.54472C6.60309 3.40176 6.85248 3.40176 6.99535 3.54472C7.14291 3.69218 7.14291 3.93234 6.99535 4.07979L5.62156 5.45368H7.61631C9.3004 5.45368 10.6707 6.82393 10.6707 8.5081Z">
                            </path></svg>
                    </button>
                    <button className="w-fit p-1 rounded hover:bg-[#faecd2] hover:text-[darkorange] border border-[var(--accents-2)]"
                        onClick={downloadCanvasAsPNG}
                    >
                        <svg aria-hidden="true" width="22" height="22" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path strokeWidth="1.25" d="M3.333 14.167v1.666c0 .92.747 1.667 1.667 1.667h10c.92 0 1.667-.746 1.667-1.667v-1.666M5.833 9.167 10 13.333l4.167-4.166M10 3.333v10"></path></svg>
                    </button>
                </div>

                <div
                    className="h-[40px] w-[40px] flex items-center pl-2 text-[var(--accents-7)] cursor-pointer bg-[var(--accents-1)] border border-[var(--accents-2)] fixed top-[50%] rounded-full translateY(-100%) transition-all"
                    style={{
                        clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                        left: closed ? "-20px" : `${width - 20}px`,
                        transform: closed ? "rotateY(180deg)" : ""
                    }}
                    onClick={() => setClosed(!closed)}
                >
                    {"<"}
                </div>
            </aside >
        </>
    )
}