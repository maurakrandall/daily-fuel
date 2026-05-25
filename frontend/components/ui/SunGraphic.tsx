"use client";

import React from 'react';

interface SunGraphicProps {
  className?: string;
  size?: number;
  showRays?: boolean;
  glowOpacity?: number;
}

export default function SunGraphic({ 
  className = "", 
  size = 88, 
  showRays = true,
  glowOpacity = 0.45
}: SunGraphicProps) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      <div 
        className="absolute inset-0 rounded-full bg-[#D4AF37] blur-2xl transition-opacity duration-1000"
        style={{ opacity: glowOpacity }}
      ></div>
      
      {/* The sphere */}
      <div 
        className="relative rounded-full shadow-[inset_-8px_-8px_20px_rgba(0,0,0,0.15),0_0_30px_rgba(212,175,55,0.5)]"
        style={{ 
          width: size * 0.65, 
          height: size * 0.65,
          background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FFF0B3 20%, #F4D780 50%, #D4AF37 80%, #B8962E 100%)'
        }}
      ></div>

      {/* Optional rays */}
      {showRays && (
        <div className="absolute inset-0">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div 
              key={deg}
              className="absolute top-1/2 left-1/2"
              style={{ 
                width: Math.max(1, size * 0.015),
                height: size * 0.12,
                background: '#D4AF37',
                opacity: 0.8,
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-${size * 0.45}px)`,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

