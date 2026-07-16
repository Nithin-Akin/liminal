/** Simple hand-drawn-style SVG illustrations matching reference aesthetic */

export function MovingIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <ellipse cx="100" cy="145" rx="60" ry="8" fill="#2e2e2e" />
      {/* Person */}
      <circle cx="130" cy="55" r="18" fill="#ffd166" stroke="#121212" strokeWidth="2" />
      <path d="M130 73 Q125 95 120 110" stroke="#121212" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 110 L105 130 M120 110 L135 125" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
      <path d="M130 85 L145 70 M130 85 L115 75" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
      {/* Box */}
      <rect x="55" y="90" width="45" height="40" rx="4" fill="#ff6b35" stroke="#121212" strokeWidth="2" />
      <path d="M55 90 L77 75 L122 75 L100 90" fill="#e85a28" stroke="#121212" strokeWidth="2" />
      {/* Plant */}
      <rect x="30" y="120" width="20" height="15" rx="3" fill="#b8a9ff" stroke="#121212" strokeWidth="1.5" />
      <path d="M40 120 Q35 100 40 85 Q45 100 40 120" fill="#06d6a0" stroke="#121212" strokeWidth="1.5" />
    </svg>
  );
}

export function LonelyIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <ellipse cx="100" cy="145" rx="55" ry="8" fill="#2e2e2e" />
      <circle cx="100" cy="60" r="22" fill="#b8a9ff" stroke="#121212" strokeWidth="2" />
      <path d="M100 82 Q95 105 90 125" stroke="#121212" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M90 125 L75 135 M90 125 L105 135" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
      {/* Thought bubble */}
      <ellipse cx="145" cy="45" rx="30" ry="22" fill="#222" stroke="#3a3a3a" strokeWidth="1.5" />
      <circle cx="125" cy="65" r="4" fill="#222" stroke="#3a3a3a" />
      <circle cx="118" cy="75" r="2.5" fill="#222" stroke="#3a3a3a" />
      <text x="145" y="50" textAnchor="middle" fill="#666" fontSize="18">?</text>
    </svg>
  );
}

export function CommunityIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <ellipse cx="100" cy="145" rx="60" ry="8" fill="#2e2e2e" />
      <circle cx="70" cy="70" r="16" fill="#ffd166" stroke="#121212" strokeWidth="2" />
      <circle cx="100" cy="60" r="18" fill="#ff6b35" stroke="#121212" strokeWidth="2" />
      <circle cx="130" cy="70" r="16" fill="#06d6a0" stroke="#121212" strokeWidth="2" />
      <path d="M70 86 L70 115 M100 78 L100 120 M130 86 L130 115" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ScoutIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <ellipse cx="100" cy="145" rx="55" ry="8" fill="#2e2e2e" />
      <circle cx="100" cy="55" r="20" fill="#4cc9f0" stroke="#121212" strokeWidth="2" />
      <path d="M100 75 L100 110" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 90 L130 75 M100 90 L70 75" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
      {/* Magnifying glass */}
      <circle cx="145" cy="95" r="18" fill="none" stroke="#ffd166" strokeWidth="4" />
      <path d="M158 108 L175 125" stroke="#ffd166" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
