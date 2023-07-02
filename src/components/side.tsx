import { useAtom } from 'jotai';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppState } from '../jotai';
import ColorPanel from './colorpick';
import {
    Actions,
    ArrowOnlyOptions,
    BorderRadius,
    FillToolsOptions,
    ImageOptions,
    Layers,
    Opacity,
    TextOptions,
} from './toolOptions';
import Tools from './tools';
import { closeMenus } from '../lib/utils';
import Menu from './menu';

export default function Side() {
    const [closed, setClosed] = useState(true);
    const [main] = useAtom(AppState);
    const [width] = useState(200);
    const sideRef = useRef(null);
    const [, setTheme] = useState<'dark' | 'light'>('light');
    const tool = main.tool;
    useLayoutEffect(() => {
        const t = localStorage.getItem('theme');
        if (t) {
            setTheme(t === 'dark' ? 'dark' : 'light');
        }
    }, []);

    useEffect(() => {
        let w = window.innerWidth;
        if (w < 768) {
            setClosed(true);
        } else {
            setClosed(false);
        }
    }, []);

    return (
        <>
            <aside
                className="bg-[var(--accents-1)] fixed flex flex-col items-center top-0 left-0 bottom-0 border-r border-[var(--accents-2)]  transition-all z-10 overflow-hidden"
                ref={sideRef}
                style={{
                    width: closed ? 0 : width + 'px',
                }}
                onClick={() => {
                    closeMenus();
                }}
            >
                <div
                    className="relative bg-[var(--accents-1)] relative w-full h-full overflow-y-auto pb-10"
                    style={{
                        overflowX: 'hidden',
                    }}
                >
                    <ColorPanel />
                    <Tools />
                    <div className="flex flex-col gap-3 p-2 shadow bg-[var(--background)] mx-3 my-5 rounded p-5">
                        {(tool === 'ellipse' ||
                            tool === 'rectangle' ||
                            tool === 'diamond' ||
                            tool === 'arrow' ||
                            tool === 'line' ||
                            tool === 'pencil') && <FillToolsOptions />}
                        {(tool === 'diamond' || tool === 'rectangle') && <BorderRadius />}
                        {tool === 'arrow' && <ArrowOnlyOptions />}
                        {tool === 'text' && <TextOptions />}
                        {tool === 'image' && <ImageOptions />}
                        <Opacity />
                        <Layers />
                        <Actions />
                    </div>
                </div>
                <a
                    href="https://github.com/dawkaka/drawapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 p-1 font-semibold mb-3 text-white inline-flex items-center space-x-2 rounded"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        className="w-5"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                    >
                        <g fill="none">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                                fill="currentColor"
                            />
                        </g>
                    </svg>
                </a>
                <Menu />

                <div
                    className="h-[40px] w-[40px] flex items-center pl-2 text-[var(--accents-7)] cursor-pointer bg-[var(--accents-1)] border border-[var(--accents-2)] fixed top-[50%] rounded-full translateY(-100%) transition-all"
                    style={{
                        clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                        left: closed ? '-20px' : `${width - 20}px`,
                        transform: closed ? 'rotateY(180deg)' : '',
                    }}
                    onClick={() => setClosed(!closed)}
                >
                    {'<'}
                </div>
            </aside>
        </>
    );
}
