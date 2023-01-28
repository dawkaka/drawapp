import { useAtom } from "jotai"
import { useState } from "react"
import { AppState } from "../jotai"
import ColorPanel from "./colorpick"
import { FillToolsOptions, Layers, Opacity, TextOptions } from "./toolOptions"
import Tools from "./tools"

export default function Side() {
    const [closed, setClosed] = useState(false)
    const [{ tool }] = useAtom(AppState)
    return (
        <aside
            className="bg-neutral-50 fixed top-0 left-0 bottom-0 border-r border-neutral-200 overflow-y-auto transition-all z-10"
            style={{
                width: closed ? 0 : "300px"
            }}
        >
            <div className="relative  w-full h-full">
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

        </aside>
    )
}