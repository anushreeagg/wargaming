'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundKey, AmbienceKey } from '@/lib/game/types';
import { soundEngine } from '@/lib/audio/soundEngine';

interface BackgroundSceneProps {
  background: BackgroundKey;
  ambience?: AmbienceKey;
  children: React.ReactNode;
}

const BG_LABELS: Record<BackgroundKey, string> = {
  mansion_dawn: 'Executive Mansion — Before Breakfast',
  desk_morning: 'Your Desk — Morning',
  war_room: 'War Room — Midmorning',
  state_dept: 'State Department Anteroom — Early Afternoon',
  desk_afternoon: 'Your Desk — Late Afternoon',
  corridor_evening: 'Executive Mansion Corridor — Evening',
  library_night: 'Executive Mansion Library — Night',
  memo_desk: 'Your Desk — Near Midnight',
};

// ── SCENE ILLUSTRATIONS ────────────────────────────────────────────────────────

function MansionDawn() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dawn_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0c29" />
          <stop offset="35%" stopColor="#1a1040" />
          <stop offset="65%" stopColor="#4a2060" />
          <stop offset="85%" stopColor="#9b3a2a" />
          <stop offset="100%" stopColor="#d4754a" />
        </linearGradient>
        <linearGradient id="dawn_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a0f" />
          <stop offset="100%" stopColor="#0d0d08" />
        </linearGradient>
        <radialGradient id="dawn_sun" cx="50%" cy="88%" r="20%">
          <stop offset="0%" stopColor="#ffaa44" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#9b3a2a" stopOpacity="0" />
        </radialGradient>
        <filter id="glow_soft">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sky */}
      <rect width="1200" height="800" fill="url(#dawn_sky)" />
      {/* Dawn glow on horizon */}
      <ellipse cx="600" cy="700" rx="500" ry="200" fill="url(#dawn_sun)" />

      {/* Stars — fixed values to avoid SSR hydration mismatch */}
      {[
        [80,60,1.1,0.85],[200,30,0.7,0.95],[350,80,1.4,0.7],[480,25,0.8,0.9],[620,55,1.2,0.75],
        [750,20,0.6,1.0],[900,45,1.3,0.8],[1050,70,0.9,0.85],[1120,35,1.0,0.7],
        [150,120,0.8,0.65],[420,100,1.1,0.9],[680,90,0.7,0.75],[980,110,1.3,0.8],
        [1100,130,0.9,0.7],[55,160,1.0,0.6],[300,140,0.8,0.85],[830,155,1.2,0.65],
      ].map(([x,y,r,op],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={op} />
      ))}

      {/* Ground / lawn */}
      <rect y="680" width="1200" height="120" fill="url(#dawn_ground)" />
      <ellipse cx="600" cy="685" rx="700" ry="30" fill="#1f2a10" opacity="0.8" />

      {/* Trees — left */}
      <ellipse cx="120" cy="560" rx="90" ry="160" fill="#0a120a" />
      <rect x="108" y="680" width="24" height="60" fill="#06090a" />
      <ellipse cx="240" cy="600" rx="65" ry="120" fill="#0b150b" />
      <rect x="230" y="680" width="18" height="50" fill="#06090a" />

      {/* Trees — right */}
      <ellipse cx="1080" cy="560" rx="90" ry="160" fill="#0a120a" />
      <rect x="1068" y="680" width="24" height="60" fill="#06090a" />
      <ellipse cx="960" cy="600" rx="65" ry="120" fill="#0b150b" />
      <rect x="950" y="680" width="18" height="50" fill="#06090a" />

      {/* Gravel path */}
      <path d="M480,800 L520,680 L680,680 L720,800 Z" fill="#2a2a1f" opacity="0.6" />

      {/* Executive Mansion — body */}
      <rect x="320" y="380" width="560" height="310" fill="#f5f0e8" opacity="0.92" />
      {/* Shadow/depth */}
      <rect x="320" y="380" width="560" height="310" fill="black" opacity="0.35" />

      {/* Colonnaded portico */}
      {[375, 430, 485, 540, 595, 650, 705, 760].map((x, i) => (
        <rect key={i} x={x} y="410" width="18" height="270" fill="#e8e0d0" opacity="0.85" />
      ))}

      {/* Portico pediment */}
      <polygon points="350,410 850,410 840,370 360,370" fill="#ece4d4" opacity="0.9" />

      {/* Roof */}
      <rect x="310" y="355" width="580" height="28" fill="#d4ccbb" opacity="0.9" />

      {/* Roof balustrade */}
      {Array.from({length: 24}).map((_,i) => (
        <rect key={i} x={316 + i * 24} y="325" width="8" height="32" fill="#ccc4b4" opacity="0.7" />
      ))}

      {/* American flag */}
      <line x1="600" y1="280" x2="600" y2="330" stroke="#888" strokeWidth="2" />
      <rect x="600" y="280" width="40" height="25" fill="#b22234" opacity="0.8" />
      {[0,4,8,12,16,20].map(i => (
        <rect key={i} x="600" y={280 + i} width="40" height="2" fill="white" opacity="0.9" />
      ))}

      {/* Windows */}
      {[370, 460, 550, 640, 730, 820].map((x, i) => (
        <g key={i}>
          <rect x={x} y="450" width="38" height="55" fill="#c9a84c" opacity="0.15" />
          <rect x={x} y="450" width="38" height="55" fill="#ffcc44" opacity="0.08" />
          <line x1={x+19} y1="450" x2={x+19} y2="505" stroke="#7a6030" strokeWidth="1" opacity="0.5" />
          <line x1={x} y1="477" x2={x+38} y2="477" stroke="#7a6030" strokeWidth="1" opacity="0.5" />
        </g>
      ))}

      {/* Gas lamp posts */}
      <line x1="420" y1="660" x2="420" y2="760" stroke="#4a3a20" strokeWidth="4" />
      <circle cx="420" cy="648" r="12" fill="#c9a84c" opacity="0.3" />
      <circle cx="420" cy="648" r="7" fill="#ffcc44" opacity="0.6" />
      <ellipse cx="420" cy="670" rx="40" ry="20" fill="#ffcc44" opacity="0.06" />

      <line x1="780" y1="660" x2="780" y2="760" stroke="#4a3a20" strokeWidth="4" />
      <circle cx="780" cy="648" r="12" fill="#c9a84c" opacity="0.3" />
      <circle cx="780" cy="648" r="7" fill="#ffcc44" opacity="0.6" />
      <ellipse cx="780" cy="670" rx="40" ry="20" fill="#ffcc44" opacity="0.06" />

      {/* Foreground ground shadow */}
      <rect y="750" width="1200" height="50" fill="black" opacity="0.4" />
    </svg>
  );
}

