import React from 'react';

interface CatSpriteProps {
  color: string;
  isDirty?: boolean;
  hasWound?: boolean;
  isHappy?: boolean;
  size?: number;
}

export const CatSprite: React.FC<CatSpriteProps> = ({ 
  color, 
  isDirty = false, 
  hasWound = false, 
  isHappy = false,
  size = 120 
}) => {
  return (
    <div className="cat-sprite-container" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className={`cat-svg ${isHappy ? 'purring' : ''}`}>
        {/* Tail */}
        <path d="M70 80 Q 90 70 80 50" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
        
        {/* Body */}
        <ellipse cx="50" cy="65" rx="35" ry="25" fill={color} />
        
        {/* Head */}
        <circle cx="50" cy="40" r="22" fill={color} />
        
        {/* Ears */}
        <path d="M35 25 L30 10 L45 20 Z" fill={color} />
        <path d="M65 25 L70 10 L55 20 Z" fill={color} />
        
        {/* Eyes */}
        <circle cx="42" cy="38" r="3" fill="#333" />
        <circle cx="58" cy="38" r="3" fill="#333" />
        
        {/* Nose/Mouth */}
        <path d="M48 45 Q 50 48 52 45" stroke="#ff8c94" fill="none" strokeWidth="2" />

        {/* Status Overlays */}
        {isDirty && (
          <g className="dirt-overlay">
            <circle cx="30" cy="60" r="4" fill="#6d4c41" opacity="0.6" />
            <circle cx="70" cy="70" r="3" fill="#6d4c41" opacity="0.6" />
            <circle cx="50" cy="80" r="5" fill="#6d4c41" opacity="0.6" />
          </g>
        )}
        
        {hasWound && (
          <g className="wound-overlay">
            <rect x="55" y="55" width="15" height="6" rx="2" fill="#fff" stroke="#ff5e6c" strokeWidth="1" />
            <line x1="60" y1="55" x2="60" y2="61" stroke="#ff5e6c" strokeWidth="1" />
            <line x1="65" y1="55" x2="65" y2="61" stroke="#ff5e6c" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
};
