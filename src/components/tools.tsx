import { useAtom } from "jotai"
import { ReactNode } from "react"
import { AppDrawings, AppState, SelectionAtom } from "../jotai"
import { deleteItem, getRandomID } from "../lib/utils"
import type { Image, Tool } from "../types"


export default function Tools() {
    const [app, setState] = useAtom(AppState)
    const tool = app.tool
    const [items, setItems] = useAtom(AppDrawings)
    const [selectedItem] = useAtom(SelectionAtom)

    function deleteSelectedItem() {
        if (selectedItem) {
            const n = deleteItem(selectedItem.id, items)
            setItems(n)
            localStorage.setItem("canvasItems", JSON.stringify(n))
        }
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const fs = e.currentTarget.files
        if (fs) {
            const extInd = fs[0].name.lastIndexOf(".")
            const ext = fs[0].name.substring(extInd)
            if (![".jpeg", ".jpg", ".png"].includes(ext)) {
                return
            }
            const reader = new FileReader()
            reader.readAsDataURL(fs[0])
            reader.onload = () => {
                const imageItem: Image = {
                    id: getRandomID(),
                    type: "image",
                    data: reader.result as string,
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    width: 500,
                    height: 500,
                    opacity: 1,
                }
                const add = [...items, imageItem]
                setItems(add)
                setState({ ...app, selectedItemID: imageItem.id })
                localStorage.setItem("canvasItems", JSON.stringify(add))
                e.target.value = ""
            }
        }
    }


    return (
        <div className="bg-white rounded shadow m-3 p-3">
            <div className="flex flex-wrap gap-3">

                <CanvasTool onClick={() => setState({ ...app, tool: "select" })} tool="select" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 22 22" className="block" strokeWidth="1.25"><g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M6 6l4.153 11.793a0.365 .365 0 0 0 .331 .207a0.366 .366 0 0 0 .332 -.207l2.184 -4.793l4.787 -1.994a0.355 .355 0 0 0 .213 -.323a0.355 .355 0 0 0 -.213 -.323l-11.787 -4.36z"></path><path d="M13.5 13.5l4.5 4.5"></path></g></svg>
                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "rectangle" })} tool="rectangle" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect></g></svg>
                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "diamond" })} tool="diamond" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10.5 20.4l-6.9 -6.9c-.781 -.781 -.781 -2.219 0 -3l6.9 -6.9c.781 -.781 2.219 -.781 3 0l6.9 6.9c.781 .781 .781 2.219 0 3l-6.9 6.9c-.781 .781 -2.219 .781 -3 0z"></path></g></svg>
                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "ellipse" })} tool="ellipse" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="12" r="9"></circle></g></svg>                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "arrow" })} tool="arrow" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "line" })} tool="line" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4.167 10h11.666" strokeWidth="1.5"></path></svg>
                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "pencil" })} tool="pencil" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg aria-hidden="true" focusable="false" role="img" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.25"><path clipRule="evenodd" d="m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z"></path><path d="m11.25 5.417 3.333 3.333"></path></g></svg>
                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "text" })} tool="text" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.94993 2.95002L3.94993 4.49998C3.94993 4.74851 3.74845 4.94998 3.49993 4.94998C3.2514 4.94998 3.04993 4.74851 3.04993 4.49998V2.50004C3.04993 2.45246 3.05731 2.40661 3.07099 2.36357C3.12878 2.18175 3.29897 2.05002 3.49993 2.05002H11.4999C11.6553 2.05002 11.7922 2.12872 11.8731 2.24842C11.9216 2.32024 11.9499 2.40682 11.9499 2.50002L11.9499 2.50004V4.49998C11.9499 4.74851 11.7485 4.94998 11.4999 4.94998C11.2514 4.94998 11.0499 4.74851 11.0499 4.49998V2.95002H8.04993V12.05H9.25428C9.50281 12.05 9.70428 12.2515 9.70428 12.5C9.70428 12.7486 9.50281 12.95 9.25428 12.95H5.75428C5.50575 12.95 5.30428 12.7486 5.30428 12.5C5.30428 12.2515 5.50575 12.05 5.75428 12.05H6.94993V2.95002H3.94993Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>                    </div>
                </CanvasTool>

                <CanvasTool onClick={() => setState({ ...app, tool: "image" })} tool="image" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }} className="relative">
                        <input type="file" className="absolute h-[22px] w-[22px] top-0 left-0 opacity-0" onChange={handleFileInput} />
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.25"><path d="M12.5 6.667h.01"></path><path d="M4.91 2.625h10.18a2.284 2.284 0 0 1 2.285 2.284v10.182a2.284 2.284 0 0 1-2.284 2.284H4.909a2.284 2.284 0 0 1-2.284-2.284V4.909a2.284 2.284 0 0 1 2.284-2.284Z"></path><path d="m3.333 12.5 3.334-3.333c.773-.745 1.726-.745 2.5 0l4.166 4.166"></path><path d="m11.667 11.667.833-.834c.774-.744 1.726-.744 2.5 0l1.667 1.667"></path></g></svg>
                    </div>
                </CanvasTool>

                <CanvasTool onClick={deleteSelectedItem} tool="eraser" selectedTool={tool}>
                    <div style={{ width: "22px", height: "22px" }}>
                        <svg width="22" height="22" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2 4.656a.5.5 0 01.5-.5h9.7a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5z"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.272 3a.578.578 0 00-.578.578v.578h3.311v-.578A.578.578 0 008.428 3H6.272zm3.733 1.156v-.578A1.578 1.578 0 008.428 2H6.272a1.578 1.578 0 00-1.578 1.578v.578H3.578a.5.5 0 00-.5.5V12.2a1.578 1.578 0 001.577 1.578h5.39a1.578 1.578 0 001.577-1.578V4.656a.5.5 0 00-.5-.5h-1.117zm-5.927 1V12.2a.578.578 0 00.577.578h5.39a.578.578 0 00.577-.578V5.156H4.078z">
                            </path><path fillRule="evenodd" clipRule="evenodd" d="M6.272 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5zM8.428 6.85a.5.5 0 01.5.5v3.233a.5.5 0 11-1 0V7.35a.5.5 0 01.5-.5z">
                            </path></svg>
                    </div>
                </CanvasTool>
            </div>
        </div >
    )
}


export function CanvasTool({ onClick, tool, selectedTool, children }: { onClick: () => void, tool: Tool, selectedTool: Tool, children: ReactNode }) {
    return (
        <button className="w-fit p-2 rounded hover:bg-[#faecd2]"
            onClick={onClick}
            style={{
                backgroundColor: selectedTool === tool ? "#faecd2" : "",
                border: `1px solid ${selectedTool === tool ? "#faecd2" : "var(--accents-2)"}`,
                fill: selectedTool === tool ? "darkorange" : "none",
                color: selectedTool === tool ? "darkorange" : ""
            }}
        >
            {children}
        </button>
    )
}