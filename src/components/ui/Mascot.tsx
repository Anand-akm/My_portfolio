"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Mascot() {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      className="relative w-64 h-80 md:w-80 md:h-96"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animation: 'float 4s ease-in-out infinite' }}
    >
      <div className="absolute inset-0 rounded-full animate-pulse-slow" />

      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl animate-pulse-slow" />

      <div className="absolute inset-0">
        <svg viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="hoodieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD9B6" />
              <stop offset="100%" stopColor="#E8C4A0" />
            </linearGradient>
            <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF94" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <ellipse
            cx="150"
            cy="320"
            rx="80"
            ry="15"
            fill="rgba(59, 130, 246, 0.2)"
          />

          <path
            d="M90 140 C60 120, 50 180, 60 220 L90 230 L90 140"
            fill="url(#hoodieGradient)"
            className="drop-shadow-lg"
          />
          <path
            d="M210 140 C240 120, 250 180, 240 220 L210 230 L210 140"
            fill="url(#hoodieGradient)"
            className="drop-shadow-lg"
          />

          <path d="M100 150 C100 90, 200 90, 200 150 L200 250 C200 280, 100 280, 100 250 Z" fill="url(#hoodieGradient)" className="drop-shadow-lg" />

          <path
            d="M95 250 Q150 270 205 250"
            stroke="url(#neonGlow)"
            strokeWidth="3"
            fill="none"
            filter="url(#strongGlow)"
            opacity="0.7"
          />

          <ellipse cx="150" cy="140" rx="50" ry="50" fill="url(#skinGradient)" />

          <g className="drop-shadow-md">
            <ellipse cx="135" cy="140" rx="8" ry="10" fill="#1a1a2e" />
            <ellipse cx="165" cy="140" rx="8" ry="10" fill="#1a1a2e" />
            {!isBlinking && (
              <>
                <circle cx="135" cy="140" r="4" fill="white" />
                <circle cx="165" cy="140" r="4" fill="white" />
                <circle cx="137" cy="138" r="2" fill="white" opacity="0.8" />
                <circle cx="167" cy="138" r="2" fill="white" opacity="0.8" />
              </>
            )}
          </g>

          <g>
            <rect x="120" y="125" width="35" height="14" rx="3" fill="#1a1a2e" />
            <rect x="122" y="127" width="31" height="10" rx="2" fill="url(#screenGlow)" opacity="0.9" />
            <rect
              x="122"
              y="127"
              width="8"
              height="10"
              rx="1"
              fill="#00FF94"
              opacity="0.8"
            />
            <line
              x1="134"
              y1="130"
              x2="150"
              y2="130"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            <line
              x1="134"
              y1="134"
              x2="148"
              y2="134"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path d="M155 125 L158 128 L155 131" stroke="#00FF94" strokeWidth="1.5" fill="none" opacity="0.8" />
          </g>

          <path d="M140 175 Q150 182, 160 175" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />

          <ellipse cx="125" cy="160" rx="10" ry="6" fill="#FFB6C1" opacity="0.4" />
          <ellipse cx="175" cy="160" rx="10" ry="6" fill="#FFB6C1" opacity="0.4" />

          <path d="M110 130 Q150 100, 190 130" stroke="#2d2d44" strokeWidth="15" fill="none" strokeLinecap="round" />

          <rect
            x="200"
            y="160"
            width="50"
            height="35"
            rx="4"
            fill="#1a1a2e"
            filter="url(#glow)"
          />
          <rect x="204" y="164" width="42" height="27" rx="2" fill="url(#screenGlow)" opacity="0.8" />
          <text
            x="210"
            y="178"
            fill="white"
            fontSize="6"
            fontFamily="monospace"
            opacity="0.9"
          >
            const AI = true;
          </text>

          <path d="M50 200 L30 220 L50 240 L40 200 Z" fill="url(#screenGlow)" opacity="0.6" filter="url(#glow)" />

          <circle
            cx="250"
            cy="180"
            r="15"
            fill="#8B5CF6"
            opacity="0.3"
            filter="url(#glow)"
          />

          <path
            d="M230 250 L250 240 L270 250 L250 260 Z"
            fill="none"
            stroke="url(#screenGlow)"
            strokeWidth="2"
            opacity="0.6"
          />

          <ellipse cx="260" cy="290" rx="15" ry="12" fill="url(#skinGradient)" />
          <ellipse cx="260" cy="295" rx="5" ry="3" fill="url(#hoodieGradient)" />

          <circle
            cx="40"
            cy="180"
            r="8"
            fill="url(#neonGlow)"
            opacity="0.6"
            filter="url(#glow)"
          />
          <circle
            cx="260"
            cy="180"
            r="8"
            fill="url(#neonGlow)"
            opacity="0.6"
            filter="url(#glow)"
          />
        </svg>

        <div
          className="absolute top-16 -right-8 md:right-2 text-2xl"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          💻
        </div>

        <div
          className="absolute top-36 -left-6 md:left-2 text-xl"
          style={{ animation: 'float 4s ease-in-out infinite 1s' }}
        >
          ☁️
        </div>

        <div
          className="absolute bottom-24 -right-6 text-lg"
          style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}
        >
          🤖
        </div>
      </div>

      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full text-xs font-mono"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <span className="text-primary">@</span>anandmishra
      </div>

      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full text-xs animate-pulse-slow"
      >
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
        Building AI systems
      </div>

      <TechRing />
    </div>
  );
}

function TechRing() {
  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none animate-spin-slow"
        viewBox="0 0 300 350"
      >
        <circle
          cx="150"
          cy="180"
          r="130"
          fill="none"
          stroke="url(#neonGlow)"
          strokeWidth="1"
          strokeDasharray="8 12"
          opacity="0.3"
        />
      </svg>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 300 350"
        style={{ animation: 'spin 20s linear infinite reverse' }}
      >
        <circle
          cx="150"
          cy="180"
          r="100"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          opacity="0.4"
        />
      </svg>
    </>
  );
}
