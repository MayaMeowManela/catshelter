import React from 'react';

interface CatSpriteProps {
  color: string;
  isDirty?: boolean;
  hasWound?: boolean;
  isHappy?: boolean;
  size?: number;
  soapProgress?: number;
  ointmentProgress?: number;
  loveProgress?: number; // New progress state
}

export const CatSprite: React.FC<CatSpriteProps> = ({ 
  color, 
  isDirty = false, 
  hasWound = false, 
  isHappy = false,
  size = 160,
  soapProgress = 0,
  ointmentProgress = 0,
  loveProgress = 0
}) => {
  return (
    <div className="cat-sprite-wrapper" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className={`cat-svg-pro ${isHappy ? 'is-purring' : ''}`}>
        <defs>
          <radialGradient id="bodyGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </radialGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Tail */}
        <path 
          d="M85 95 Q 110 85 95 60" 
          stroke={color} 
          strokeWidth="10" 
          fill="none" 
          strokeLinecap="round" 
          className="cat-tail"
        />
        
        {/* Body */}
        <ellipse cx="60" cy="80" rx="42" ry="30" fill={color} filter="url(#softShadow)" />
        <ellipse cx="60" cy="80" rx="42" ry="30" fill="url(#bodyGradient)" />
        
        {/* Head */}
        <circle cx="60" cy="45" r="26" fill={color} filter="url(#softShadow)" />
        <circle cx="60" cy="45" r="26" fill="url(#bodyGradient)" />
        
        {/* Ears */}
        <path d="M42 30 L32 10 L55 25 Z" fill={color} />
        <path d="M78 30 L88 10 L65 25 Z" fill={color} />
        
        {/* Eyes */}
        <g className="cat-eyes">
          <circle cx="50" cy="42" r="5" fill="white" />
          <circle cx="50" cy="42" r="3" fill="#333" />
          <circle cx="49" cy="41" r="1" fill="white" />
          
          <circle cx="70" cy="42" r="5" fill="white" />
          <circle cx="70" cy="42" r="3" fill="#333" />
          <circle cx="69" cy="41" r="1" fill="white" />
        </g>
        
        {/* Nose & Mouth */}
        <path d="M57 52 Q 60 55 63 52" stroke="#ff8c94" fill="none" strokeWidth="2.5" strokeLinecap="round" />

        {/* --- DIRT LAYER --- */}
        {isDirty && (
          <g className="dirt-layer" opacity={1 - soapProgress / 100}>
            <circle cx="35" cy="85" r="6" fill="#795548" opacity="0.4" />
            <circle cx="85" cy="75" r="4" fill="#5D4037" opacity="0.5" />
          </g>
        )}
        
        {/* --- SOAP / BUBBLE EFFECT --- */}
        {soapProgress > 0 && soapProgress < 100 && (
          <g className="bubble-particles">
            <circle cx="45" cy="80" r="4" fill="white" opacity="0.8">
              <animate attributeName="cy" from="80" to="60" dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="0.8s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* --- WOUND & OINTMENT LAYER --- */}
        {hasWound && (
          <g className="wound-layer">
            <path d="M70 70 Q 80 75 75 85" stroke="#e91e63" strokeWidth="4" fill="none" opacity={1 - ointmentProgress / 100} />
            {ointmentProgress > 0 && (
              <path d="M70 70 Q 80 75 75 85" stroke="white" strokeWidth="6" fill="none" opacity={ointmentProgress / 100 * 0.8} />
            )}
            {ointmentProgress >= 95 && (
              <rect x="68" y="72" width="18" height="10" rx="3" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="1" transform="rotate(20 77 77)" />
            )}
          </g>
        )}

        {/* --- LOVE / HEART PARTICLES --- */}
        {loveProgress > 0 && loveProgress < 100 && (
          <g className="love-particles">
            <path d="M40 30 Q 40 25 45 25 T 50 30 T 45 35 T 40 30" fill="#ff5e6c" opacity="0.8">
              <animate attributeName="cy" from="30" to="10" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
            </path>
            <text x="30" y="40" fontSize="12" fill="#ff5e6c" opacity="0.7">❤️
              <animate attributeName="y" from="40" to="20" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="1.2s" repeatCount="indefinite" />
            </text>
            <text x="80" y="50" fontSize="10" fill="#ff5e6c" opacity="0.6">❤️
              <animate attributeName="y" from="50" to="30" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
            </text>
          </g>
        )}

        {/* Sparkle Effect when Happy */}
        {isHappy && (
          <g className="sparkles">
            <path d="M20 20 L24 24 M20 24 L24 20" stroke="#FFD700" strokeWidth="2" />
            <path d="M100 30 L104 34 M100 34 L104 30" stroke="#FFD700" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
