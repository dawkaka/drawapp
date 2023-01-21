import { useAtom } from "jotai"
import { useState } from "react"
import { appState } from "../jotai"
import type { StrokeWidth } from "../types"
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


function FontSize() {
    const [selected, setSelected] = useState("medium")
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Font size</legend>
            <div className="flex gap-3">
                <OptionContainer selected={selected} value="small" onClick={setSelected}>
                    <span>S</span>
                </OptionContainer>
                <OptionContainer selected={selected} value="medium" onClick={setSelected}>
                    <span>M</span>
                </OptionContainer>
                <OptionContainer selected={selected} value="large" onClick={setSelected}>
                    <span>L</span>
                </OptionContainer>
                <OptionContainer selected={selected} value="xlarge" onClick={setSelected}>
                    <span>XL</span>
                </OptionContainer>

            </div>
        </fieldset>
    )
}

function FontFamily() {
    const [selected, setSelected] = useState("hand")
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Font family</legend>
            <div className="flex gap-3">
                <OptionContainer selected={selected} value="hand" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g strokeWidth="1.25">
                            <path clipRule="evenodd" d="m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z">
                            </path>
                            <path d="m11.25 5.417 3.333 3.333"></path>
                        </g>
                    </svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="normal" onClick={setSelected}>
                    <span>A</span>
                </OptionContainer>

                <OptionContainer selected={selected} value="code" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g clipPath="url(#a)" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"></path>
                        </g>
                        <defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
                </OptionContainer>
            </div>
        </fieldset>
    )
}

function TextAlign() {
    const [selected, setSelected] = useState("left")
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Text align</legend>
            <div className="flex gap-3">
                <OptionContainer selected={selected} value="left" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="12" x2="12" y2="12"></line><line x1="4" y1="16" x2="16" y2="16"></line></g>
                    </svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="center" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <line x1="4" y1="8" x2="20" y2="8"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                            <line x1="6" y1="16" x2="18" y2="16"></line>
                        </g>
                    </svg>
                </OptionContainer>

                <OptionContainer selected={selected} value="right" onClick={setSelected}>
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
    const [opacity, setOpacity] = useState(1)
    return (
        <div className="w-full">
            <h6 className="text-sm text-[var(--accents-5)] mb-1">Opacity</h6>
            <input type="range" className="accent-[darkorange] cursor-resize w-full" onChange={(e) => setOpacity(e.target.valueAsNumber)} value={opacity} min={0} max={1} step={0.1} />
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
    const [selected, setSelected] = useState("")
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Layers</legend>
            <div className="flex gap-3">
                <OptionContainer selected={selected} value="to-back" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g clipPath="url(#a)">
                            <path d="M5.441 9.792h2.451a2.316 2.316 0 0 1 2.316 2.316v2.45a2.316 2.316 0 0 1-2.316 2.317h-2.45a2.316 2.316 0 0 1-2.317-2.316v-2.451a2.316 2.316 0 0 1 2.316-2.316Z" stroke="currentColor" strokeWidth="1.25">
                            </path>
                            <path d="M5.441 9.792h2.451a2.316 2.316 0 0 1 2.316 2.316v2.45a2.316 2.316 0 0 1-2.316 2.317h-2.45a2.316 2.316 0 0 1-2.317-2.316v-2.451a2.316 2.316 0 0 1 2.316-2.316Z" stroke="currentColor" strokeWidth="1.25"></path><mask id="SendToBackIcon" fill="#fff">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.167 5.833v2.06a2.941 2.941 0 0 0 2.94 2.94h2.06v.393a2.941 2.941 0 0 1-2.941 2.94h-.393v-2.058a2.941 2.941 0 0 0-2.94-2.941h-2.06v-.393a2.941 2.941 0 0 1 2.942-2.94h.392Z"></path></mask>
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.167 5.833v2.06a2.941 2.941 0 0 0 2.94 2.94h2.06v.393a2.941 2.941 0 0 1-2.941 2.94h-.393v-2.058a2.941 2.941 0 0 0-2.94-2.941h-2.06v-.393a2.941 2.941 0 0 1 2.942-2.94h.392Z" fill="currentColor"></path>
                            <path d="M9.167 5.833h1.25v-1.25h-1.25v1.25Zm5 5h1.25v-1.25h-1.25v1.25Zm-3.334 3.334h-1.25v1.25h1.25v-1.25Zm-5-5h-1.25v1.25h1.25v-1.25Zm2.084-3.334v2.06h2.5v-2.06h-2.5Zm0 2.06a4.191 4.191 0 0 0 4.19 4.19v-2.5a1.691 1.691 0 0 1-1.69-1.69h-2.5Zm4.19 4.19h2.06v-2.5h-2.06v2.5Zm.81-1.25v.393h2.5v-.393h-2.5Zm0 .393c0 .933-.758 1.69-1.691 1.69v2.5a4.191 4.191 0 0 0 4.19-4.19h-2.5Zm-1.691 1.69h-.393v2.5h.393v-2.5Zm.857 1.25v-2.058h-2.5v2.059h2.5Zm0-2.058a4.191 4.191 0 0 0-4.19-4.191v2.5c.933 0 1.69.757 1.69 1.69h2.5Zm-4.19-4.191h-2.06v2.5h2.06v-2.5Zm-.81 1.25v-.393h-2.5v.393h2.5Zm0-.393c0-.934.758-1.69 1.692-1.69v-2.5a4.191 4.191 0 0 0-4.192 4.19h2.5Zm1.692-1.69h.392v-2.5h-.392v2.5Z" fill="currentColor" mask="url(#SendToBackIcon)"></path>
                            <path d="M12.108 3.125h2.45a2.316 2.316 0 0 1 2.317 2.316v2.451a2.316 2.316 0 0 1-2.316 2.316h-2.451a2.316 2.316 0 0 1-2.316-2.316v-2.45a2.316 2.316 0 0 1 2.316-2.317Z" stroke="currentColor" strokeWidth="1.25"></path>
                        </g>
                        <defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs>
                    </svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="step-backward" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g clipPath="url(#a)" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.944 12.5H12.5v1.389a1.389 1.389 0 0 1-1.389 1.389H5.556a1.389 1.389 0 0 1-1.39-1.39V8.334a1.389 1.389 0 0 1 1.39-1.389h1.388" fill="currentColor"></path>
                            <path d="M13.889 4.167H8.333c-.767 0-1.389.621-1.389 1.389v5.555c0 .767.622 1.389 1.39 1.389h5.555c.767 0 1.389-.622 1.389-1.389V5.556c0-.768-.622-1.39-1.39-1.39Z"></path>
                        </g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs>
                    </svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="to-front" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <g clipPath="url(#a)" stroke="currentColor" strokeWidth="1.25"><path d="M8.775 6.458h2.45a2.316 2.316 0 0 1 2.317 2.316v2.452a2.316 2.316 0 0 1-2.316 2.316H8.774a2.316 2.316 0 0 1-2.317-2.316V8.774a2.316 2.316 0 0 1 2.317-2.316Z" fill="currentColor"></path>
                            <path d="M5.441 9.792h2.451a2.316 2.316 0 0 1 2.316 2.316v2.45a2.316 2.316 0 0 1-2.316 2.317h-2.45a2.316 2.316 0 0 1-2.317-2.316v-2.451a2.316 2.316 0 0 1 2.316-2.316ZM12.108 3.125h2.45a2.316 2.316 0 0 1 2.317 2.316v2.451a2.316 2.316 0 0 1-2.316 2.316h-2.451a2.316 2.316 0 0 1-2.316-2.316v-2.45a2.316 2.316 0 0 1 2.316-2.317Z">
                            </path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs>
                    </svg>
                </OptionContainer>
                <OptionContainer selected={selected} value="step-forward" onClick={setSelected}>
                    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g clipPath="url(#a)" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13.889 4.167H8.333c-.767 0-1.389.622-1.389 1.389v5.555c0 .767.622 1.389 1.39 1.389h5.555c.767 0 1.389-.622 1.389-1.389V5.556c0-.767-.622-1.39-1.39-1.39Z" fill="currentColor"></path>
                        <path d="M12.5 12.5v1.389a1.389 1.389 0 0 1-1.389 1.389H5.556a1.389 1.389 0 0 1-1.39-1.39V8.334a1.389 1.389 0 0 1 1.39-1.389h1.388">
                        </path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs>
                    </svg>
                </OptionContainer>
            </div>
        </fieldset>
    )
}


