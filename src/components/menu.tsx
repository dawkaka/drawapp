import { useAtom } from "jotai"
import { useState } from "react"
import { AppDrawings, AppState } from "../jotai"
import { CanvasItem } from "../types"
import { getInverseColorForTheme, getMultipleSelectionBounds } from "../lib/utils"
import { renderElements } from "../lib/render"
import { defaultValues } from "../constants"
import history from "../lib/history"
import { ClearModal, Links, Save } from "./modal"

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
    const [linksModal, setLinksModal] = useState(false)
    const [saveModal, setSaveModal] = useState(false)

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
            className="hidden flex-col border bg-[var(--background)] text-[var(--accents-7)] py-2 right-auto w-max absolute bottom-5  z-11">
            {
                modal && <ClearModal close={() => setModal(false)} clearFunc={deleteAllItems} />
            }
            {
                linksModal && <Links close={() => setLinksModal(false)} />
            }
            {
                saveModal && <Save close={() => setSaveModal(false)} />
            }
            <button className="flex gap-2 py-2 px-4 items-center hover:bg-[var(--p-light)] hover:text-[var(--p-dark)]"
                onClick={downloadCanvas}
            >
                <svg aria-hidden="true" width="22" height="22" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path strokeWidth="1.25" d="M3.333 14.167v1.666c0 .92.747 1.667 1.667 1.667h10c.92 0 1.667-.746 1.667-1.667v-1.666M5.833 9.167 10 13.333l4.167-4.166M10 3.333v10">
                    </path>
                </svg>
                <span>Dowload image</span>
            </button>

            <button className="flex gap-2 py-2 px-4 items-center hover:bg-[var(--p-light)] hover:text-[var(--p-dark)]"
                onClick={() => setSaveModal(true)}
            >
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M18.22 20.75H5.78C5.43322 20.7359 5.09262 20.6535 4.77771 20.5075C4.4628 20.3616 4.17975 20.155 3.94476 19.8996C3.70977 19.6442 3.52745 19.3449 3.40824 19.019C3.28903 18.693 3.23525 18.3468 3.25 18V15C3.25 14.8011 3.32902 14.6103 3.46967 14.4697C3.61033 14.329 3.80109 14.25 4 14.25C4.19892 14.25 4.38968 14.329 4.53033 14.4697C4.67099 14.6103 4.75 14.8011 4.75 15V18C4.72419 18.2969 4.81365 18.5924 4.99984 18.8251C5.18602 19.0579 5.45465 19.21 5.75 19.25H18.22C18.5154 19.21 18.784 19.0579 18.9702 18.8251C19.1564 18.5924 19.2458 18.2969 19.22 18V15C19.22 14.8011 19.299 14.6103 19.4397 14.4697C19.5803 14.329 19.7711 14.25 19.97 14.25C20.1689 14.25 20.3597 14.329 20.5003 14.4697C20.641 14.6103 20.72 14.8011 20.72 15V18C20.75 18.6954 20.5041 19.3744 20.0359 19.8894C19.5677 20.4045 18.9151 20.7137 18.22 20.75Z" fill="currentColor">
                        </path>
                        <path d="M16 8.74995C15.9015 8.75042 15.8038 8.7312 15.7128 8.69342C15.6218 8.65564 15.5392 8.60006 15.47 8.52995L12 5.05995L8.53 8.52995C8.38782 8.66243 8.19978 8.73455 8.00548 8.73113C7.81118 8.7277 7.62579 8.64898 7.48838 8.51157C7.35096 8.37416 7.27225 8.18877 7.26882 7.99447C7.2654 7.80017 7.33752 7.61213 7.47 7.46995L11.47 3.46995C11.6106 3.3295 11.8012 3.25061 12 3.25061C12.1987 3.25061 12.3894 3.3295 12.53 3.46995L16.53 7.46995C16.6705 7.61058 16.7493 7.8012 16.7493 7.99995C16.7493 8.1987 16.6705 8.38932 16.53 8.52995C16.4608 8.60006 16.3782 8.65564 16.2872 8.69342C16.1962 8.7312 16.0985 8.75042 16 8.74995Z" fill="currentColor"></path>
                        <path d="M12 15.75C11.8019 15.7474 11.6126 15.6676 11.4725 15.5275C11.3324 15.3874 11.2526 15.1981 11.25 15V4C11.25 3.80109 11.329 3.61032 11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4V15C12.7474 15.1981 12.6676 15.3874 12.5275 15.5275C12.3874 15.6676 12.1981 15.7474 12 15.75Z" fill="currentColor">
                        </path>
                    </g>
                </svg>
                <span>Save work</span>
            </button>
            <button className="flex gap-2 py-2 px-4 items-center hover:bg-[var(--p-light)] hover:text-[var(--p-dark)]"
                onClick={() => setLinksModal(true)}
            >
                <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0">
                </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M13.06 8.11l1.415 1.415a7 7 0 0 1 0 9.9l-.354.353a7 7 0 0 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415 1.415-1.414zm6.718 6.011l-1.414-1.414a5 5 0 1 0-7.071-7.071l-.354.354a5 5 0 0 0 0 7.07l1.415 1.415-1.415 1.414-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 0 1 9.9 9.9z">
                        </path> </g> </g>
                </svg>
                <span>Saved links</span>
            </button>

            <button className="flex gap-2 py-2 px-4  items-center hover:bg-[var(--p-light)] hover:text-[var(--p-dark)]" onClick={changeTheme}>
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
                <span>Toggle theme</span>
            </button>

            <button className="flex  gap-2 py-2 px-4 items-center hover:bg-[var(--p-light)] hover:text-[var(--p-dark)]" onClick={() => setModal(true)}>
                <svg width="22" height="22" viewBox="0 0 15 15" fill="red" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2 4.656a.5.5 0 01.5-.5h9.7a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5z"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.272 3a.578.578 0 00-.578.578v.578h3.311v-.578A.578.578 0 008.428 3H6.272zm3.733 1.156v-.578A1.578 1.578 0 008.428 2H6.272a1.578 1.578 0 00-1.578 1.578v.578H3.578a.5.5 0 00-.5.5V12.2a1.578 1.578 0 001.577 1.578h5.39a1.578 1.578 0 001.577-1.578V4.656a.5.5 0 00-.5-.5h-1.117zm-5.927 1V12.2a.578.578 0 00.577.578h5.39a.578.578 0 00.577-.578V5.156H4.078z">
                    </path><path fillRule="evenodd" clipRule="evenodd" d="M6.272 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5zM8.428 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5z">
                    </path>
                </svg>
                <span>Clear canvas</span>
            </button>
        </div>


    )
}
