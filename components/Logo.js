import * as React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export default function Logo({ size = 64, color = "#6366F1" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Wallet base */}
      <Rect 
        x="4" 
        y="8" 
        width="24" 
        height="16" 
        rx="4" 
        fill={color}
      />
      
      {/* Card slot highlight */}
      <Rect 
        x="4" 
        y="12" 
        width="24" 
        height="3" 
        fill="#1b263b" 
        fillOpacity="0.15"
      />
      
      {/* Growth arrow */}
      <Path
        d="M11 16L16 11L21 16"
        stroke="#1b263b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Coin circle */}
      <Circle
        cx="16"
        cy="18"
        r="2.5"
        fill="#1b263b"
        fillOpacity="0.9"
      />
    </Svg>
  );
}