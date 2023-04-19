import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { AppDrawings, AppState, SelectionAtom } from "../jotai"
import { getSelectedItem, updateSingleItem } from "../lib/utils"
import { defaultValues } from "../constants"


export default function ColorPanel() {
    const [selectedColor, setSelectedColor] = useState("")
    const [selected, setSelected] = useState<"stroke" | "fill">("fill")
    const [main, setAppState] = useAtom(AppState)
    const { fillColor, strokeColor } = main
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    useEffect(() => {
        if (selectedColor) {
            if (selected === "stroke") {
                if (selectedItem) {
                    const item = getSelectedItem(selectedItem.id, items)
                    if (item && (item.type === "text" || item.type === "arrow" ||
                        item.type === "line" || item.type === "diamond" ||
                        item.type === "rectangle" || item.type === "ellipse" || item.type === "pencil")) {
                        item.strokeStyle = selectedColor
                        setItems(updateSingleItem(selectedItem.id, item, items))
                    }
                }
                setAppState({ ...main, strokeColor: selectedColor })
            } else {
                if (selectedItem) {
                    const item = getSelectedItem(selectedItem.id, items)
                    if (item && (item.type === "diamond" || item.type === "rectangle" || item.type === "ellipse")) {
                        item.fillStyle = selectedColor
                        setItems(updateSingleItem(selectedItem.id, item, items))
                    }
                }
                setAppState({ ...main, fillColor: selectedColor })
            }
        }
    }, [selectedColor])

    useEffect(() => {
        const t = localStorage.getItem("theme");
        if (t) {
            if (t === "dark") {
                defaultValues.strokeColor = "#FFFFFF"
                setAppState({ ...main, strokeColor: "#FFFFFF" });
            } else {
                defaultValues.strokeColor = "#000000"
                setAppState({ ...main, strokeColor: "#000000" });
            }
        }
    }, []);

    return (
        <div className="flex flex-col gap-4 md:gap-0 py-5 px-3 justify-between md:flex-row">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <h3 className="text-sm w-full text-[var(--foreground)]">Stroke</h3>
                    <div className="flex items-center gap-1">
                        <div
                            className="rounded h-[25px] w-[25px]"
                            style={{
                                border: selected === "stroke" ? "2px solid var(--p-dark)" : "",
                                backgroundColor: strokeColor
                            }}
                            onClick={() => setSelected("stroke")}
                        ></div>
                        <div className="text-neutral-500 text-sm">{strokeColor}</div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-sm w-full text-[var(--foreground)]">Fill</h3>
                    <div className="flex items-center gap-1">
                        <div
                            className="rounded h-[25px] w-[25px]"
                            style={{
                                border: selected === "fill" ? "2px solid var(--p-dark)" : "",
                                backgroundColor: fillColor
                            }}
                            onClick={() => setSelected("fill")}
                        ></div>
                        <div className="text-neutral-500 text-sm">{fillColor}</div>
                    </div>
                </div>
            </div>
            <ColoPicker onChange={(color: string) => setSelectedColor(color)} />
        </div >
    )
}

export function ColoPicker({ onChange }: { onChange: (color: string) => void }) {

    return (
        <div className="grid grid-cols-5 gap-1 place-start w-[fit-content]">
            {
                defaultColors.map((color) => (
                    <div
                        key={color}
                        className="w-[25px] h-[25px] shrink-0 rounded border"
                        style={{ backgroundColor: color }}
                        onClick={() => onChange(color)}
                    >
                    </div>
                ))
            }
            <div className="h-[25px] w-[25px] relative bg-gradient-to-br rounded overflow-hidden">
                <input type="color" className="opacity-0" onChange={(e) => onChange(e.target.value)} />
            </div>
        </div>
    )
}


const defaultColors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#0000FF",
    "#FFFF00",
    "#FFA500",
    "#663399",
    "#A52A2A",
    "#FFC0CB",
    "#008080",
    "#000080",
    "#a9a9a9",
    "#FF1493",
    "#00FF00",
]