function DeskScene({ timeOfDay }: { timeOfDay: 'morning' | 'afternoon' | 'midnight' }) {
  const windowLight = timeOfDay === 'morning' ? '#fff9e6' : timeOfDay === 'afternoon' ? '#ffd580' : '#0a0a1a';
  const ambientTint = timeOfDay === 'morning' ? '#3a2a0a' : timeOfDay === 'afternoon' ? '#4a2a08' : '#0a0810';

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="desk_room" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ambientTint} />
          <stop offset="100%" stopColor="#050303" />
        </linearGradient>
        <radialGradient id="lamp_glow" cx="50%" cy="60%" r="40%">
          <stop offset="0%" stopColor="#ffcc44" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffcc44" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="window_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={windowLight} stopOpacity="0.7" />
          <stop offset="100%" stopColor={windowLight} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Room background */}
      <rect width="1200" height="800" fill="url(#desk_room)" />

      {/* Wood panel wall */}
      {Array.from({length: 8}).map((_,i) => (
        <rect key={i} x={i*150} y="0" width="148" height="500" fill="#2a1a08" opacity={0.3 + i%2 * 0.05} stroke="#3a2510" strokeWidth="1" />
      ))}

      {/* Crown molding */}
      <rect y="490" width="1200" height="12" fill="#4a3018" />
      <rect y="499" width="1200" height="4" fill="#3a2410" />

      {/* Window — center */}
      <rect x="490" y="60" width="220" height="380" fill={windowLight} opacity={timeOfDay === 'midnight' ? 0.05 : 0.15} />
      <rect x="490" y="60" width="220" height="380" fill="url(#window_glow)" />
      {/* Window frame */}
      <rect x="485" y="55" width="230" height="390" fill="none" stroke="#5a3a18" strokeWidth="8" />
      {/* Window panes */}
      <line x1="600" y1="55" x2="600" y2="445" stroke="#5a3a18" strokeWidth="4" />
      <line x1="485" y1="230" x2="715" y2="230" stroke="#5a3a18" strokeWidth="4" />
      {/* Window sill */}
      <rect x="480" y="440" width="240" height="14" fill="#5a3a18" />

      {/* Curtains */}
      <path d="M485,55 Q460,150 470,440" fill="#3a2418" opacity="0.9" />
      <path d="M715,55 Q740,150 730,440" fill="#3a2418" opacity="0.9" />
      <path d="M485,55 Q470,100 478,160 Q468,220 472,300 Q465,380 470,440 L485,440 Z" fill="#4a3020" opacity="0.7" />
      <path d="M715,55 Q730,100 722,160 Q732,220 728,300 Q735,380 730,440 L715,440 Z" fill="#4a3020" opacity="0.7" />

      {/* Bookshelf — left */}
      <rect x="0" y="100" width="200" height="410" fill="#241508" />
      {[110,190,270,350,430].map((y,i) => (
        <g key={i}>
          <rect x="5" y={y} width="190" height="70" fill="#1e1208" />
          {[10,35,55,75,100,120,145,165].map((x,j) => (
            <rect key={j} x={x} y={y+5} width={15+j%3*5} height="60"
              fill={['#8b1a1a','#1a3a8b','#1a8b3a','#8b6a1a','#5a1a8b'][j%5]}
              opacity="0.6" />
          ))}
        </g>
      ))}
      <rect x="0" y="100" width="200" height="8" fill="#4a3018" />
      <rect x="0" y="505" width="200" height="8" fill="#4a3018" />

      {/* Bookshelf — right */}
      <rect x="1000" y="100" width="200" height="410" fill="#241508" />
      {[110,190,270,350,430].map((y,i) => (
        <g key={i}>
          <rect x="1005" y={y} width="190" height="70" fill="#1e1208" />
          {[1010,1035,1055,1080,1105,1125,1150,1170].map((x,j) => (
            <rect key={j} x={x} y={y+5} width={15+j%3*5} height="60"
              fill={['#8b1a1a','#1a3a8b','#3a6b2a','#8b6a1a','#5a1a8b'][(j+2)%5]}
              opacity="0.6" />
          ))}
        </g>
      ))}

      {/* Desk surface */}
      <rect x="200" y="510" width="800" height="180" fill="#3a2010" />
      <rect x="200" y="510" width="800" height="12" fill="#5a3a18" />
      {/* Desk surface grain */}
      {Array.from({length: 12}).map((_,i) => (
        <line key={i} x1="200" y1={518 + i*14} x2="1000" y2={518 + i*14} stroke="#4a2c14" strokeWidth="1" opacity="0.3" />
      ))}

      {/* Desk lamp */}
      <line x1="750" y1="430" x2="750" y2="515" stroke="#6a5030" strokeWidth="6" />
      <ellipse cx="750" cy="425" rx="45" ry="20" fill="#8a6a30" />
      <ellipse cx="750" cy="425" rx="43" ry="18" fill="#3a2808" />
      <circle cx="750" cy="430" r="8" fill="#ffee88" opacity={timeOfDay === 'midnight' ? 0.9 : 0.7} />
      <ellipse cx="750" cy="510" rx="80" ry="30" fill="#ffcc44" opacity={timeOfDay === 'midnight' ? 0.2 : 0.1} />
      <rect width="1200" height="800" fill="url(#lamp_glow)" />

      {/* Papers on desk */}
      <rect x="320" y="505" width="180" height="130" fill="#f5edd0" opacity="0.9" transform="rotate(-3 320 505)" />
      <rect x="340" y="505" width="180" height="130" fill="#f0e6c4" opacity="0.8" transform="rotate(1 340 505)" />
      {/* Text lines on paper */}
      {[520,534,548,562,576,590].map((y,i) => (
        <line key={i} x1="348" y1={y} x2={[430,460,420,440,450,415][i]??440} y2={y} stroke="#5a4020" strokeWidth="1.5" opacity="0.4" />
      ))}

      {/* Inkwell */}
      <ellipse cx="560" cy="516" rx="18" ry="10" fill="#1a1a2a" />
      <rect x="542" y="496" width="36" height="22" rx="4" fill="#1a1218" />
      <ellipse cx="560" cy="496" rx="18" ry="6" fill="#2a1a22" />

      {/* Quill */}
      <path d="M570 490 Q590 460 620 430 Q630 420 635 415" stroke="#f0e8d0" strokeWidth="2" fill="none" />
      <path d="M570 490 Q580 475 590 455" stroke="#e8e0c8" strokeWidth="3" fill="none" opacity="0.7" />

      {/* Telegram/document rolled */}
      <rect x="650" y="508" width="140" height="110" rx="3" fill="#e8dcc0" opacity="0.85" transform="rotate(5 650 508)" />
      {/* Red wax seal impression */}
      <circle cx="720" cy="570" r="14" fill="#8b1a1a" opacity="0.7" />
      <circle cx="720" cy="570" r="10" fill="#a02020" opacity="0.5" />

      {/* Coffee/tea cup */}
      <ellipse cx="850" cy="514" rx="24" ry="12" fill="#3a2010" />
      <path d="M826,514 Q826,545 850,545 Q874,545 874,514" fill="#2a1808" />
      <ellipse cx="850" cy="514" rx="24" ry="12" fill="#1a0c04" opacity="0.8" />
      <path d="M874,520 Q890,520 890,530 Q890,540 874,538" fill="none" stroke="#3a2010" strokeWidth="3" />

      {/* Floor */}
      <rect y="690" width="1200" height="110" fill="#1a0e06" />
      {Array.from({length: 8}).map((_,i) => (
        <rect key={i} x={i*150} y="690" width="148" height="110" fill="#1e1208" opacity={0.5+i%2*0.1} stroke="#2a1808" strokeWidth="1" />
      ))}
    </svg>
  );
}

