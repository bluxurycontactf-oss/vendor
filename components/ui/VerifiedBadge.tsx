interface Props {
  plan: 'premium' | 'business';
  size?: number;
  className?: string;
}

export default function VerifiedBadge({ plan, size = 18, className = '' }: Props) {
  const isBusiness = plan === 'business';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label={isBusiness ? 'Certifié Business' : 'Compte vérifié'}
    >
      {/* Outer circle */}
      <circle
        cx="12"
        cy="12"
        r="12"
        fill={isBusiness ? 'url(#gold)' : '#1877F2'}
      />

      {/* Checkmark */}
      <path
        d="M6.5 12.5L10 16L17.5 8.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gold gradient def for business */}
      {isBusiness && (
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5A623" />
            <stop offset="100%" stopColor="#E8750A" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
