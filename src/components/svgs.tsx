export function HeadArrowSVG() {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      id="right-arrow"
      data-name="Flat Line"
      xmlns="http://www.w3.org/2000/svg"
      className="icon flat-line"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <line
          id="primary"
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          style={{
            fill: 'none',
            stroke: 'currentColor',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 1.8719999999999999,
          }}
        ></line>
        <polyline
          id="primary-2"
          data-name="primary"
          points="18 15 21 12 18 9"
          style={{
            fill: 'none',
            stroke: 'currentColor',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 1.8719999999999999,
          }}
        ></polyline>
      </g>
    </svg>
  );
}

export function NoneSVG() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className=""
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.167 10h11.666" strokeWidth="1.5"></path>
    </svg>
  );
}

export function TriangleSVG() {
  return (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 40 20">
      <g stroke="currentColor" fill="currentColor" transform="">
        <path d="M32 10L6 10" stroke-width="2"></path>
        <path d="M27.5 5.5L34.5 10L27.5 14.5L27.5 5.5"></path>
      </g>
    </svg>
  );
}

export function CircleHeadSVG() {
  return (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 40 20">
      <g stroke="currentColor" fill="currentColor" transform="">
        <path d="M32 10L6 10" stroke-width="2"></path>
        <circle r="4" transform="matrix(-1 0 0 1 30 10)"></circle>
      </g>
    </svg>
  );
}

export function LineSVG() {
  return (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 40 20">
      <g transform="">
        <path
          d="M34 10H5.99996M34 10L34 5M34 10L34 15"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        ></path>
      </g>
    </svg>
  );
}