function WarRoom() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wr_bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0808" />
          <stop offset="100%" stopColor="#080505" />
        </linearGradient>
        <radialGradient id="table_lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcc44" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffcc44" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#wr_bg)" />

      {/* Stone/plaster walls */}
      {Array.from({length: 10}).map((_,i) => (
        <rect key={i} x={i*120} y="0" width="118" height="520" fill="#1a1010" opacity={0.4+i%3*0.05} stroke="#220e0e" strokeWidth="1" />
      ))}

      {/* Large map on wall — center */}
      <rect x="250" y="30" width="700" height="420" fill="#c4a870" opacity="0.85" />
      {/* Map detail: Pacific coastlines */}
      <path d="M280,120 Q350,100 400,140 Q450,180 520,160 Q580,140 620,170 Q660,200 700,180 Q750,155 800,170 Q850,190 900,165 Q920,155 930,180" stroke="#7a5a20" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Philippines archipelago sketch */}
      <ellipse cx="780" cy="220" rx="25" ry="60" fill="#8b6a20" opacity="0.5" />
      <ellipse cx="800" cy="280" rx="20" ry="40" fill="#8b6a20" opacity="0.4" />
      <ellipse cx="790" cy="340" rx="30" ry="50" fill="#8b6a20" opacity="0.45" />
      {/* Red marking lines */}
      <line x1="600" y1="250" x2="780" y2="220" stroke="#8b1a1a" strokeWidth="2" strokeDasharray="6,3" opacity="0.7" />
      <circle cx="600" cy="250" r="6" fill="#8b1a1a" opacity="0.8" />
      <circle cx="780" cy="220" r="6" fill="#8b1a1a" opacity="0.8" />
      {/* Map labels */}
      <text x="500" y="250" fill="#5a4010" fontSize="14" fontFamily="serif" opacity="0.7">Pacific Ocean</text>
      <text x="760" y="215" fill="#5a4010" fontSize="11" fontFamily="serif" opacity="0.8">Manila</text>
      <text x="550" y="250" fill="#8b1a1a" fontSize="10" fontFamily="serif" opacity="0.7">Dewey's position</text>
      {/* Map frame */}
      <rect x="250" y="30" width="700" height="420" fill="none" stroke="#8b6a20" strokeWidth="6" />
      <rect x="256" y="36" width="688" height="408" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.5" />

      {/* Secondary map right wall */}
      <rect x="1000" y="80" width="180" height="260" fill="#b8a068" opacity="0.6" />
      <text x="1020" y="160" fill="#5a4010" fontSize="10" fontFamily="serif" opacity="0.7">North America</text>
      <rect x="1000" y="80" width="180" height="260" fill="none" stroke="#8b6a20" strokeWidth="4" />

      {/* Conference table */}
      <ellipse cx="600" cy="640" rx="450" ry="100" fill="#3a2010" />
      <ellipse cx="600" cy="635" rx="448" ry="98" fill="#4a2a14" />
      {/* Table surface reflection */}
      <ellipse cx="600" cy="625" rx="400" ry="70" fill="#5a3a1c" opacity="0.5" />
      <rect width="1200" height="800" fill="url(#table_lamp)" />

      {/* Hanging lamps above table */}
      {[400, 600, 800].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="0" x2={x} y2="350" stroke="#6a5030" strokeWidth="3" />
          <ellipse cx={x} cy="355" rx="30" ry="14" fill="#8a6a30" />
          <ellipse cx={x} cy="355" rx="28" ry="12" fill="#2a1808" />
          <circle cx={x} cy="360" r="6" fill="#fffacc" opacity="0.9" />
          <ellipse cx={x} cy="450" rx="120" ry="60" fill="#ffcc44" opacity="0.1" />
        </g>
      ))}

      {/* People silhouettes around table */}
      {[200, 370, 830, 1000].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="555" rx="22" ry="28" fill="#0a0808" />
          <rect x={x-18} y="580" width="36" height="55" fill="#0d0a08" rx="4" />
        </g>
      ))}

      {/* Documents/papers on table */}
      {[480, 560, 640, 720].map((x, i) => (
        <rect key={i} x={x} y="545" width="60" height="80" fill="#e8dcc0" opacity="0.7"
          transform={`rotate(${-5+i*4} ${x} ${545})`} />
      ))}

      {/* Globe on side table */}
      <rect x="60" y="500" width="100" height="10" fill="#5a3a18" />
      <line x1="110" y1="510" x2="110" y2="480" stroke="#6a4a20" strokeWidth="4" />
      <circle cx="110" cy="445" r="35" fill="#1a3a5a" opacity="0.8" />
      <circle cx="110" cy="445" r="35" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.6" />
      {/* Globe meridians */}
      <ellipse cx="110" cy="445" rx="35" ry="12" fill="none" stroke="#4a6a3a" strokeWidth="1" opacity="0.5" />
      <line x1="110" y1="410" x2="110" y2="480" stroke="#4a6a3a" strokeWidth="1" opacity="0.4" />

      {/* Floor */}
      <rect y="720" width="1200" height="80" fill="#0d0808" />
    </svg>
  );
}

