export default function DelivreLogo({ className = "w-12 h-12" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle - Orange */}
      <circle cx="100" cy="100" r="95" fill="#FF8C00" />
      
      {/* Inner white circle */}
      <circle cx="100" cy="100" r="85" fill="white" />
      
      {/* Location pin - left side */}
      <g>
        <circle cx="70" cy="80" r="15" fill="#FF8C00" />
        <path
          d="M70 80 L60 100 Q70 115 80 100 Z"
          fill="#FF8C00"
        />
      </g>
      
      {/* Clock - right side */}
      <g>
        <circle cx="130" cy="80" r="18" stroke="#FF8C00" strokeWidth="4" fill="none" />
        <line x1="130" y1="65" x2="130" y2="50" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />
        <line x1="145" y1="80" x2="160" y2="80" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />
        <circle cx="130" cy="80" r="4" fill="#FF8C00" />
      </g>
      
      {/* FREE banner - bottom */}
      <rect x="35" y="130" width="130" height="45" rx="10" fill="#FF8C00" />
      <text
        x="100"
        y="165"
        fontSize="32"
        fontWeight="900"
        fill="white"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        letterSpacing="2"
      >
        FREE
      </text>
    </svg>
  );
}
