import { useAtom } from "jotai"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { AppState } from "../jotai"
import ColorPanel from "./colorpick"
import { Actions, ArrowOnlyOptions, BorderRadius, FillToolsOptions, ImageOptions, Layers, Opacity, TextOptions } from "./toolOptions"
import Tools from "./tools"
import { closeMenus } from "../lib/utils"
import Menu from "./menu"

export default function Side() {
    const [closed, setClosed] = useState(true)
    const [main] = useAtom(AppState)
    const [width] = useState(200)
    const sideRef = useRef(null)
    const [, setTheme] = useState<"dark" | "light">("light")
    const tool = main.tool
    useLayoutEffect(() => {
        const t = localStorage.getItem("theme")
        if (t) {
            setTheme(t === "dark" ? "dark" : "light")
        }
    }, [])

    useEffect(() => {
        let w = window.innerWidth
        if (w < 768) {
            setClosed(true)
        } else {
            setClosed(false)
        }
    }, [])


    return (
        <>
            <aside
                className="bg-[var(--accents-1)] fixed flex flex-col items-center top-0 left-0 bottom-0 border-r border-[var(--accents-2)]  transition-all z-10 overflow-hidden"
                ref={sideRef}
                style={{
                    width: closed ? 0 : width + 'px'
                }}
                onClick={() => {
                    closeMenus()
                }}
            >
                <div className="relative bg-[var(--accents-1)] relative w-full h-full overflow-y-auto pb-10"
                    style={{
                        overflowX: "hidden"
                    }}
                >
                    <ColorPanel />
                    <Tools />
                    <div className="flex flex-col gap-3 p-2 shadow bg-[var(--background)] mx-3 my-5 rounded p-5">
                        {
                            (tool === "ellipse" || tool === "rectangle" || tool === "diamond" || tool === "arrow" || tool === "line" || tool === "pencil") && <FillToolsOptions />
                        }
                        {
                            (tool === "diamond" || tool === "rectangle") && <BorderRadius />

                        }
                        {
                            tool === "arrow" && <ArrowOnlyOptions />
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

                <Menu />

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