import { useAtom } from "jotai"
import { AppState, AppDrawings, SelectionAtom } from "../jotai"
import { getSelectedItem, moveItemPosition, updateSingleItem } from "../lib/utils"
import type { LayerMoves, Stroke, StrokeWidth } from "../types"

export function FillToolsOptions() {
    return (
        <>
            <StrokeWidth />
            <StrokeStyle />
        </>
    )
}


export function TextOptions() {
    return (
        <>
            <FontSize />
            <FontFamily />
            <TextAlign />
        </>
    )
}

export function ImageOptions() {
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    function flip(ax: string) {
        if (!selectedItem) return
        const item = getSelectedItem(selectedItem.id, items)
        if (item && item.type === "image") {
            if (ax === "x") {
                item.x += item.width
                item.width *= - 1
            }
            if (ax === "y") {
                item.y += item.height
                item.height *= -1
            }
            setItems(updateSingleItem(selectedItem.id, item, items))
        }
    }

    return (
        <>
            <div className="flex items-center gap-2" onClick={() => flip("x")}>
                <OptionContainer selected={""} value="18" onClick={() => { }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.97 15.25h-2.72c-5.3 0-9.5-2.15-9.5-4.5s4.2-4.5 9.5-4.5c3.03 0 5.82.7 7.62 1.86a.75.75 0 1 0 .81-1.26c-2.06-1.33-5.13-2.1-8.43-2.1-6.02 0-11 2.55-11 6s4.98 6 11 6h2.8l-2.3 2.3a.75.75 0 1 0 1.07 1.05l2.83-2.82c.68-.69.68-1.8 0-2.48l-2.83-2.83a.75.75 0 0 0-1.06 1.06l2.21 2.22z"></path></svg>
                </OptionContainer>
                <span className="text-neutral-500">Flip Horizontally</span>
            </div>

            <div className="flex items-center gap-2" onClick={() => flip("y")}>
                <OptionContainer selected={""} value="25" onClick={() => { }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.25 8.35v2.4c0 5.3-2.15 9.5-4.5 9.5s-4.5-4.2-4.5-9.5c0-3.03.7-5.82 1.86-7.62a.75.75 0 1 0-1.26-.81c-1.33 2.06-2.1 5.13-2.1 8.43 0 6.02 2.55 11 6 11s6-4.98 6-11V8.27l2.3 2.3A.75.75 0 1 0 20.1 9.5l-2.82-2.83a1.75 1.75 0 0 0-2.48 0L11.97 9.5a.75.75 0 1 0 1.06 1.06l2.22-2.22z"></path></svg>
                </OptionContainer>
                <span className="text-neutral-500">Flip Vertically</span>
            </div>

        </>
    )
}

function FontSize() {
    const [mainState, setMainState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    const changeFontSize = (val: string) => {
        let v = Number(val)
        if (selectedItem) {
            const item = getSelectedItem(selectedItem.id, items)
            if (item && item.type === "text") {
                let c = document.getElementById("canvas") as HTMLCanvasElement
                let ctx = c.getContext('2d')!;
                ctx.font = `bold ${v}px ${item.fontFamily}`
                item.fontSize = v
                item.width = ctx.measureText(item.text).width
                item.height = item.text.split("\n").length * v
                setItems(updateSingleItem(selectedItem.id, item, items))
            }
        }
        setMainState({ ...mainState, fontSize: v })
    }

    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Font size</legend>
            <div className="flex gap-3">
                <OptionContainer selected={String(mainState.fontSize)} value="18" onClick={changeFontSize}>
                    <span>S</span>
                </OptionContainer>
                <OptionContainer selected={String(mainState.fontSize)} value="25" onClick={changeFontSize}>
                    <span>M</span>
                </OptionContainer>
                <OptionContainer selected={String(mainState.fontSize)} value="30" onClick={changeFontSize}>
                    <span>L</span>
                </OptionContainer>
                <OptionContainer selected={String(mainState.fontSize)} value="48" onClick={changeFontSize}>
                    <span>XL</span>
                </OptionContainer>

            </div>
        </fieldset>
    )
}

function FontFamily() {
    const [mainState, setMainState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    const changeFontFamily = (val: string) => {
        if (selectedItem) {
            const item = getSelectedItem(selectedItem.id, items)
            if (item && item.type === "text") {
                let c = document.getElementById("canvas") as HTMLCanvasElement
                let ctx = c.getContext('2d')!;
                ctx.font = `bold ${item.fontSize}px ${val}`
                item.width = ctx.measureText(item.text).width
                item.fontFamily = val
                setItems(updateSingleItem(selectedItem.id, item, items))
            }
        }
        setMainState({ ...mainState, fontFamily: val })
    }

    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Font family</legend>
            <div className="flex gap-3">
                <OptionContainer selected={mainState.fontFamily} value="Kalam" onClick={changeFontFamily}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g strokeWidth="1.25">
                            <path clipRule="evenodd" d="m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z">
                            </path>
                            <path d="m11.25 5.417 3.333 3.333"></path>
                        </g>
                    </svg>
                </OptionContainer>
                <OptionContainer selected={mainState.fontFamily} value="Arial" onClick={changeFontFamily}>
                    <span>A</span>
                </OptionContainer>

                <OptionContainer selected={mainState.fontFamily} value="Sans Serif" onClick={changeFontFamily}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g clipPath="url(#a)" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"></path>
                        </g>
                        <defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
                </OptionContainer>
            </div>
        </fieldset >
    )
}

function TextAlign() {
    const [mainState, setMainState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    function changeAlignment(v: string) {
        if (v !== "left" && v !== "center" && v !== "right") return
        if (selectedItem) {
            const item = getSelectedItem(selectedItem.id, items)
            if (item && item.type === "text") {
                item.alignment = v
                setItems(updateSingleItem(selectedItem.id, item, items))
            }
        }
        setMainState({ ...mainState, textAlign: v })
    }

    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Text align</legend>
            <div className="flex gap-3">
                <OptionContainer selected={mainState.textAlign} value="left" onClick={changeAlignment}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="12" x2="12" y2="12"></line><line x1="4" y1="16" x2="16" y2="16"></line></g>
                    </svg>
                </OptionContainer>
                <OptionContainer selected={mainState.textAlign} value="center" onClick={changeAlignment}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <line x1="4" y1="8" x2="20" y2="8"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                            <line x1="6" y1="16" x2="18" y2="16"></line>
                        </g>
                    </svg>
                </OptionContainer>

                <OptionContainer selected={mainState.textAlign} value="right" onClick={changeAlignment}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <line x1="4" y1="8" x2="20" y2="8"></line><line x1="10" y1="12" x2="20" y2="12">
                            </line><line x1="8" y1="16" x2="20" y2="16"></line>
                        </g>
                    </svg>
                </OptionContainer>
            </div>
        </fieldset>
    )
}

export function Opacity() {
    const [appState, setAppState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    const opacity = (val: number) => {
        if (selectedItem) {
            const item = getSelectedItem(selectedItem.id, items)
            if (item) {
                item.opacity = val
                setItems(updateSingleItem(selectedItem.id, item, items))
            }
        }
        setAppState({ ...appState, opacity: val })
    }

    return (
        <div className="w-full">
            <h6 className="text-sm text-[var(--accents-5)] mb-1">Opacity</h6>
            <input type="range" className="accent-[darkorange] cursor-resize w-full"
                onChange={(e) => opacity(e.target.valueAsNumber)}
                value={appState.opacity} min={0.1} max={1} step={0.1} />
        </div>
    )
}

function OptionContainer({ selected, value, onClick, children }: { selected: string, value: string, onClick: (val: string) => void, children: React.ReactNode }) {
    return (
        <button className="w-fit p-2 rounded hover:bg-[#faecd2]"
            onClick={() => onClick(value)}
            style={{
                backgroundColor: selected === value ? "#faecd2" : "",
                border: `1px solid ${selected === value ? "#faecd2" : "var(--accents-2)"}`,
                fill: selected === value ? "darkorange" : "none",
                color: selected === value ? "darkorange" : ""
            }}
        >
            <div className="h-[22px] w-[22px]">
                {children}
            </div>
        </button>
    )
}

export function Layers() {
    const selected = ""
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    function handleSelect(val: string) {
        if (selectedItem) {
            const updatedItemLayer = moveItemPosition(val as LayerMoves, selectedItem, items)
            setItems(updatedItemLayer)
        }
    }

    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Layers</legend>
            <div className="flex gap-3">
                <OptionContainer selected={selected} value="to-back" onClick={handleSelect}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m19.48 10.82 1.7.83a1 1 0 0 1 0 1.8L15 16.49V14.8l4.6-2.26-1.82-.9 1.7-.83zm-14.96 0-1.7.83a1 1 0 0 0 0 1.8L9 16.49V14.8l-4.6-2.26 1.82-.9-1.7-.83zm8.23 9.5L15 18.07a.75.75 0 0 1 1.06 1.06l-2.83 2.83c-.68.68-1.79.68-2.47 0l-2.83-2.83a.75.75 0 0 1 1.06-1.06l2.26 2.26V6.9a.75.75 0 1 1 1.5 0v13.43zM15 11.35V9.68l4.6-2.27L12.66 4c-.42-.2-.9-.2-1.32 0L4.4 7.4 9 9.68v1.67L2.82 8.3a1 1 0 0 1 0-1.8l7.86-3.86a3 3 0 0 1 2.64 0l7.86 3.87a1 1 0 0 1 0 1.79L15 11.35z"></path></svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="step-backward" onClick={handleSelect}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.75 18.12V9.75a.75.75 0 1 0-1.5 0v8.37l-2.26-2.25a.75.75 0 0 0-1.06 1.06l2.83 2.82c.68.69 1.79.69 2.47 0l2.83-2.82A.75.75 0 0 0 15 15.87l-2.25 2.25zM15 11.85v1.67l6.18-3.04a1 1 0 0 0 0-1.79l-7.86-3.86a3 3 0 0 0-2.64 0L2.82 8.69a1 1 0 0 0 0 1.8L9 13.51v-1.67L4.4 9.6l6.94-3.42c.42-.2.9-.2 1.32 0L19.6 9.6 15 11.85z"></path></svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="to-front" onClick={handleSelect}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.75 3.82v9.43a.75.75 0 1 1-1.5 0V3.81L8.99 6.07A.75.75 0 1 1 7.93 5l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 5A.75.75 0 0 1 15 6.07l-2.25-2.25zM15 8.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8L9 8.49v1.67L4.4 12.4l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26V8.48zm4.48 7.34 1.7.83a1 1 0 0 1 0 1.8l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8l1.7-.83 1.7.83-1.82.9 6.94 3.41c.42.2.9.2 1.32 0l6.94-3.41-1.82-.9 1.7-.83z"></path></svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="step-forward" onClick={handleSelect}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25zM15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8L9 10.49v1.67L4.4 14.4l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z">
                        </path>
                    </svg>
                </OptionContainer>
            </div>
        </fieldset>
    )
}


function StrokeWidth() {
    const [mainState, setMainState] = useAtom(AppState)
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    const width = (val: StrokeWidth) => {
        if (selectedItem) {
            const item = getSelectedItem(selectedItem.id, items)
            if (item && (item.type === "arrow" || item.type === "line" || item.type === "diamond" || item.type === "rectangle" || item.type === "ellipse" || item.type === "pencil")) {
                item.strokeWidth = val
                setItems(updateSingleItem(selectedItem.id, item, items))
            }
        }
        setMainState({ ...mainState, strokeWidth: val })
    }
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Stroke width</legend>
            <div className="flex gap-3">
                <FillOption option={2} selectedOption={mainState.strokeWidth} onClick={width} />
                <FillOption option={3} selectedOption={mainState.strokeWidth} onClick={width} />
                <FillOption option={4} selectedOption={mainState.strokeWidth} onClick={width} />
            </div>
        </fieldset>

    )
}

function FillOption({ onClick, option, selectedOption }: { onClick: (val: StrokeWidth) => void, option: StrokeWidth, selectedOption: number }) {
    return (
        <button className="w-fit p-2 flex items-center justify-center rounded hover:bg-[#faecd2]"
            onClick={() => onClick(option)}
            style={{
                backgroundColor: selectedOption === option ? "#faecd2" : "",
                border: `1px solid ${selectedOption === option ? "#faecd2" : "var(--accents-2)"}`
            }}
        >
            <div className="flex items-center justify-center"
                style={{ width: "15px", height: "15px" }}
            >
                <span className="rounded"
                    style={{
                        height: `${option}px`,
                        width: "10px",
                        backgroundColor: selectedOption === option ? "darkorange" : "black"
                    }}
                >
                </span>
            </div>
        </button>
    )
}


function StrokeStyle() {
    const [mainState, setSelected] = useAtom(AppState)
    const { stroke: selected } = mainState
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    const strokeStyleChange = (val: Stroke) => {
        if (selectedItem) {
            const item = getSelectedItem(selectedItem.id, items)
            if (item && (item.type === "arrow" || item.type === "line" || item.type === "diamond" || item.type === "rectangle" || item.type === "ellipse")) {
                item.stroke = val
                setItems(updateSingleItem(selectedItem.id, item, items))
            }
        }
        setSelected({ ...mainState, stroke: val })
    }

    return (

        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Stroke style</legend>
            <div className="flex gap-3">
                <StrokeStyleOption option={"solid"} selectedOption={selected} onClick={strokeStyleChange} />
                <StrokeStyleOption option={"dotted"} selectedOption={selected} onClick={strokeStyleChange} />
                <StrokeStyleOption option={"dashed"} selectedOption={selected} onClick={strokeStyleChange} />

            </div>
        </fieldset>
    )
}


function StrokeStyleOption({ onClick, option, selectedOption }: { onClick: (val: Stroke) => void, option: Stroke, selectedOption: Stroke }) {
    return (
        <button className="w-fit p-2 flex items-center justify-center rounded hover:bg-[#faecd2]"
            onClick={() => onClick(option)}
            style={{
                backgroundColor: selectedOption === option ? "#faecd2" : "",
                border: `1px solid ${selectedOption === option ? "#faecd2" : "var(--accents-2)"}`
            }}
        >
            <div className="flex items-center justify-center"
                style={{ width: "15px", height: "15px" }}
            >
                <div className="rounded"
                    style={{
                        height: "1px",
                        width: "15px",
                        borderStyle: option,
                        borderTopWidth: "2px",
                        borderColor: selectedOption === option ? "darkorange" : "black"
                    }}
                >
                </div>
            </div>
        </button>
    )
}