function StrokeWidth() {
    const [mainState, setMainState] = useAtom(appState)
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Stroke width</legend>
            <div className="flex gap-3">
                <FillOption option={2} selectedOption={mainState.strokeWidth} onClick={(val: StrokeWidth) => setMainState({ ...mainState, strokeWidth: val })} />
                <FillOption option={3} selectedOption={mainState.strokeWidth} onClick={(val: StrokeWidth) => setMainState({ ...mainState, strokeWidth: val })} />
                <FillOption option={4} selectedOption={mainState.strokeWidth} onClick={(val: StrokeWidth) => setMainState({ ...mainState, strokeWidth: val })} />
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

type StrokeStyle = "solid" | "dashed" | "dotted"

function StrokeStyle() {
    const [selected, setSelected] = useState<StrokeStyle>("solid")
    return (

        <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-[var(--accents-5)] mb-1">Stroke style</legend>
            <div className="flex gap-3">
                <StrokeStyleOption option={"solid"} selectedOption={selected} onClick={(val: StrokeStyle) => setSelected(val)} />
                <StrokeStyleOption option={"dotted"} selectedOption={selected} onClick={(val: StrokeStyle) => setSelected(val)} />
                <StrokeStyleOption option={"dashed"} selectedOption={selected} onClick={(val: StrokeStyle) => setSelected(val)} />

            </div>
        </fieldset>
    )
}


function StrokeStyleOption({ onClick, option, selectedOption }: { onClick: (val: StrokeStyle) => void, option: StrokeStyle, selectedOption: StrokeStyle }) {
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