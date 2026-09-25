import { useState } from 'react';
import { useApp } from '../context/AppContext';
import IncidentDetailModal from './IncidentDetailModal';

// Campus locations with map coordinates (% of SVG width/height)
const BUILDINGS = [
  { id: 'main-gate', label: 'Main Gate', x: 50, y: 88, w: 60, h: 14 },
  { id: 'admin', label: 'Administrative Block', x: 50, y: 68, w: 65, h: 16 },
  { id: 'lib', label: 'Central lybrary', x: 62, y: 30, w: 52, h: 18 },
  { id: 'eb-ground', label: 'Ground floor EB block', x: 78, y: 55, w: 65, h: 14 },
  { id: 'eb-1st', label: '1st floor EB', x: 78, y: 41, w: 50, h: 12 },
  { id: 'eb-2nd', label: '2nd floor EB', x: 78, y: 27, w: 50, h: 12 },
  { id: 'boys-hostel', label: 'Boys hostel', x: 18, y: 28, w: 50, h: 16 },
  { id: 'girls-hostel', label: 'Girls Hostel', x: 20, y: 52, w: 50, h: 14 },
  { id: 'royal-cafe', label: 'Royal Cafe', x: 46, y: 50, w: 40, h: 14 },
  { id: 'hospital', label: 'Hospital', x: 78, y: 72, w: 44, h: 12 },
  { id: 'labs-5th', label: "5th floor LAB's", x: 82, y: 14, w: 50, h: 12 },
  { id: 'law-block', label: 'Law BLock', x: 32, y: 15, w: 46, h: 14 },
  { id: 'old-law', label: 'Old law block', x: 32, y: 32, w: 46, h: 14 },
  { id: 'commerce', label: 'Commerce Block', x: 20, y: 75, w: 52, h: 13 },
];

const PRIORITY_COLORS = {
  Critical: '#ff3b30',
  High: '#ff8c00',
  Medium: '#ffd60a',
  Low: '#30d158',
};

function MarkerPin({ x, y, priority, type, onClick }) {
  const color = PRIORITY_COLORS[priority] || '#00b4ff';
  return (
    <g
      transform={`translate(${x}%, ${y}%)`}
      className="map-incident-marker"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Pulse ring */}
      {priority === 'Critical' && (
        <circle r="14" fill="none" stroke={color} strokeWidth="2" opacity="0.4">
          <animate attributeName="r" from="10" to="20" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Pin body */}
      <circle r="10" fill={color} opacity="0.9" />
      <circle r="9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#fff">
        {type === 'Medical Emergency' ? '🚑' :
         type === 'Fire/Smoke' ? '🔥' :
         type === 'Electrical Hazard' ? '⚡' :
         type === 'Security Alert' ? '🔒' :
         type === 'Water Leakage' ? '💧' : '⚠'}
      </text>
    </g>
  );
}

export default function CampusMap({ compact = false }) {
  const { incidents } = useApp();
  const [selected, setSelected] = useState(null);

  const vb = '0 0 100 100';

  return (
    <>
      <div className={compact ? 'campus-map-container' : 'map-full'}>
        <svg
          viewBox={vb}
          preserveAspectRatio="xMidYMid meet"
          className="campus-map-svg"
        >
          {/* Background gradient */}
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#071428" />
              <stop offset="100%" stopColor="#030a18" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="100" height="100" fill="url(#bgGrad)" />

          {/* Roads */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0,160,255,0.1)" strokeWidth="0.8" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,160,255,0.1)" strokeWidth="0.8" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(0,160,255,0.06)" strokeWidth="0.5" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(0,160,255,0.06)" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(0,160,255,0.06)" strokeWidth="0.5" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(0,160,255,0.06)" strokeWidth="0.5" />

          {/* Green areas */}
          <ellipse cx="50" cy="50" rx="12" ry="8" fill="rgba(34,197,94,0.08)" />

          {/* Buildings */}
          {BUILDINGS.map((b) => (
            <g key={b.id}>
              <rect
                x={b.x - b.w / 200 * 100}
                y={b.y - b.h / 2}
                width={b.w / 5}
                height={b.h / 5}
                rx="0.8"
                fill="rgba(0,100,200,0.18)"
                stroke="rgba(0,160,255,0.25)"
                strokeWidth="0.4"
              />
              <text
                x={b.x}
                y={b.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="2.2"
                fill="rgba(150,200,255,0.7)"
                fontFamily="Inter, sans-serif"
              >
                {b.label}
              </text>
            </g>
          ))}

          {/* SRM Label */}
          <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
                fontSize="4" fill="rgba(0,180,255,0.15)" fontFamily="Rajdhani, sans-serif" fontWeight="700">
            CAMPUS CARE
          </text>

          {/* North indicator */}
          <text x="96" y="5" textAnchor="middle" fontSize="3" fill="rgba(150,200,255,0.5)">N</text>
          <line x1="96" y1="7" x2="96" y2="11" stroke="rgba(150,200,255,0.5)" strokeWidth="0.5" />
          <polygon points="96,6 95,8 97,8" fill="rgba(150,200,255,0.6)" />

          {/* Incident markers */}
          {incidents.map((inc) => (
            <MarkerPin
              key={inc.id}
              x={inc.mapX}
              y={inc.mapY}
              priority={inc.priority}
              type={inc.type}
              onClick={() => setSelected(inc)}
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="map-legend">
          <div className="map-legend-title">Priority</div>
          {Object.entries(PRIORITY_COLORS).map(([p, c]) => (
            <div key={p} className="map-legend-item">
              <div className="map-legend-dot" style={{ background: c }} />
              {p}
            </div>
          ))}
        </div>

        <div className="map-label-tag">Campus View</div>
      </div>

      {selected && (
        <IncidentDetailModal incident={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
