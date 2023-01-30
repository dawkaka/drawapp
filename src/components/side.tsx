import { useAtom } from "jotai"
import { useState } from "react"
import { AppDrawings, AppState, SelectionAtom } from "../jotai"
import ColorPanel from "./colorpick"
import Modal from "./modal"
import { FillToolsOptions, Layers, Opacity, TextOptions } from "./toolOptions"
import Tools from "./tools"

export default function Side() {
    const [closed, setClosed] = useState(false)
    const [{ tool }] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [modal, setModal] = useState(false)

    function deleteAllItems() {
        setItems([])
        localStorage.setItem("canvasItems", "[]")
        setModal(false)
    }

    return (
        <>
            <aside
                className="bg-neutral-50 fixed  flex flex-col items-center top-0 left-0 bottom-0 border-r border-neutral-200  transition-all z-10 overflow-hidden"
                style={{
                    width: closed ? 0 : "300px"
                }}
            >
                {
                    modal && <Modal close={() => setModal(false)} clearFunc={deleteAllItems} />
                }

                <div className="relative w-full h-full overflow-y-auto pb-10">
                    <ColorPanel />
                    <Tools />
                    <div className="flex flex-col gap-5 p-2 shadow bg-white mx-3 my-5 rounded p-5">
                        {
                            (tool === "ellipse" || tool === "rectangle" || tool === "diamond" || tool === "arrow" || tool === "line" || tool === "pencil") && <FillToolsOptions />
                        }
                        {
                            tool === "text" && <TextOptions />
                        }
                        <Opacity />
                        <Layers />
                    </div>
                </div>

                <div className="flex shadow absolute bottom-5 px-5 py-2 gap-5 z-11">
                    <button className="w-fit p-1 rounded hover:bg-[#faecd2] border" onClick={() => setModal(true)}>
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="red" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 4.656a.5.5 0 01.5-.5h9.7a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5z"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.272 3a.578.578 0 00-.578.578v.578h3.311v-.578A.578.578 0 008.428 3H6.272zm3.733 1.156v-.578A1.578 1.578 0 008.428 2H6.272a1.578 1.578 0 00-1.578 1.578v.578H3.578a.5.5 0 00-.5.5V12.2a1.578 1.578 0 001.577 1.578h5.39a1.578 1.578 0 001.577-1.578V4.656a.5.5 0 00-.5-.5h-1.117zm-5.927 1V12.2a.578.578 0 00.577.578h5.39a.578.578 0 00.577-.578V5.156H4.078z">
                            </path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.272 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5zM8.428 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5z">
                            </path></svg>
                    </button>

                    <button className="w-fit p-1 rounded hover:bg-[#faecd2] border">
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scale(1, 1)" }}>
                            <path d="M10.6707 8.5081C10.6707 10.1923 9.3004 11.5625 7.61631 11.5625H6.5351C6.35593 11.5625 6.21074 11.4173 6.21074 11.2382V11.13C6.21074 10.9508 6.35591 10.8057 6.5351 10.8057H7.61631C8.88313 10.8057 9.91387 9.77492 9.91387 8.5081C9.91387 7.24128 8.88313 6.21054 7.61631 6.21054H5.62155L6.99534 7.58433C7.14289 7.73183 7.14289 7.97195 6.99534 8.11944C6.85216 8.26251 6.60298 8.2623 6.46013 8.11944L4.44045 6.09971C4.36898 6.02824 4.32959 5.93321 4.32959 5.8321C4.32959 5.73106 4.36898 5.63598 4.44045 5.56454L6.46024 3.54472C6.60309 3.40176 6.85248 3.40176 6.99535 3.54472C7.14291 3.69218 7.14291 3.93234 6.99535 4.07979L5.62156 5.45368H7.61631C9.3004 5.45368 10.6707 6.82393 10.6707 8.5081Z">
                            </path></svg>
                    </button>

                    <button className="w-fit p-1 rounded hover:bg-[#faecd2] border">
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scale(-1, 1)" }}>
                            <path d="M10.6707 8.5081C10.6707 10.1923 9.3004 11.5625 7.61631 11.5625H6.5351C6.35593 11.5625 6.21074 11.4173 6.21074 11.2382V11.13C6.21074 10.9508 6.35591 10.8057 6.5351 10.8057H7.61631C8.88313 10.8057 9.91387 9.77492 9.91387 8.5081C9.91387 7.24128 8.88313 6.21054 7.61631 6.21054H5.62155L6.99534 7.58433C7.14289 7.73183 7.14289 7.97195 6.99534 8.11944C6.85216 8.26251 6.60298 8.2623 6.46013 8.11944L4.44045 6.09971C4.36898 6.02824 4.32959 5.93321 4.32959 5.8321C4.32959 5.73106 4.36898 5.63598 4.44045 5.56454L6.46024 3.54472C6.60309 3.40176 6.85248 3.40176 6.99535 3.54472C7.14291 3.69218 7.14291 3.93234 6.99535 4.07979L5.62156 5.45368H7.61631C9.3004 5.45368 10.6707 6.82393 10.6707 8.5081Z">
                            </path></svg>
                    </button>
                    <button className="w-fit p-1 rounded hover:bg-[#faecd2] border">
                        <svg aria-hidden="true" width="22" height="22" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.25" d="M3.333 14.167v1.666c0 .92.747 1.667 1.667 1.667h10c.92 0 1.667-.746 1.667-1.667v-1.666M5.833 9.167 10 13.333l4.167-4.166M10 3.333v10"></path></svg>
                    </button>
                </div>
                <div
                    className="h-[40px] w-[40px] flex items-center pl-2 cursor-pointer bg-[white] border border-neutral-200 fixed top-[50%] rounded-full translateY(-100%) transition-all"
                    style={{
                        clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                        left: closed ? "-20px" : "280px",
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