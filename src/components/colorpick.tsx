import { useState } from "react"
import { Color } from "../types"


export default function ColorPanel() {
    const [selectedColor, setSelectedColor] = useState<Color>({ color: "black", hex: "#0000" })
    return (
        <div className="flex py-5 px-3 gap-5">
            <div className="flex flex-col">
                <div className="flex flex-col items-center">
                    <h3 className="text-sm">Stroke</h3>
                    <div className="flex items-center gap-1">
                        <div className="rounded-full h-[30px] w-[30px] bg-[yellow]"></div>
                        <div className="text-neutral-500">{selectedColor.hex}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="text-sm">Fill</h3>
                    <div className="flex items-center gap-1">
                        <div className="rounded-full h-[30px] w-[30px] bg-[yellow]"></div>
                        <div className="text-neutral-500">{selectedColor.hex}</div>
                    </div>
                </div>
            </div>
            <ColoPicker onChange={(color: Color) => setSelectedColor(color)} />
        </div>
    )
}

export function ColoPicker({ onChange }: { onChange: (color: Color) => void }) {

    return (
        <div className="grid grid-cols-5 gap-1 place-start w-[fit-content]">
            {
                defaultColors.map((color) => (
                    <div
                        className="w-[30px] h-[30px] shrink-0 rounded"
                        style={{ backgroundColor: color.color }}
                        onClick={() => onChange(color)}
                    >
                    </div>
                ))
            }
            <div className="h-[30px] w-[30px] relative bg-gradient-to-br rounded overflow-hidden">
                <input type="color" className="opacity-0" onChange={(e) => onChange({ color: e.target.value, hex: "#adfasd" })} />
            </div>
        </div>
    )
}


const defaultColors: Color[] = [
    {
        color: "black",
        hex: "#ff8040"
    },
    {
        color: "grey",
        hex: "#ff8040"
    },
    {
        color: "darkgray",
        hex: "#ff8040"
    },
    {
        color: "red",
        hex: "#ff8040"
    },
    {
        color: "deeppink",
        hex: "#ff8040"
    },
    {
        color: "darkred",
        hex: "#ff8040"
    },
    {
        color: "indigo",
        hex: "#ff8040"
    },
    {
        color: "rebeccapurple",
        hex: "#ff8040"
    },
    {
        color: "blue",
        hex: "#ff8040"
    },
    {
        color: "dodgerblue",
        hex: "#ff8040"
    },
    {
        color: "green",
        hex: "#ff8040"
    },
    {
        color: "lime",
        hex: "#ff8040"
    },

    {
        color: "darkorange",
        hex: "#ff8040"
    },
    {
        color: "orange",
        hex: "#ff8040"
    },
]