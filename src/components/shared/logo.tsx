
interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function TalkNativeLogo({ className = "h-12 w-auto", iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 200 202"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="bubbleGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f5c4c" />
            <stop offset="100%" stopColor="#0a3d33" />
          </linearGradient>
        </defs>
        <path
          d="M100 0C44.77 0 0 40.3 0 90C0 124.5 21.6 154.6 54 170V198C54 202 58.5 204.3 61.7 201.8L96 175.5C97.3 175.7 98.7 175.8 100 175.8C155.2 175.8 200 135.5 200 85.8C200 36.1 155.2 0 100 0Z"
          fill="url(#bubbleGradIcon)"
        />
        <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none">
          <line x1="60" y1="105" x2="60" y2="65" />
          <line x1="85" y1="120" x2="85" y2="45" />
          <line x1="110" y1="105" x2="110" y2="65" />
          <line x1="135" y1="115" x2="135" y2="55" />
        </g>
        <circle cx="150" cy="45" r="9" fill="#ffffff" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 720 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bubbleGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f5c4c" />
          <stop offset="100%" stopColor="#0a3d33" />
        </linearGradient>
      </defs>

      <g transform="translate(20,20)">
        <path
          d="M100 0C44.77 0 0 40.3 0 90C0 124.5 21.6 154.6 54 170V198C54 202 58.5 204.3 61.7 201.8L96 175.5C97.3 175.7 98.7 175.8 100 175.8C155.2 175.8 200 135.5 200 85.8C200 36.1 155.2 0 100 0Z"
          fill="url(#bubbleGradFull)"
        />
        <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none">
          <line x1="60" y1="105" x2="60" y2="65" />
          <line x1="85" y1="120" x2="85" y2="45" />
          <line x1="110" y1="105" x2="110" y2="65" />
          <line x1="135" y1="115" x2="135" y2="55" />
        </g>
        <circle cx="150" cy="45" r="9" fill="#ffffff" />
      </g>

      <g transform="translate(250,95)" fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif">
        <text x="0" y="40" fontSize="62" fontWeight="700" fill="currentColor">
          Talk<tspan fill="#1a9c7e">Native</tspan>
        </text>
        <text x="4" y="75" fontSize="17" fontWeight="500" fill="#5b8a80" letterSpacing="1.5">
          SPEAK. LEARN. BELONG.
        </text>
      </g>
    </svg>
  )
}