function StateDept() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sd_bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1f2e" />
          <stop offset="60%" stopColor="#12161f" />
          <stop offset="100%" stopColor="#080a0f" />
        </linearGradient>
        <linearGradient id="sd_floor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1510" />
          <stop offset="50%" stopColor="#241c14" />
          <stop offset="100%" stopColor="#1a1510" />
        </linearGradient>
        <radialGradient id="window_light" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#c8d8f0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c8d8f0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#sd_bg)" />
      <rect width="1200" height="800" fill="url(#window_light)" />

      {/* Marble wall — light grey paneling */}
      <rect y="0" width="1200" height="600" fill="#1e2030" opacity="0.8" />

      {/* Columns — grand colonnade */}
      {[120, 300, 500, 700, 900, 1080].map((x, i) => (
        <g key={i}>
          {/* Column shaft */}
          <rect x={x-22} y="80" width="44" height="560" fill="#2a2a3a" />
          <rect x={x-20} y="80" width="40" height="560" fill="#323244" />
          {/* Column fluting */}
          {[-16,-10,-4,2,8,14].map(o => (
            <line key={o} x1={x+o} y1="90" x2={x+o} y2="630" stroke="#2a2a3a" strokeWidth="1" opacity="0.5" />
          ))}
          {/* Capital */}
          <rect x={x-28} y="72" width="56" height="16" fill="#3a3a4e" />
          <rect x={x-32} y="68" width="64" height="8" fill="#44445a" />
          {/* Base */}
          <rect x={x-28} y="636" width="56" height="12" fill="#3a3a4e" />
          <rect x={x-32} y="644" width="64" height="8" fill="#44445a" />
        </g>
      ))}

      {/* Arched windows between columns */}
      {[210, 410, 610, 810].map((x, i) => (
        <g key={i}>
          <rect x={x-50} y="120" width="100" height="280" fill="#c8d8f0" opacity="0.08" />
          <path d={`M${x-50},120 Q${x},60 ${x+50},120`} fill="#c8d8f0" opacity="0.1" />
          {/* Window frame */}
          <rect x={x-52} y="118" width="104" height="285" fill="none" stroke="#3a3a4e" strokeWidth="4" />
          <path d={`M${x-52},118 Q${x},56 ${x+52},118`} fill="none" stroke="#3a3a4e" strokeWidth="4" />
          {/* Light shaft */}
          <path d={`M${x-30},120 L${x-60},600 L${x+60},600 L${x+30},120 Z`}
            fill="white" opacity="0.02" />
        </g>
      ))}

      {/* Entablature / frieze */}
      <rect y="65" width="1200" height="18" fill="#3a3a4e" />
      <rect y="55" width="1200" height="14" fill="#44445a" />

      {/* Wall portraits/paintings */}
      {[175, 550, 950].map((x, i) => (
        <g key={i}>
          <rect x={x-35} y="350" width="70" height="90" fill="#1a1510" />
          <rect x={x-30} y="355" width="60" height="80" fill="#2a2018" opacity="0.8" />
          {/* Portrait figure silhouette */}
          <ellipse cx={x} cy="375" rx="12" ry="14" fill="#3a3028" />
          <rect x={x-10} y="386" width="20" height="35" fill="#3a2820" opacity="0.8" />
          {/* Gold frame */}
          <rect x={x-35} y="350" width="70" height="90" fill="none" stroke="#8b6a20" strokeWidth="3" />
        </g>
      ))}

      {/* Formal chairs along wall */}
      {[220, 380, 820, 980].map((x, i) => (
        <g key={i}>
          <rect x={x-18} y="570" width="36" height="8" fill="#3a2010" />
          <rect x={x-12} y="535" width="24" height="40" fill="#2a1808" />
          <path d={`M${x-18},570 L${x-22},648 M${x+18},570 L${x+22},648`} stroke="#3a2010" strokeWidth="4" />
          <rect x={x-18} y="648" width="40" height="8" fill="#2a1808" />
        </g>
      ))}

      {/* Marble floor — checkerboard */}
      <rect y="652" width="1200" height="148" fill="url(#sd_floor)" />
      {Array.from({length: 12}).map((_,col) =>
        Array.from({length: 3}).map((_,row) => (
          <rect key={`${col}-${row}`}
            x={col*100} y={652+row*50}
            width="99" height="49"
            fill={((col+row)%2===0) ? '#1e1a12' : '#28221a'}
            opacity="0.8"
          />
        ))
      )}

      {/* Corridor depth — vanishing point perspective lines */}
      <line x1="600" y1="300" x2="0" y2="652" stroke="#3a3a5a" strokeWidth="1" opacity="0.2" />
      <line x1="600" y1="300" x2="1200" y2="652" stroke="#3a3a5a" strokeWidth="1" opacity="0.2" />
      <line x1="600" y1="300" x2="600" y2="652" stroke="#3a3a5a" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}

