import React from 'react';

const AuthLogo = ({ size = 64 }: { size?: number }) => (
  <svg 
    height={size} 
    viewBox="0 0 512 512" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="TrackCodex Logo"
  >
    <path 
      d="M256 64L448 256L320 384L128 192L256 64Z" 
      fill="#e6edf3"
    />
    <path 
      d="M256 448L64 256L192 128L384 320L256 448Z" 
      fill="#e6edf3"
      fillOpacity="0.7"
    />
    <path 
      d="M256 160L352 256L256 352L160 256L256 160Z" 
      fill="#0d1117"
    />
  </svg>
);

export default AuthLogo;