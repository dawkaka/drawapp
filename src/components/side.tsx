import { useState } from "react"
import { Color } from "../types"
import ColorPanel from "./colorpick"
import Tools from "./tools"

export default function Side() {
    const [closed, setClosed] = useState(false)
    return (
        <aside
            className="bg-neutral-50 fixed top-0 left-0 bottom-0 border-r border-neutral-200 overflow-y-auto transition-all"
            style={{
                width: closed ? 0 : "300px"
            }}
        >
            <div className="relative  w-full h-full">
                <ColorPanel />
                <Tools />
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