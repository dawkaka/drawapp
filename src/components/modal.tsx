import { useEffect, useRef, useState } from "react";
import { CanvasItem } from "../types";
import axios, { AxiosResponse } from "axios";
import { useAtom } from "jotai";
import { AppDrawings } from "../jotai";
import { Error, Loading, Success } from "./mis";

interface ModalProps {
    clearFunc: () => void;
    close: () => void
}

export function ClearModal({ clearFunc, close }: ModalProps) {

    return (

        <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.3)] p-4 overflow-x-hidden overflow-y-auto h-modal h-full">
            <div className="relative w-full h-full max-w-md md:h-auto">
                <div className="relative bg-[var(--background)] rounded-lg shadow dark:bg-gray-700">
                    <button type="button"
                        onClick={close}
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Delete the entire canvas?<br /> This action can not be reversed</h3>
                        <button data-modal-hide="popup-modal" type="button"
                            onClick={clearFunc}
                            className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Clear canvas
                        </button>
                        <button data-modal-hide="popup-modal" type="button"
                            onClick={close}
                            className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

    )
}


export function DownloadModal({ items, close }: { items: CanvasItem[], close: () => void }) {
    return (
        <div id="staticModal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true"
            className="fixed flex items-center justify-center top-0 bg-[rgba(0,0,0,0.3)] left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full">
            <div className="relative w-full max-w-2xl max-h-full">
                <div className="relative bg-[var(--background)] rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Download
                        </h3>
                        <button type="button"
                            onClick={close}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                        </p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                        </p>
                    </div>
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button data-modal-hide="staticModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                        <button data-modal-hide="staticModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                    </div>
                </div>
            </div>
        </div>

    )
}


function Link({ link, label }: { link: string, label: string }) {
    return (
        <div className="flex gap-4 items-center mx-auto">
            <p className="border px-3 py-1 rounded-lg w-[100%]">{label}</p>
            <button className="rounded px-2 text-green-500 border border-green-500">Copy</button>
            <button className="rounded px-2 text-blue-500 border border-blue-500">Load</button>
            <button className="bg-red-600 rounded px-2 text-white">Delete</button>
        </div>
    )
}

export function Links({ close }: { close: () => void }) {
    return (
        <div id="staticModal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true"
            onClick={() => close()}
            className="fixed flex items-center justify-center top-0 bg-[rgba(0,0,0,0.3)] left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full">
            <div className="relative w-full max-w-2xl max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-[var(--background)] rounded-lg shadow">
                    <div className="flex items-start justify-between p-4 border-b border-[var(--accents-2)] rounded-t">
                        <h3 className="text-xl font-semibold text-[var(--accents-7)] dark:text-white">
                            My links
                        </h3>
                        <button type="button"
                            onClick={close}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                        <Link label="Link" link="das" />
                    </div>
                    <div className="flex items-center p-6 space-x-2 border-t rounded-b border-[var(--accents-2)]">
                    </div>
                </div>
            </div>
        </div>

    )
}


function SaveLink({ link, label, selected, select }: { link: string, label: string, selected: string, select: (val: string) => void }) {
    return (
        <div className="flex gap-4 items-center mx-auto">
            <label className="border px-3 py-1 rounded-lg w-[100%]" htmlFor={link}>{label}</label>
            <input type="checkbox" className="cursor-pointer" onChange={(e) => {
                if (e.target.checked) {
                    select(link)
                } else {
                    select("")
                }
            }}
                id={link}
                checked={selected === link}
            />
        </div>
    )
}



export function Save({ close }: { close: () => void }) {
    const [label, setLabel] = useState("")
    const [selected, setSelected] = useState("")
    const [items, setItems] = useAtom(AppDrawings)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [savedID, setSavedID] = useState("")

    const [savedLinks, setSavedLinks] = useState<{ id: number, label: string }[]>([])

    useEffect(() => {
        let links = localStorage.getItem("links")
        if (links) {
            let l = JSON.parse(links)
            if (Array.isArray(l)) {
                setSavedLinks(l)
            }
        }
    }, [])

    function saveWork() {
        if (label === "" && selected === "") return
        setLoading(true)
        if (label) {
            axios.post<any, AxiosResponse<{ insertedID: number }, any>, string>(`https://drawapp-backend.vercel.app/api/link`, JSON.stringify({ label, data: items }))
                .then(res => {
                    let links = localStorage.getItem("links")
                    setSavedID(String(res.data.insertedID))

                    if (!links) {
                        localStorage.setItem("links", JSON.stringify([{ id: res.data.insertedID, label }]))
                    } else {
                        let l = JSON.parse(links)
                        if (Array.isArray(l)) {
                            l.push({ id: res.data.insertedID, label })
                            localStorage.setItem("links", JSON.stringify(l))
                        } else {
                            localStorage.setItem("links", JSON.stringify({ id: res.data.insertedID, label }))
                        }
                    }
                    setSelected("")
                    setLabel("")
                    setError(false)
                    setSuccess(`Saved succesfully at: ${window.location.origin}/?id=${res.data.insertedID}`)
                })
                .catch(e => {
                    console.log(e)
                    setError(true)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            axios.put(`https://drawapp-backend.vercel.app/api/link?id=${selected}`, JSON.stringify({ data: items }))
                .then(res => {
                    console.log(res.data)
                    setSelected("")
                    setLabel("")
                    setError(false)
                    setSuccess(`Updated succesfully at: ${window.location.origin}/?id=${selected}`)

                })
                .catch(e => {
                    console.log(e)
                    setError(true)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <div id="staticModal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true"
            onClick={() => close()}
            className="fixed flex items-center justify-center top-0 bg-[rgba(0,0,0,0.3)] left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full">
            <div className="relative w-full max-w-2xl max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-[var(--background)] rounded-lg shadow">
                    <div className="flex items-start justify-between p-4 border-b border-[var(--accents-2)] rounded-t">
                        <h3 className="text-xl font-semibold text-[var(--accents-7)]">
                            Save to link
                        </h3>
                        <button type="button"
                            onClick={close}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="staticModal">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
                        <div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="label">Link label</label>
                                <input type="text" id="label" className="border px-2 py-1 rounded-lg outline-none" maxLength={100}
                                    onChange={(e) => {
                                        setLabel(e.target.value)
                                        setSelected("")
                                    }
                                    }
                                />
                            </div>
                        </div>
                        {
                            success && <Success message={success} />
                        }
                        {
                            error && <Error message="Something went wrong" />
                        }
                        <h4 className="text-sm font-semibold text-[var(--accents-7)]">Or save to existing link</h4>
                        {
                            label === "" && (
                                <div className="px-6 pb-6 space-y-6 max-h-[40vh] overflow-y-auto">
                                    {
                                        savedLinks.map((l) => <SaveLink label={l.label} link={String(l.id)} selected={selected + label} select={(value: string) => setSelected(value)} />
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>

                    <div className="px-6 py-3 w-full flex justify-end">
                        {
                            loading ? <Loading /> :
                                <button className={` ${label === "" && selected === "" ? "bg-blue-100" : "bg-blue-600"} rounded-lg text-white px-6 py-1`}
                                    disabled={label === "" && selected === ""}
                                    onClick={saveWork}
                                >Save</button>
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}