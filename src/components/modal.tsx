import { useEffect, useMemo, useRef, useState } from 'react';
import { CanvasItem } from '../types';
import axios, { AxiosResponse } from 'axios';
import { useAtom } from 'jotai';
import { AppDrawings, AppState } from '../jotai';
import { Error, Loading, Success } from './mis';
import {
  getInverseColorForTheme,
  getMultipleSelectionBounds,
} from '../lib/utils';
import { renderElements } from '../lib/render';

interface ModalProps {
  clearFunc: () => void;
  close: () => void;
}

export function ClearModal({ clearFunc, close }: ModalProps) {
  return (
    <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.3)] p-4 overflow-x-hidden overflow-y-auto h-modal h-full">
      <div className="relative w-full h-full max-w-md md:h-auto">
        <div className="relative bg-[var(--background)] rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            onClick={close}
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Delete the entire canvas?
              <br /> This action can not be reversed
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={clearFunc}
              className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Clear canvas
            </button>
            <button
              data-modal-hide="popup-modal"
              type="button"
              onClick={close}
              className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DownloadModal({
  items,
  close,
}: {
  items: CanvasItem[];
  close: () => void;
}) {
  const [main, setAppState] = useAtom(AppState);
  const canvasRef = useRef<HTMLImageElement>(null);
  const canvasBlob = useRef<string>('');
  const [background, setBackground] = useState(true);
  const [padding, setPadding] = useState(0);

  function adjustItemsXY(
    items: CanvasItem[],
    x: number,
    y: number
  ): CanvasItem[] {
    const mod = items.map((item) => {
      return {
        ...item,
        x: item.x + x,
        y: item.y + y,
      };
    });
    return mod;
  }

  const imgWidth = useMemo(() => {
    let c = document.createElement('canvas') as HTMLCanvasElement;
    let ctx = c.getContext('2d')!;
    let bounds;
    if (main.multipleSelections.length > 0) {
      bounds = getMultipleSelectionBounds(main.multipleSelections, items);
    } else {
      bounds = getMultipleSelectionBounds(
        items.map((i) => i.id),
        items
      );
    }

    const padding2x = padding * 2;
    const x = -1 * bounds.x + padding;
    const y = -1 * bounds.y + padding;
    let modifiedItems;
    if (main.multipleSelections.length > 0) {
      let v = items.filter((i) => main.multipleSelections.includes(i.id));
      modifiedItems = adjustItemsXY(v, x, y);
    } else {
      modifiedItems = adjustItemsXY(items, x, y);
    }

    bounds = getMultipleSelectionBounds(
      main.multipleSelections.length > 0
        ? main.multipleSelections
        : modifiedItems.map((i) => i.id),
      modifiedItems
    );
    c.width = bounds.width + padding2x;
    c.height = bounds.height + padding2x;
    ctx.save();
    if (background) {
      ctx.fillStyle =
        getInverseColorForTheme('#FFFFFF') === '#FFFFFF'
          ? '#000000'
          : '#FFFFFF';
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.restore();
    if (modifiedItems.length > 0) {
      renderElements(ctx, modifiedItems);
    }
    c.toBlob((blob) => {
      if (blob) {
        canvasRef.current!.src = URL.createObjectURL(blob);
        canvasBlob.current = URL.createObjectURL(blob);
      }
    }, 'image/png');
    return bounds.width + padding2x;
  }, [background, padding]);

  function saveToDisk() {
    const link = document.createElement('a');
    link.download = `draaaw-${new Date().toISOString()}.png`;
    link.href = canvasBlob.current;
    link.click();
  }

  return (
    <div
      id="staticModal"
      data-modal-backdrop="static"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed flex items-center justify-center top-0 bg-[rgba(0,0,0,0.3)] left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-[var(--background)] rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-[var(--accents-7)]">
              Download
            </h3>
            <button
              type="button"
              onClick={close}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-4 flex justify-center space-y-6 bg-[url('/trbackground.png')]">
            <img
              ref={canvasRef}
              style={{ width: imgWidth, objectFit: 'contain' }}
            />
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-1 items-center">
                <label className="text-[var(--accents-6)]">Background</label>
                <input
                  type="checkbox"
                  checked={background}
                  onChange={(e) => setBackground(e.target.checked)}
                />
              </div>
              <div className="flex flex-col gap-1 items-center">
                <label className="text-[var(--accents-6)]">Padding</label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={padding}
                  step={1}
                  onChange={(e) => setPadding(Number(e.target.value))}
                />
              </div>
            </div>
            <button
              onClick={saveToDisk}
              data-modal-hide="staticModal"
              type="button"
              className="text-white bg-[darkorange] focus:ring-4 focus:outline-none focus:ring-[#faecd2] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ link, label }: { link: string; label: string }) {
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useAtom(AppDrawings);
  const [loaded, settLoaded] = useState('');
  const copyLinkURL = () => {
    navigator.clipboard.writeText(window.location.origin + '/?id=' + link).then(
      () => {
        alert('link copied');
      },
      () => {
        alert('Failed to copy link');
      }
    );
  };

  const loadFromLink = () => {
    if (confirm('Loading link will erase you current drawing')) {
      setLoading(true);
      axios
        .get(`https://drawapp-backend.vercel.app/api/link?id=${link}`)
        .then((res) => {
          if (res.data.data && Array.isArray(res.data.data)) {
            setItems(res.data.data);
            settLoaded('Loaded');
          }
        })
        .catch((e) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteLink = () => {
    if (
      confirm(
        "Are you sure you want to delete this link?.\n Action can't be reversed"
      )
    ) {
      setDeleted(true);
      axios
        .delete(`https://drawapp-backend.vercel.app/api/link?id=${link}`)
        .then((res) => {
          let links = localStorage.getItem('links');
          if (links) {
            let l = JSON.parse(links);
            if (Array.isArray(l)) {
              l = l.filter((v) => String(v.id) !== link);
              localStorage.setItem('links', JSON.stringify(l));
            }
          }
        })
        .catch((e) => {
          setDeleted(false);
        });
    }
  };
  if (deleted) {
    return null;
  }
  return (
    <>
      <div className="flex gap-4 items-center mx-auto">
        {loading ? (
          <Loading />
        ) : (
          <>
            {' '}
            <p className="border px-3 py-1 rounded-lg w-[100%]">{label}</p>
            <button
              className="rounded px-2 text-green-500 border border-green-500"
              onClick={copyLinkURL}
            >
              Copy
            </button>
            <button
              className="rounded px-2 text-blue-500 border border-blue-500"
              onClick={loadFromLink}
            >
              Load
            </button>
            <button
              className="bg-red-600 rounded px-2 text-white"
              onClick={deleteLink}
            >
              Delete
            </button>
          </>
        )}
      </div>
      {loaded && <Success message="Link laoded" />}
    </>
  );
}

export function Links({ close }: { close: () => void }) {
  const [savedLinks, setSavedLinks] = useState<{ id: number; label: string }[]>(
    []
  );

  useEffect(() => {
    let links = localStorage.getItem('links');
    if (links) {
      let l = JSON.parse(links);
      if (Array.isArray(l)) {
        setSavedLinks(l.reverse());
      }
    }
  }, []);

  return (
    <div
      id="staticModal"
      data-modal-backdrop="static"
      tabIndex={-1}
      aria-hidden="true"
      onClick={() => close()}
      className="fixed flex items-center justify-center top-0 bg-[rgba(0,0,0,0.3)] left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full"
    >
      <div
        className="relative w-full max-w-2xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-[var(--background)] rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b border-[var(--accents-2)] rounded-t">
            <h3 className="text-xl font-semibold text-[var(--accents-7)] dark:text-white">
              My links
            </h3>
            <button
              type="button"
              onClick={close}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
            {savedLinks.map((l) => (
              <Link label={l.label} link={String(l.id)} key={l.id} />
            ))}
            {savedLinks.length === 0 && <p>No links available</p>}
          </div>
          <div className="flex items-center p-6 space-x-2 border-t rounded-b border-[var(--accents-2)]"></div>
        </div>
      </div>
    </div>
  );
}

function SaveLink({
  link,
  label,
  selected,
  select,
}: {
  link: string;
  label: string;
  selected: string;
  select: (val: string) => void;
}) {
  return (
    <div className="flex gap-4 items-center mx-auto">
      <label className="border px-3 py-1 rounded-lg w-[100%]" htmlFor={link}>
        {label}
      </label>
      <input
        type="checkbox"
        className="cursor-pointer"
        onChange={(e) => {
          if (e.target.checked) {
            select(link);
          } else {
            select('');
          }
        }}
        id={link}
        checked={selected === link}
      />
    </div>
  );
}

export function Save({ close }: { close: () => void }) {
  const [label, setLabel] = useState('');
  const [selected, setSelected] = useState('');
  const [items, setItems] = useAtom(AppDrawings);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [savedLinks, setSavedLinks] = useState<{ id: number; label: string }[]>(
    []
  );

  useEffect(() => {
    let links = localStorage.getItem('links');
    if (links) {
      let l = JSON.parse(links);
      if (Array.isArray(l)) {
        setSavedLinks(l.reverse());
      }
    }
  }, []);

  function saveWork() {
    if (label === '' && selected === '') return;
    setLoading(true);
    if (label) {
      axios
        .post<any, AxiosResponse<{ insertedID: number }, any>, string>(
          `https://drawapp-backend.vercel.app/api/link`,
          JSON.stringify({ label, data: items })
        )
        .then((res) => {
          let links = localStorage.getItem('links');
          if (!links) {
            localStorage.setItem(
              'links',
              JSON.stringify([{ id: res.data.insertedID, label }])
            );
          } else {
            let l = JSON.parse(links);
            if (Array.isArray(l)) {
              l.push({ id: res.data.insertedID, label });
              localStorage.setItem('links', JSON.stringify(l));
            } else {
              localStorage.setItem(
                'links',
                JSON.stringify({ id: res.data.insertedID, label })
              );
            }
          }
          setSelected('');
          setLabel('');
          setError(false);
          setSuccess(
            `Saved succesfully at: ${window.location.origin}/?id=${res.data.insertedID}`
          );
        })
        .catch((e) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios
        .put(
          `https://drawapp-backend.vercel.app/api/link?id=${selected}`,
          JSON.stringify({ data: items })
        )
        .then((res) => {
          setSelected('');
          setLabel('');
          setError(false);
          setSuccess(
            `Updated succesfully at: ${window.location.origin}/?id=${selected}`
          );
        })
        .catch((e) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <div
      id="staticModal"
      data-modal-backdrop="static"
      tabIndex={-1}
      aria-hidden="true"
      onClick={() => close()}
      className="fixed flex items-center justify-center top-0 bg-[rgba(0,0,0,0.3)] left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full"
    >
      <div
        className="relative w-full max-w-2xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-[var(--background)] rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b border-[var(--accents-2)] rounded-t">
            <h3 className="text-xl font-semibold text-[var(--accents-7)]">
              Save to link
            </h3>
            <button
              type="button"
              onClick={close}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
            <div>
              <div className="flex flex-col gap-1">
                <label htmlFor="label">Link label</label>
                <input
                  type="text"
                  id="label"
                  className="border px-2 py-1 rounded-lg outline-none"
                  maxLength={100}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    setSelected('');
                  }}
                />
              </div>
            </div>
            {success && <Success message={success} />}
            {error && <Error message="Something went wrong" />}
            <h4 className="text-sm font-semibold text-[var(--accents-7)]">
              Or save to existing link
            </h4>
            {label === '' && (
              <div className="px-6 pb-6 space-y-6 max-h-[40vh] overflow-y-auto">
                {savedLinks.map((l) => (
                  <SaveLink
                    key={l.id}
                    label={l.label}
                    link={String(l.id)}
                    selected={selected + label}
                    select={(value: string) => setSelected(value)}
                  />
                ))}
                {savedLinks.length === 0 && <p>No links available</p>}
              </div>
            )}
          </div>

          <div className="px-6 py-3 w-full flex justify-end">
            {loading ? (
              <Loading />
            ) : (
              <button
                className={` ${
                  label === '' && selected === ''
                    ? 'bg-blue-100'
                    : 'bg-blue-600'
                } rounded-lg text-white px-6 py-1`}
                disabled={label === '' && selected === ''}
                onClick={saveWork}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