function CorridorEvening() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="corr_bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#100c08" />
          <stop offset="100%" stopColor="#060404" />
        </linearGradient>
        <radialGradient id="sconce1" cx="20%" cy="45%" r="18%">
          <stop offset="0%" stopColor="#cc8822" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#cc8822" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sconce2" cx="80%" cy="45%" r="18%">
          <stop offset="0%" stopColor="#cc8822" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#cc8822" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vanish_glow" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor="#aa6610" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#aa6610" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#corr_bg)" />
      <rect width="1200" height="800" fill="url(#sconce1)" />
      <rect width="1200" height="800" fill="url(#sconce2)" />
      <rect width="1200" height="800" fill="url(#vanish_glow)" />

      {/* Corridor walls — perspective */}
      {/* Left wall */}
      <polygon points="0,0 350,200 350,700 0,800" fill="#1a1008" />
      {/* Right wall */}
      <polygon points="1200,0 850,200 850,700 1200,800" fill="#180e08" />
      {/* Ceiling */}
      <polygon points="0,0 350,200 850,200 1200,0" fill="#120a06" />
      {/* Floor */}
      <polygon points="0,800 350,700 850,700 1200,800" fill="#0d0804" />

      {/* Persian rug runner */}
      <polygon points="350,700 850,700 790,780 410,780" fill="#5a1a0a" opacity="0.9" />
      {/* Rug pattern */}
      <polygon points="380,720 820,720 770,760 430,760" fill="#8b2010" opacity="0.5" />
      <polygon points="410,730 790,730 760,750 440,750" fill="#c9a84c" opacity="0.3" />

      {/* Wall sconces — left */}
      <rect x="230" y="320" width="30" height="50" fill="#4a3010" />
      <polygon points="215,320 245,300 275,320" fill="#5a4018" />
      <ellipse cx="245" cy="316" rx="12" ry="8" fill="#ffcc44" opacity="0.5" />
      <circle cx="245" cy="318" r="6" fill="#fffaaa" opacity="0.8" />

      {/* Wall sconces — right */}
      <rect x="940" y="320" width="30" height="50" fill="#4a3010" />
      <polygon points="925,320 955,300 985,320" fill="#5a4018" />
      <ellipse cx="955" cy="316" rx="12" ry="8" fill="#ffcc44" opacity="0.5" />
      <circle cx="955" cy="318" r="6" fill="#fffaaa" opacity="0.8" />

      {/* Receding sconces deeper */}
      {[[430,360,8],[480,370,6],[520,376,4]].map(([x,y,r],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#fffaaa" opacity={0.6-i*0.15} />
          <circle cx={1200-x} cy={y} r={r} fill="#fffaaa" opacity={0.6-i*0.15} />
        </g>
      ))}

      {/* Portrait frames — left wall */}
      {[140, 70].map((y, i) => (
        <g key={i}>
          <rect x="30" y={y+200} width="120" height="160" fill="#1a1008" stroke="#8b6a20" strokeWidth="4" />
          <rect x="35" y={y+205} width="110" height="150" fill="#2a1808" opacity="0.8" />
          <ellipse cx="90" cy={y+255} rx="20" ry="24" fill="#3a2818" />
          <rect x="72" y={y+276} width="36" height="60" fill="#2a1e14" opacity="0.9" />
        </g>
      ))}

      {/* Portrait frames — right wall */}
      {[140, 70].map((y, i) => (
        <g key={i}>
          <rect x="1050" y={y+200} width="120" height="160" fill="#1a1008" stroke="#8b6a20" strokeWidth="4" />
          <rect x="1055" y={y+205} width="110" height="150" fill="#2a1808" opacity="0.8" />
          <ellipse cx="1110" cy={y+255} rx="20" ry="24" fill="#3a2818" />
          <rect x="1092" y={y+276} width="36" height="60" fill="#2a1e14" opacity="0.9" />
        </g>
      ))}

      {/* Wainscoting */}
      <polygon points="0,800 350,700 350,650 0,720" fill="#1e1208" />
      <polygon points="1200,800 850,700 850,650 1200,720" fill="#1c1008" />

      {/* Silhouette figure at end of corridor */}
      <ellipse cx="600" cy="390" rx="14" ry="20" fill="#060404" opacity="0.7" />
      <rect x="587" y="408" width="26" height="50" fill="#060404" opacity="0.6" rx="4" />
    </svg>
  );
}

