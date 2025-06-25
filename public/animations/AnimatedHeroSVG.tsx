"use client";
import React from "react";

const AnimatedHeroSVG = () => {
  return (
    <svg
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-2xl"
    >
      <defs>
        {/* Enhanced Gradients */}
        <linearGradient id="browserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.85" />
        </linearGradient>
        
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#ffa726" />
        </linearGradient>
        
        <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ecdc4" />
          <stop offset="100%" stopColor="#44a08d" />
        </linearGradient>
        
        <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
        </radialGradient>

        {/* Advanced Filters */}
        <filter id="glassEffect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" />
          <feOffset dx="0" dy="4" result="offset" />
          <feFlood floodColor="#000000" floodOpacity="0.1" />
          <feComposite in2="offset" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="15" floodColor="#000000" floodOpacity="0.1"/>
        </filter>

        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="2"/>
          <feGaussianBlur stdDeviation="4" result="offset-blur"/>
          <feFlood floodColor="#000000" floodOpacity="0.05"/>
          <feComposite in2="offset-blur" operator="in"/>
        </filter>
      </defs>

      {/* Background with Subtle Pattern */}
      <rect width="1200" height="800" fill="url(#glowEffect)" opacity="0.3"/>
      
      {/* Floating Background Elements */}
      <circle cx="100" cy="150" r="80" fill="#667eea" opacity="0.05">
        <animate attributeName="r" values="80;100;80" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="1100" cy="200" r="60" fill="#ff6b6b" opacity="0.05">
        <animate attributeName="r" values="60;80;60" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="900" cy="600" r="120" fill="#4ecdc4" opacity="0.05">
        <animate attributeName="r" values="120;140;120" dur="12s" repeatCount="indefinite" />
      </circle>

      {/* Modern Browser Window */}
      <rect
        x="50"
        y="50"
        width="1100"
        height="700"
        rx="16"
        fill="url(#browserGradient)"
        stroke="rgba(148, 163, 184, 0.2)"
        strokeWidth="1"
        filter="url(#dropShadow)"
      />

      {/* Browser Header with Modern Design */}
      <rect x="50" y="50" width="1100" height="60" rx="16" fill="rgba(255, 255, 255, 0.8)" />
      <rect x="50" y="110" width="1100" height="1" fill="rgba(148, 163, 184, 0.2)" />
      
      {/* Enhanced Browser Controls */}
      <g>
        <circle cx="80" cy="80" r="6" fill="#ff5f57">
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="105" cy="80" r="6" fill="#ffbd2e">
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="130" cy="80" r="6" fill="#28cd41">
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Modern URL Bar */}
      <rect x="160" y="65" width="500" height="30" rx="15" fill="rgba(241, 245, 249, 0.8)" />
      <text x="170" y="83" fill="#64748b" fontSize="12" fontFamily="system-ui, sans-serif">
        🔒 yoursite.com/landing-pages
      </text>
      
      {/* Action Buttons */}
      <rect x="1000" y="65" width="80" height="30" rx="6" fill="url(#heroGradient)">
        <animate attributeName="opacity" values="1;0.9;1" dur="2s" repeatCount="indefinite" />
      </rect>
      <text x="1040" y="83" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">Publish</text>

      {/* Main Content Area */}
      <rect x="70" y="130" width="1060" height="600" rx="12" fill="rgba(255, 255, 255, 0.6)" filter="url(#innerShadow)" />

      {/* Hero Section with Dynamic Content */}
      <rect x="100" y="160" width="1000" height="120" rx="12" fill="url(#heroGradient)" opacity="0.1" />
      <rect x="120" y="180" width="0" height="80" rx="8" fill="url(#heroGradient)" opacity="0.8">
        <animate attributeName="width" values="0;960;0" dur="8s" repeatCount="indefinite" />
      </rect>
      
      {/* Animated Text Placeholder */}
      <rect x="130" y="200" width="300" height="15" rx="3" fill="#667eea" opacity="0.3">
        <animate attributeName="width" values="300;600;300" dur="6s" repeatCount="indefinite" />
      </rect>
      <rect x="130" y="225" width="400" height="15" rx="3" fill="#667eea" opacity="0.2">
        <animate attributeName="width" values="400;800;400" dur="7s" repeatCount="indefinite" />
      </rect>

      {/* Enhanced Feature Sections */}
      <g>
        {/* Template Gallery Section */}
        <rect x="100" y="320" width="480" height="380" rx="16" fill="rgba(255, 255, 255, 0.9)" filter="url(#dropShadow)" />
        
        {/* Template Grid Animation */}
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect
                x={130 + (i % 3) * 140}
                y={350 + Math.floor(i / 3) * 100}
                width="120"
                height="80"
                rx="8"
                fill={i % 3 === 0 ? "url(#heroGradient)" : i % 3 === 1 ? "url(#accentGradient)" : "url(#successGradient)"}
                opacity="0.8"
              >
                <animate 
                  attributeName="opacity" 
                  values="0.8;1;0.8" 
                  dur={`${4 + i}s`} 
                  repeatCount="indefinite" 
                />
              </rect>
              <rect
                x={135 + (i % 3) * 140}
                y={355 + Math.floor(i / 3) * 100}
                width="110"
                height="5"
                rx="2"
                fill="rgba(255, 255, 255, 0.9)"
              />
              <rect
                x={135 + (i % 3) * 140}
                y={365 + Math.floor(i / 3) * 100}
                width="80"
                height="3"
                rx="1"
                fill="rgba(255, 255, 255, 0.7)"
              />
            </g>
          ))}
        </g>
        
        {/* Builder Interface Section */}
        <rect x="620" y="320" width="480" height="380" rx="16" fill="rgba(255, 255, 255, 0.9)" filter="url(#dropShadow)" />
        
        {/* Drag & Drop Elements */}
        <rect x="650" y="350" width="420" height="40" rx="8" fill="rgba(102, 126, 234, 0.1)" />
        <text x="860" y="375" textAnchor="middle" fill="#667eea" fontSize="14" fontWeight="600" fontFamily="system-ui, sans-serif">
          Drag components here
        </text>
        
        {/* Form Elements with Better Styling */}
        <rect x="650" y="410" width="200" height="35" rx="6" fill="rgba(241, 245, 249, 0.8)" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="870" y="410" width="200" height="35" rx="6" fill="rgba(241, 245, 249, 0.8)" stroke="#e2e8f0" strokeWidth="1" />
        
        <rect x="650" y="460" width="420" height="80" rx="6" fill="rgba(241, 245, 249, 0.8)" stroke="#e2e8f0" strokeWidth="1">
          <animate attributeName="height" values="80;100;80" dur="8s" repeatCount="indefinite" />
        </rect>
        
        {/* CTA Button with Hover Effect */}
        <rect x="920" y="560" width="150" height="40" rx="20" fill="url(#accentGradient)">
          <animate attributeName="transform" values="scale(1);scale(1.05);scale(1)" dur="3s" repeatCount="indefinite" />
        </rect>
        <text x="995" y="583" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="system-ui, sans-serif">
          Get Started
        </text>
      </g>

      {/* Enhanced Drag & Drop Animation */}
      <g>
        <g>
          <rect x="400" y="280" width="60" height="60" rx="8" fill="url(#heroGradient)" opacity="0.9" filter="url(#dropShadow)" />
          <animateMotion 
            path="M 0 0 L 200 50 L 200 200 L 0 150 Z" 
            dur="12s" 
            repeatCount="indefinite" 
          />
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3s" repeatCount="indefinite" />
        </g>
        
        {/* Component Icon */}
        <g>
          <rect x="415" y="295" width="30" height="4" rx="2" fill="white" />
          <animateMotion 
            path="M 0 0 L 200 50 L 200 200 L 0 150 Z" 
            dur="12s" 
            repeatCount="indefinite" 
          />
        </g>
        <g>
          <rect x="415" y="305" width="20" height="4" rx="2" fill="white" opacity="0.8" />
          <animateMotion 
            path="M 0 0 L 200 50 L 200 200 L 0 150 Z" 
            dur="12s" 
            repeatCount="indefinite" 
          />
        </g>
      </g>

      {/* Live Preview Progress Bar */}
      <rect x="100" y="720" width="1000" height="8" rx="4" fill="rgba(226, 232, 240, 0.5)" />
      <rect x="100" y="720" width="0" height="8" rx="4" fill="url(#successGradient)">
        <animate attributeName="width" values="0;300;600;1000;300;0" dur="10s" repeatCount="indefinite" />
      </rect>

      {/* Enhanced Stats with Icons */}
      <g fontFamily="system-ui, sans-serif">
        <g transform="translate(150, 170)">
          <circle cx="0" cy="0" r="20" fill="url(#heroGradient)" opacity="0.2" />
          <text x="0" y="5" textAnchor="middle" fontSize="16" fill="#667eea">📊</text>
          <text x="0" y="-35" textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500">
            Conversion Rate
          </text>
          <text x="0" y="45" textAnchor="middle" fontSize="20" fill="#667eea" fontWeight="700">
            <animate attributeName="textContent" values="42%;67%;89%;42%" dur="8s" repeatCount="indefinite" />
          </text>
        </g>
        
        <g transform="translate(950, 170)">
          <circle cx="0" cy="0" r="20" fill="url(#accentGradient)" opacity="0.2" />
          <text x="0" y="5" textAnchor="middle" fontSize="16" fill="#ff6b6b">⚡</text>
          <text x="0" y="-35" textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500">
            Load Time
          </text>
          <text x="0" y="45" textAnchor="middle" fontSize="20" fill="#ff6b6b" fontWeight="700">
            <animate attributeName="textContent" values="2.1s;1.8s;1.2s;2.1s" dur="6s" repeatCount="indefinite" />
          </text>
        </g>
      </g>

      {/* Floating Action Elements */}
      <circle cx="1050" cy="150" r="8" fill="url(#heroGradient)" opacity="0.4">
        <animate attributeName="r" values="8;12;8" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cy" values="150;130;150" dur="6s" repeatCount="indefinite" />
      </circle>
      
            <circle cx="150" cy="650" r="12" fill="url(#successGradient)" opacity="0.4">
        <animate attributeName="r" values="12;18;12" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="150;180;150" dur="8s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="550" cy="180" r="6" fill="url(#accentGradient)" opacity="0.5">
        <animate attributeName="r" values="6;10;6" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Mobile Preview Frame */}
      <g transform="translate(850, 450)">
        <rect x="0" y="0" width="120" height="200" rx="15" fill="rgba(255, 255, 255, 0.95)" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" filter="url(#dropShadow)" />
        <rect x="5" y="20" width="110" height="160" rx="8" fill="rgba(102, 126, 234, 0.1)" />
        
        {/* Mobile Content Simulation */}
        <rect x="15" y="30" width="90" height="8" rx="2" fill="url(#heroGradient)" opacity="0.6">
          <animate attributeName="width" values="90;70;90" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect x="15" y="45" width="70" height="6" rx="2" fill="rgba(100, 116, 139, 0.4)" />
        <rect x="15" y="65" width="90" height="40" rx="4" fill="url(#accentGradient)" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect x="15" y="115" width="50" height="20" rx="10" fill="url(#successGradient)" opacity="0.8" />
        
        {/* Mobile Screen Glow */}
        <rect x="5" y="20" width="110" height="160" rx="8" fill="url(#glowEffect)" />
      </g>

      {/* Code Editor Simulation */}
      <g transform="translate(100, 550)">
        <rect x="0" y="0" width="300" height="120" rx="8" fill="rgba(15, 23, 42, 0.95)" />
        <rect x="0" y="0" width="300" height="25" rx="8" fill="rgba(30, 41, 59, 0.9)" />
        
        {/* Code Lines with Syntax Highlighting */}
        <rect x="10" y="35" width="20" height="3" rx="1" fill="#f97316" />
        <rect x="35" y="35" width="80" height="3" rx="1" fill="#06b6d4" />
        <rect x="120" y="35" width="60" height="3" rx="1" fill="#84cc16" />
        
        <rect x="10" y="45" width="30" height="3" rx="1" fill="#8b5cf6" />
        <rect x="45" y="45" width="100" height="3" rx="1" fill="#f59e0b" />
        
        <rect x="10" y="55" width="15" height="3" rx="1" fill="#ef4444" />
        <rect x="30" y="55" width="120" height="3" rx="1" fill="#10b981">
          <animate attributeName="width" values="120;200;120" dur="8s" repeatCount="indefinite" />
        </rect>
        
        {/* Cursor Blink */}
        <rect x="155" y="54" width="2" height="5" fill="#06b6d4">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Performance Metrics Dashboard */}
      <g transform="translate(650, 550)">
        <rect x="0" y="0" width="250" height="120" rx="8" fill="rgba(255, 255, 255, 0.95)" filter="url(#dropShadow)" />
        
        {/* Metric Cards */}
        <rect x="10" y="15" width="70" height="45" rx="4" fill="rgba(16, 185, 129, 0.1)" />
        <text x="45" y="30" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="600" fontFamily="system-ui, sans-serif">Speed</text>
        <text x="45" y="45" textAnchor="middle" fontSize="16" fill="#10b981" fontWeight="700" fontFamily="system-ui, sans-serif">
          <animate attributeName="textContent" values="94;97;99;94" dur="5s" repeatCount="indefinite" />
        </text>
        
        <rect x="90" y="15" width="70" height="45" rx="4" fill="rgba(59, 130, 246, 0.1)" />
        <text x="125" y="30" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600" fontFamily="system-ui, sans-serif">SEO</text>
        <text x="125" y="45" textAnchor="middle" fontSize="16" fill="#3b82f6" fontWeight="700" fontFamily="system-ui, sans-serif">
          <animate attributeName="textContent" values="88;92;96;88" dur="6s" repeatCount="indefinite" />
        </text>
        
        <rect x="170" y="15" width="70" height="45" rx="4" fill="rgba(245, 101, 101, 0.1)" />
        <text x="205" y="30" textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="600" fontFamily="system-ui, sans-serif">Access</text>
        <text x="205" y="45" textAnchor="middle" fontSize="16" fill="#ef4444" fontWeight="700" fontFamily="system-ui, sans-serif">
          <animate attributeName="textContent" values="91;95;98;91" dur="7s" repeatCount="indefinite" />
        </text>
        
        {/* Progress Bars */}
        <rect x="10" y="75" width="230" height="4" rx="2" fill="rgba(226, 232, 240, 0.5)" />
        <rect x="10" y="75" width="0" height="4" rx="2" fill="url(#heroGradient)">
          <animate attributeName="width" values="0;180;230;0" dur="8s" repeatCount="indefinite" />
        </rect>
        
        <rect x="10" y="85" width="230" height="4" rx="2" fill="rgba(226, 232, 240, 0.5)" />
        <rect x="10" y="85" width="0" height="4" rx="2" fill="url(#successGradient)">
          <animate attributeName="width" values="0;150;210;0" dur="9s" repeatCount="indefinite" />
        </rect>
        
        <rect x="10" y="95" width="230" height="4" rx="2" fill="rgba(226, 232, 240, 0.5)" />
        <rect x="10" y="95" width="0" height="4" rx="2" fill="url(#accentGradient)">
          <animate attributeName="width" values="0;200;180;0" dur="7s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Interactive Tooltip */}
      <g transform="translate(500, 120)">
        <rect x="0" y="0" width="120" height="40" rx="8" fill="rgba(15, 23, 42, 0.9)" filter="url(#dropShadow)">
          <animate attributeName="opacity" values="0;1;1;0" dur="8s" repeatCount="indefinite" />
        </rect>
        <polygon points="60,40 65,50 55,50" fill="rgba(15, 23, 42, 0.9)">
          <animate attributeName="opacity" values="0;1;1;0" dur="8s" repeatCount="indefinite" />
        </polygon>
        <text x="60" y="25" textAnchor="middle" fontSize="12" fill="white" fontWeight="500" fontFamily="system-ui, sans-serif">
          <animate attributeName="textContent" values="Building...;Optimizing...;Ready!" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="8s" repeatCount="indefinite" />
        </text>
      </g>

      {/* Sparkle Effects */}
      {[...Array(6)].map((_, i) => (
        <g key={i}>
          <circle 
            cx={200 + i * 150} 
            cy={100 + (i % 2) * 500} 
            r="2" 
            fill="#fbbf24"
            opacity="0"
          >
            <animate 
              attributeName="opacity" 
              values="0;1;0" 
              dur={`${2 + i * 0.5}s`} 
              repeatCount="indefinite" 
              begin={`${i * 0.8}s`}
            />
            <animate 
              attributeName="r" 
              values="0;3;0" 
              dur={`${2 + i * 0.5}s`} 
              repeatCount="indefinite" 
              begin={`${i * 0.8}s`}
            />
          </circle>
        </g>
      ))}

      {/* Connection Lines Animation */}
      <g stroke="url(#heroGradient)" strokeWidth="2" fill="none" opacity="0.3">
        <path d="M 300 400 Q 400 300 500 400">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M 700 300 Q 800 250 900 300">
          <animate attributeName="stroke-dasharray" values="0,80;40,40;80,0;0,80" dur="7s" repeatCount="indefinite" />
        </path>
      </g>

    </svg>
  );
};

export default AnimatedHeroSVG;