interface BrandLogoProps {
  size?: number;
}

export function BrandLogo({ size = 30 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="36" height="36" rx="11" fill="#E8EEE5" />
      <path
        d="M10 21.5C10 16.2533 14.2533 12 19.5 12H25.5C25.5 17.2467 21.2467 21.5 16 21.5H10Z"
        fill="#A9BBA6"
      />
      <path
        d="M10.5 24.5C13.5 24.5 15.8 22.8 17.4 20.4C19.1 17.9 21.3 16.5 25 16.5"
        stroke="#34443B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="24.5" cy="11.5" r="2.5" fill="#D8D0E5" stroke="#34443B" strokeWidth="1.4" />
    </svg>
  );
}
