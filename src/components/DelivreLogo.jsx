export default function DelivreLogo({ className = "w-12 h-12" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="100" cy="100" r="95" stroke="#FF8C00" strokeWidth="12" />
      
      {/* Inner circle */}
      <circle cx="100" cy="100" r="70" stroke="#FF8C00" strokeWidth="8" fill="none" />
      
      {/* Location pin */}
      <circle cx="75" cy="85" r="12" fill="#FF8C00" />
      <path
        d="M75 85 Q75 70 85 60 Q95 50 75 40 Q55 50 65 60 Q75 70 75 85"
        fill="#FF8C00"
      />
      
      {/* Clock */}
      <circle cx="125" cy="85" r="20" stroke="#FF8C00" strokeWidth="3" fill="none" />
      <line x1="125" y1="75" x2="125" y2="65" stroke="#FF8C00" strokeWidth="2" />
      <line x1="135" y1="85" x2="145" y2="85" stroke="#FF8C00" strokeWidth="2" />
      
      {/* Clock marks */}
      <circle cx="125" cy="65" r="2" fill="#FF8C00" />
      <circle cx="145" cy="85" r="2" fill="#FF8C00" />
      <circle cx="125" cy="105" r="2" fill="#FF8C00" />
      <circle cx="105" cy="85" r="2" fill="#FF8C00" />
      
      {/* FREE banner */}
      <rect x="40" y="140" width="120" height="35" rx="8" fill="#FF8C00" />
      <text
        x="100"
        y="165"
        fontSize="24"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        FREE
      </text>
    </svg>
  );
}
