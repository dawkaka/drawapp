import { useAtom } from "jotai"
import { useState } from "react"
import { AppDrawings, AppState } from "../jotai"
import { CanvasItem } from "../types"
import { getInverseColorForTheme, getMultipleSelectionBounds } from "../lib/utils"
import { renderElements } from "../lib/render"
import { defaultValues } from "../constants"
import history from "../lib/history"
import { ClearModal } from "./modal"

export default function Menu() {
    return (
        <div className="fixed left-2 bottom-2 z-22">
            <button data-collapse-toggle="navbar-hamburger" type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    const m = document.querySelector("#menu") as HTMLDivElement
                    if (m) {
                        if (m.style.display === "flex") {
                            m.style.display = "none"
                        } else {
                            m.style.display = "flex"
                        }
                    }
                }}
                className="inline-flex items-center p-2 ml-3 bg-[var(--accents-2)] text-sm text-[var(--accents-7)] hover:text-[var(--accents-2)] rounded-lg hover:bg-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-gray-200">
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd">
                    </path>
                </svg>
            </button>
            <Actions />
        </div>
    )
}


function Actions() {
    const [main, setAppState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [modal, setModal] = useState(false)
    const [theme, setTheme] = useState<"dark" | "light">("light")

    function deleteAllItems() {
        setItems([])
        localStorage.setItem("canvasItems", "[]")
        setModal(false)
    }

    function adjustItemsXY(items: CanvasItem[], x: number, y: number): CanvasItem[] {
        const mod = items.map(item => {
            return {
                ...item,
                x: item.x + x,
                y: item.y + y
            }

        })
        return mod
    }

    function downloadCanvas() {
        const link = document.createElement("a");
        let c = document.createElement('canvas') as HTMLCanvasElement;
        let ctx = c.getContext('2d')!;
        let bounds
        if (main.multipleSelections.length > 0) {
            bounds = getMultipleSelectionBounds(main.multipleSelections, items);
        } else {
            bounds = getMultipleSelectionBounds(items.map(i => i.id), items);
        }

        const padding = 10
        const padding2x = padding * 2
        const x = - 1 * bounds.x + padding
        const y = -1 * bounds.y + padding
        let modifiedItems
        if (main.multipleSelections.length > 0) {
            let v = items.filter(i => main.multipleSelections.includes(i.id))
            modifiedItems = adjustItemsXY(v, x, y)
        } else {
            modifiedItems = adjustItemsXY(items, x, y)
        }

        bounds = getMultipleSelectionBounds(main.multipleSelections.length > 0 ? main.multipleSelections : modifiedItems.map(i => i.id), modifiedItems);

        c.width = bounds.width + padding2x
        c.height = bounds.height + padding2x
        ctx.save()
        ctx.fillStyle = getInverseColorForTheme("#FFFFFF") === "#FFFFFF" ? "#000000" : "#FFFFFF"
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.restore()
        if (modifiedItems.length > 0) {
            renderElements(ctx, modifiedItems)
        }

        c.toBlob((blob) => {
            if (blob) {
                const link = document.createElement("a");
                link.download = `draaaw-${new Date().toISOString()}.png`
                link.href = URL.createObjectURL(blob);
                link.click();
            }

        }, "image/png");
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
            defaultValues.strokeColor = "#FFFFFF"
            if (main.strokeColor === "#000000") {
                setAppState({ ...main, strokeColor: "#FFFFFF" });
            }
            setItems([...items])
        } else {
            setTheme("light")
            localStorage.setItem("theme", "light")
            root.className = "light"
            document.documentElement.style.colorScheme = "light"
            defaultValues.strokeColor = "#000000"
            if (main.strokeColor === "#FFFFFF") {
                setAppState({ ...main, strokeColor: "#000000" });
            }
            setItems([...items])
        }
    }

    return (
        <div
            id="menu"
            onClick={(e) => e.stopPropagation()}
            className="hidden flex-col px-2 shadow bg-[var(--background)] text-[var(--accents-7)] rounded-lg md:rounded fixed right-2 md:right-auto md:flex-row md:absolute bottom-5 md:px-5 py-2 gap-5 md:z-11">
            {
                modal && <ClearModal close={() => setModal(false)} clearFunc={deleteAllItems} />
            }

            <button className="w-fit p-1 rounded hover:bg-[var(--p-light)] hover:text-[var(--p-dark)] border border-[var(--accents-2)]" onClick={() => setModal(true)}>
                <svg width="22" height="22" viewBox="0 0 15 15" fill="red" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2 4.656a.5.5 0 01.5-.5h9.7a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5z"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.272 3a.578.578 0 00-.578.578v.578h3.311v-.578A.578.578 0 008.428 3H6.272zm3.733 1.156v-.578A1.578 1.578 0 008.428 2H6.272a1.578 1.578 0 00-1.578 1.578v.578H3.578a.5.5 0 00-.5.5V12.2a1.578 1.578 0 001.577 1.578h5.39a1.578 1.578 0 001.577-1.578V4.656a.5.5 0 00-.5-.5h-1.117zm-5.927 1V12.2a.578.578 0 00.577.578h5.39a.578.578 0 00.577-.578V5.156H4.078z">
                    </path><path fillRule="evenodd" clipRule="evenodd" d="M6.272 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5zM8.428 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5z">
                    </path></svg>
            </button>

            <button className="w-fit p-1 rounded hover:bg-[var(--p-light)] hover:text-[var(--p-dark)] border border-[var(--accents-2)]" onClick={changeTheme}>
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
                className="w-fit p-1 rounded hover:bg-[var(--p-light)]  hover:text-[var(--p-dark)]  border border-[var(--accents-2)]"
                onClick={undo}
            >
                <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scale(1, 1)" }}>
                    <path d="M10.6707 8.5081C10.6707 10.1923 9.3004 11.5625 7.61631 11.5625H6.5351C6.35593 11.5625 6.21074 11.4173 6.21074 11.2382V11.13C6.21074 10.9508 6.35591 10.8057 6.5351 10.8057H7.61631C8.88313 10.8057 9.91387 9.77492 9.91387 8.5081C9.91387 7.24128 8.88313 6.21054 7.61631 6.21054H5.62155L6.99534 7.58433C7.14289 7.73183 7.14289 7.97195 6.99534 8.11944C6.85216 8.26251 6.60298 8.2623 6.46013 8.11944L4.44045 6.09971C4.36898 6.02824 4.32959 5.93321 4.32959 5.8321C4.32959 5.73106 4.36898 5.63598 4.44045 5.56454L6.46024 3.54472C6.60309 3.40176 6.85248 3.40176 6.99535 3.54472C7.14291 3.69218 7.14291 3.93234 6.99535 4.07979L5.62156 5.45368H7.61631C9.3004 5.45368 10.6707 6.82393 10.6707 8.5081Z">
                    </path></svg>
            </button>

            <button
                className="w-fit p-1 rounded hover:bg-[var(--p-light)]  hover:text-[var(--p-dark)]  border border-[var(--accents-2)]"
                onClick={redo}
            >
                <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scale(-1, 1)" }}>
                    <path d="M10.6707 8.5081C10.6707 10.1923 9.3004 11.5625 7.61631 11.5625H6.5351C6.35593 11.5625 6.21074 11.4173 6.21074 11.2382V11.13C6.21074 10.9508 6.35591 10.8057 6.5351 10.8057H7.61631C8.88313 10.8057 9.91387 9.77492 9.91387 8.5081C9.91387 7.24128 8.88313 6.21054 7.61631 6.21054H5.62155L6.99534 7.58433C7.14289 7.73183 7.14289 7.97195 6.99534 8.11944C6.85216 8.26251 6.60298 8.2623 6.46013 8.11944L4.44045 6.09971C4.36898 6.02824 4.32959 5.93321 4.32959 5.8321C4.32959 5.73106 4.36898 5.63598 4.44045 5.56454L6.46024 3.54472C6.60309 3.40176 6.85248 3.40176 6.99535 3.54472C7.14291 3.69218 7.14291 3.93234 6.99535 4.07979L5.62156 5.45368H7.61631C9.3004 5.45368 10.6707 6.82393 10.6707 8.5081Z">
                    </path></svg>
            </button>
            <button className="w-fit p-1 rounded hover:bg-[var(--p-light)] hover:text-[var(--p-dark)] border border-[var(--accents-2)]"
                onClick={downloadCanvas}
            >
                <svg aria-hidden="true" width="22" height="22" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path strokeWidth="1.25" d="M3.333 14.167v1.666c0 .92.747 1.667 1.667 1.667h10c.92 0 1.667-.746 1.667-1.667v-1.666M5.833 9.167 10 13.333l4.167-4.166M10 3.333v10"></path></svg>
            </button>
        </div>


    )
}