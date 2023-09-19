import React from 'react'
export const ShareIcon = ({ width, height, fill, style = {} }) => {
  return (<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15 12" fill="none" style={style}>
    <g clip-path="url(#clip0_19418_2158)">
      <path d="M11.25 10.05C10.775 10.05 10.35 10.2375 10.025 10.5312L5.56875 7.9375C5.6 7.79375 5.625 7.65 5.625 7.5C5.625 7.35 5.6 7.20625 5.56875 7.0625L9.975 4.49375C10.3125 4.80625 10.7563 5 11.25 5C12.2875 5 13.125 4.1625 13.125 3.125C13.125 2.0875 12.2875 1.25 11.25 1.25C10.2125 1.25 9.375 2.0875 9.375 3.125C9.375 3.275 9.4 3.41875 9.43125 3.5625L5.025 6.13125C4.6875 5.81875 4.24375 5.625 3.75 5.625C2.7125 5.625 1.875 6.4625 1.875 7.5C1.875 8.5375 2.7125 9.375 3.75 9.375C4.24375 9.375 4.6875 9.18125 5.025 8.86875L9.475 11.4688C9.44375 11.6 9.425 11.7375 9.425 11.875C9.425 12.8813 10.2437 13.7 11.25 13.7C12.2563 13.7 13.075 12.8813 13.075 11.875C13.075 10.8687 12.2563 10.05 11.25 10.05Z" fill={fill} />
    </g>
    <defs>
      <clipPath id="clip0_19418_2158">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs> </svg>)
}

export default ShareIcon