function LibraryNight() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="lib_bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0806" />
          <stop offset="100%" stopColor="#050303" />
        </linearGradient>
        <radialGradient id="fire_glow" cx="50%" cy="75%" r="35%">
          <stop offset="0%" stopColor="#ff8800" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#cc4400" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#cc4400" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="candle_glow" cx="35%" cy="60%" r="20%">
          <stop offset="0%" stopColor="#ffcc44" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffcc44" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#lib_bg)" />
      <rect width="1200" height="800" fill="url(#fire_glow)" />
      <rect width="1200" height="800" fill="url(#candle_glow)" />

      {/* Bookshelves — full wall left */}
      <rect x="0" y="0" width="280" height="720" fill="#1e1208" />
      {[0,80,160,240,320,400,480,560,640].map((y,i) => (
        <g key={i}>
          <rect x="5" y={y+5} width="270" height="72" fill="#160e06" />
          {[12,38,58,80,105,128,152,175,200,222,248].map((x,j) => (
            <rect key={j} x={x} y={y+8} width={18+j%4*4} height="62"
              fill={['#6b1a1a','#1a2a6b','#1a5a2a','#5a4a10','#3a106b','#8b3a10'][(i+j)%6]}
              opacity="0.55" />
          ))}
          <line x1="5" y1={y+75} x2="275" y2={y+75} stroke="#2a1a08" strokeWidth="3" />
        </g>
      ))}

      {/* Bookshelves — full wall right */}
      <rect x="920" y="0" width="280" height="720" fill="#1e1208" />
      {[0,80,160,240,320,400,480,560,640].map((y,i) => (
        <g key={i}>
          <rect x="925" y={y+5} width="270" height="72" fill="#160e06" />
          {[930,956,978,1000,1025,1048,1072,1095,1120,1142,1168].map((x,j) => (
            <rect key={j} x={x} y={y+8} width={18+j%4*4} height="62"
              fill={['#8b1a1a','#2a1a6b','#2a5a1a','#6a4a10','#4a106b','#9b3a10'][(i*2+j)%6]}
              opacity="0.55" />
          ))}
          <line x1="925" y1={y+75} x2="1195" y2={y+75} stroke="#2a1a08" strokeWidth="3" />
        </g>
      ))}

      {/* Fireplace — center back */}
      <rect x="460" y="480" width="280" height="240" fill="#1a0c06" />
      <rect x="440" y="460" width="320" height="28" fill="#3a2010" />
      <rect x="420" y="445" width="360" height="20" fill="#4a2c14" />
      <rect x="410" y="430" width="380" height="18" fill="#5a3a18" />
      {/* Mantel shelf */}
      <rect x="400" y="420" width="400" height="14" fill="#6a4a20" />
      {/* Firebox */}
      <rect x="480" y="500" width="240" height="200" fill="#0d0604" />
      <path d="M480,700 Q550,600 600,560 Q650,600 720,700 Z" fill="#1a0804" />

      {/* Fire flames */}
      <path d="M530,690 Q545,640 555,600 Q565,630 560,680 Q575,650 580,590 Q590,640 588,685 Q600,630 605,580 Q615,630 612,685 Q625,650 635,610 Q640,650 638,690"
        fill="#ff6600" opacity="0.7" />
      <path d="M540,690 Q552,650 558,615 Q568,645 565,685 Q580,645 583,608 Q592,638 590,682"
        fill="#ffaa00" opacity="0.5" />
      <path d="M560,690 Q568,660 572,630 Q580,650 578,685"
        fill="#ffdd00" opacity="0.4" />
      {/* Fire glow on floor */}
      <ellipse cx="600" cy="700" rx="200" ry="50" fill="#ff6600" opacity="0.08" />

      {/* Mantel decorations */}
      <rect x="445" y="380" width="30" height="45" fill="#2a1a08" />
      <ellipse cx="460" cy="378" rx="15" ry="15" fill="#1a1208" />
      <rect x="720" y="380" width="30" height="45" fill="#2a1a08" />
      <ellipse cx="735" cy="378" rx="15" ry="15" fill="#1a1208" />
      {/* Clock on mantel */}
      <rect x="570" y="390" width="60" height="35" rx="3" fill="#2a1a08" />
      <circle cx="600" cy="404" r="12" fill="#1a1008" />
      <circle cx="600" cy="404" r="11" fill="none" stroke="#8b6a20" strokeWidth="1.5" opacity="0.7" />

      {/* Leather armchair */}
      <rect x="280" y="560" width="140" height="100" rx="8" fill="#3a1808" />
      <rect x="272" y="548" width="156" height="20" rx="6" fill="#4a2010" />
      <rect x="272" y="550" width="16" height="120" rx="6" fill="#3a1808" />
      <rect x="412" y="550" width="16" height="120" rx="6" fill="#3a1808" />
      <rect x="280" y="655" width="140" height="12" fill="#2a1208" />
      {[296,320,340,360,380].map(x => (
        <rect key={x} x={x} y="658" width="12" height="35" fill="#2a1208" />
      ))}
      {/* Seat cushion */}
      <rect x="285" y="568" width="130" height="88" rx="6" fill="#4a2010" />

      {/* Side table with candle */}
      <rect x="430" y="590" width="60" height="10" fill="#3a2010" />
      <line x1="460" y1="600" x2="460" y2="650" stroke="#4a3018" strokeWidth="6" />
      <ellipse cx="460" cy="650" rx="30" ry="10" fill="#3a2010" />
      {/* Candle */}
      <rect x="453" y="560" width="14" height="32" fill="#f0e8d0" />
      <path d="M460 560 Q462 550 460 545 Q458 550 460 560" fill="#ffcc44" opacity="0.8" />
      <circle cx="460" cy="547" r="4" fill="#fffaaa" opacity="0.7" />

      {/* Whiskey glass */}
      <path d="M490,600 L495,590 L510,590 L515,600 Z" fill="#c9a84c" opacity="0.3" />
      <path d="M490,600 Q490,605 502,605 Q514,605 514,600" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.4" />
      <rect x="491" y="598" width="22" height="3" fill="#c9a84c" opacity="0.2" />

      {/* Floor */}
      <rect y="720" width="1200" height="80" fill="#0a0604" />
      {Array.from({length: 10}).map((_,i) => (
        <rect key={i} x={i*120} y="720" width="118" height="80" fill="#0c0806" opacity={0.5+i%2*0.1} stroke="#150e06" strokeWidth="1" />
      ))}

      {/* Window — far back, showing night sky */}
      <rect x="560" y="50" width="80" height="160" fill="#050810" opacity="0.9" />
      <rect x="558" y="48" width="84" height="164" fill="none" stroke="#3a2010" strokeWidth="5" />
      <line x1="600" y1="48" x2="600" y2="212" stroke="#3a2010" strokeWidth="3" />
      <line x1="558" y1="120" x2="642" y2="120" stroke="#3a2010" strokeWidth="3" />
    </svg>
  );
}

