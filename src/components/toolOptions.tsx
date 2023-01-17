import { useState } from "react"

export function FillToolsOptions() {
    return (
        <div className="flex flex-col gap-5 p-2 shadow bg-white mx-3 my-5 rounded p-5">
            <StrokeWidth />
            <StrokeStyle />
        </div>
    )
}


function StrokeWidth() {
    const [selected, setSelected] = useState(1)
    return (
        <div className="flex flex-col gap-2">
            <h6 className="text-sm text-[var(--accents-5)]">Stroke width</h6>
            <div className="flex gap-3">
                <FillOption option={1} selectedOption={selected} onClick={(val: number) => setSelected(val)} />
                <FillOption option={2} selectedOption={selected} onClick={(val: number) => setSelected(val)} />
                <FillOption option={3} selectedOption={selected} onClick={(val: number) => setSelected(val)} />

            </div>
        </div>
    )
}

function FillOption({ onClick, option, selectedOption }: { onClick: (val: number) => void, option: number, selectedOption: number }) {
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
        <div className="flex flex-col gap-2">
            <h6 className="text-sm text-[var(--accents-5)]">Stroke width</h6>
            <div className="flex gap-3">
                <StrokeStyleOption option={"solid"} selectedOption={selected} onClick={(val: StrokeStyle) => setSelected(val)} />
                <StrokeStyleOption option={"dotted"} selectedOption={selected} onClick={(val: StrokeStyle) => setSelected(val)} />
                <StrokeStyleOption option={"dashed"} selectedOption={selected} onClick={(val: StrokeStyle) => setSelected(val)} />

            </div>
        </div>
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