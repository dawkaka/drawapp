import { useEffect, useState } from "react"
import { Color } from "../types"


export default function ColorPanel() {
    const [selectedColor, setSelectedColor] = useState("")
    const [selected, setSelected] = useState<"stroke" | "fill">("fill")
    const [fill, setFill] = useState("#9999")
    const [stroke, setStroke] = useState("#000")

    useEffect(() => {
        if (selectedColor) {
            if (selected === "stroke") {
                setStroke(selectedColor)
            } else {
                setFill(selectedColor)
            }
        }

    }, [selectedColor])
    return (
        <div className="flex py-5 px-3 justify-between">
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <h3 className="text-sm w-full">Stroke</h3>
                    <div className="flex items-center gap-1">
                        <div
                            className="rounded h-[30px] w-[30px]"
                            style={{
                                border: selected === "stroke" ? "2px solid rebeccapurple" : "",
                                backgroundColor: stroke
                            }}
                            onClick={() => setSelected("stroke")}
                        ></div>
                        <div className="text-neutral-500">{stroke}</div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-sm w-full">Fill</h3>
                    <div className="flex items-center gap-1">
                        <div
                            className="rounded h-[30px] w-[30px] bg-[yellow]"
                            style={{
                                border: selected === "fill" ? "2px solid rebeccapurple" : "",
                                backgroundColor: fill
                            }}
                            onClick={() => setSelected("fill")}
                        ></div>
                        <div className="text-neutral-500">{fill}</div>
                    </div>
                </div>
            </div>
            <ColoPicker onChange={(color: string) => setSelectedColor(color)} />
        </div>
    )
}

export function ColoPicker({ onChange }: { onChange: (color: string) => void }) {

    return (
        <div className="grid grid-cols-5 gap-1 place-start w-[fit-content]">
            {
                defaultColors.map((color) => (
                    <div
                        key={color}
                        className="w-[30px] h-[30px] shrink-0 rounded"
                        style={{ backgroundColor: color }}
                        onClick={() => onChange(color)}
                    >
                    </div>
                ))
            }
            <div className="h-[30px] w-[30px] relative bg-gradient-to-br rounded overflow-hidden">
                <input type="color" className="opacity-0" onChange={(e) => onChange(e.target.value)} />
            </div>
        </div>
    )
}


const defaultColors = [
    "#000000",
    "#808080",
    "#a9a9a9",
    "#FF0000",
    "#FF1493",
    "#8b0000",
    "#4B0082",
    "#663399",
    "#0000FF",
    "#1E90FF",
    "#00FF00",
    "#32CD32",
    "#ff8c00",
    "#FFA500",
]