const SCENE_COMPONENTS: Record<BackgroundKey, React.ReactNode> = {
  mansion_dawn: <MansionDawn />,
  desk_morning: <DeskScene timeOfDay="morning" />,
  desk_afternoon: <DeskScene timeOfDay="afternoon" />,
  memo_desk: <DeskScene timeOfDay="midnight" />,
  war_room: <WarRoom />,
  state_dept: <StateDept />,
  corridor_evening: <CorridorEvening />,
  library_night: <LibraryNight />,
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function BackgroundScene({ background, ambience, children }: BackgroundSceneProps) {
  const prevAmbienceRef = useRef<AmbienceKey | undefined>(undefined);

  useEffect(() => {
    if (!soundEngine) return;
    if (ambience !== prevAmbienceRef.current) {
      prevAmbienceRef.current = ambience;
      soundEngine.setAmbience(ambience ?? 'silence');
    }
  }, [ambience]);

  const label = BG_LABELS[background] ?? '';
  const isRain = ambience === 'rain_light' || ambience === 'rain_heavy';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={background}
        className="relative w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.4 }}
      >
        {/* Illustrated scene */}
        {SCENE_COMPONENTS[background]}

        {/* Rain overlay */}
        {isRain && (
          <div
            className="absolute inset-0 rain-overlay pointer-events-none"
            style={{ opacity: ambience === 'rain_heavy' ? 0.55 : 0.3 }}
          />
        )}

        {/* Fireplace ambient pulse for library */}
        {background === 'library_night' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0, 0.04, 0, 0.06, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(ellipse at 50% 75%, #ff6600 0%, transparent 60%)' }}
          />
        )}

        {/* Candle flicker for memo_desk */}
        {background === 'memo_desk' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.06, 0.03, 0.08, 0.02, 0.07] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'radial-gradient(ellipse at 50% 60%, #ffcc44 0%, transparent 45%)' }}
          />
        )}

        {/* Cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)' }}
        />

        {/* Top cinematic bar */}
        <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }} />

        {/* Bottom cinematic bar */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />

        {/* Location label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <motion.p
            key={label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[10px] tracking-[0.35em] uppercase text-amber-200 font-sans text-center whitespace-nowrap"
          >
            {label}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-1 h-px bg-amber-700/30 w-full"
          />
        </div>

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
