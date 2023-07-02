import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { AppDrawings, AppState, SelectionAtom } from '../jotai';
import { closeMenus, getSelectedItem, updateSingleItem } from '../lib/utils';
import { defaultValues } from '../constants';

export default function ColorPanel() {
  return (
    <div className="flex flex-col gap-4 py-5 px-1 justify-between md:flex-col">
      <div className="flex justify-between  gap-2">
        <Stroke />
        <Fill />
      </div>
    </div>
  );
}

function Stroke() {
  const [main, setAppState] = useAtom(AppState);
  const { strokeColor } = main;
  const [items, setItems] = useAtom(AppDrawings);
  const [selectedItem] = useAtom(SelectionAtom);
  const strokeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = localStorage.getItem('theme');
    if (t) {
      if (t === 'dark') {
        defaultValues.strokeColor = '#FFFFFF';
        setAppState({ ...main, strokeColor: '#FFFFFF' });
      } else {
        defaultValues.strokeColor = '#000000';
        setAppState({ ...main, strokeColor: '#000000' });
      }
    }
  }, []);

  function updateColor(color: string) {
    if (color) {
      if (selectedItem) {
        const item = getSelectedItem(selectedItem.id, items);
        if (
          item &&
          (item.type === 'text' ||
            item.type === 'arrow' ||
            item.type === 'line' ||
            item.type === 'diamond' ||
            item.type === 'rectangle' ||
            item.type === 'ellipse' ||
            item.type === 'pencil')
        ) {
          item.strokeStyle = color;
          setItems(updateSingleItem(selectedItem.id, item, items));
        }
      }
      setAppState({ ...main, strokeColor: color });
    }
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      <h3 className="text-sm  text-[var(--foreground)]">Stroke</h3>
      <div className="flex flex-col items-center gap-1">
        <div
          className="rounded h-[25px] w-[25px] border"
          style={{
            backgroundColor: strokeColor,
          }}
          onClick={(e) => {
            e.stopPropagation();
            closeMenus();
            if (strokeRef.current) {
              strokeRef.current.style.display = 'grid';
            }
          }}
        ></div>
        <div className="text-neutral-500 text-sm">{strokeColor}</div>
      </div>
      <div
        className="hidden fixed top-[90px] left-[10px] z-20 p-2 bg-[var(--background)] grid-cols-5 gap-1 w-max"
        id="stroke-picker"
        ref={strokeRef}
      >
        {defaultColors.map((color) => (
          <div
            key={color}
            className="w-[25px] h-[25px] shrink-0 rounded border"
            style={{ backgroundColor: color }}
            onClick={(e) => {
              e.stopPropagation();
              updateColor(color);
            }}
          ></div>
        ))}
        <div className="h-[25px] w-[25px] relative bg-gradient-to-br rounded overflow-hidden">
          <input
            type="color"
            className="opacity-0"
            onChange={(e) => updateColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Fill() {
  const [main, setAppState] = useAtom(AppState);
  const { fillColor } = main;
  const [items, setItems] = useAtom(AppDrawings);
  const [selectedItem] = useAtom(SelectionAtom);

  const fillRef = useRef<HTMLDivElement>(null);

  function updateColor(color: string) {
    if (color) {
      if (selectedItem) {
        const item = getSelectedItem(selectedItem.id, items);
        if (
          item &&
          (item.type === 'diamond' ||
            item.type === 'rectangle' ||
            item.type === 'ellipse')
        ) {
          item.fillStyle = color;
          setItems(updateSingleItem(selectedItem.id, item, items));
        }
      }
      setAppState({ ...main, fillColor: color });
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-1 items-center">
        <h3 className="text-sm text-[var(--foreground)]">Background</h3>
        <div className="flex flex-col items-center gap-1">
          <div
            className="rounded h-[25px] w-[25px] border"
            style={{
              backgroundColor: fillColor,
            }}
            onClick={(e) => {
              closeMenus();
              e.stopPropagation();
              if (fillRef.current) {
                fillRef.current.style.display = 'grid';
              }
            }}
          ></div>
          <div className="text-neutral-500 text-sm">{fillColor}</div>
        </div>
      </div>
      <div
        className="hidden fixed z-20 p-2 bg-[var(--background)] grid-cols-5 gap-1 w-max"
        id="fill-picker"
        ref={fillRef}
      >
        {defaultColors.map((color) => (
          <div
            key={color}
            className="w-[25px] h-[25px] shrink-0 rounded border"
            style={{ backgroundColor: color }}
            onClick={(e) => {
              e.stopPropagation();
              updateColor(color);
            }}
          ></div>
        ))}
        <div className="h-[25px] w-[25px] relative bg-gradient-to-br rounded overflow-hidden">
          <input
            type="color"
            className="opacity-0"
            onChange={(e) => updateColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

const defaultColors = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#0000FF',
  '#FFFF00',
  '#FFA500',
  '#663399',
  '#A52A2A',
  '#FFC0CB',
  '#008080',
  '#000080',
  '#a9a9a9',
  '#FF1493',
  '#00FF00',
];
