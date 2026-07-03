export function VeranaMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Verana" role="img">
      <defs>
        <linearGradient id="verana-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#763EF0" />
          <stop offset="1" stopColor="#9F7AEA" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#verana-mark)" />
      <g transform="translate(6.5 7) scale(0.5)" fill="#fff">
        <path d="M26.9932 51.6972L5.805 11.0977L2.91263 16.2161L0 10.6048L5.98725 0L26.9932 40.2483L47.9993 0L54 10.6217L51.0773 16.2161L48.1849 11.0977L26.9932 51.6972Z" />
        <path d="M13.696 0L26.9935 25.4637L39.9367 0H13.696Z" />
      </g>
    </svg>
  )
}
