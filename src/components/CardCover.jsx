// גב החפיסה: צבעי מים כהים עם שמש זהובה. משמש לערבוב, לחלוקה ולקלפים סגורים.
export default function CardCover({ className = '', deck = 'power' }) {
  if (deck === 'shed') return <ShedCover className={className} />;
  const rays = 24;
  return (
    <div className={`cover-face ${className}`}>
      <svg viewBox="0 0 300 420" className="cover-art" aria-hidden="true">
        <defs>
          <radialGradient id="cover-bg" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#4a3a78" />
            <stop offset="60%" stopColor="#2c2552" />
            <stop offset="100%" stopColor="#1d1838" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="300" height="420" rx="22" fill="url(#cover-bg)" />
        <g filter="url(#wc-edge)" opacity="0.16">
          <circle cx="80" cy="90" r="70" fill="#5a7fb8" />
          <circle cx="230" cy="330" r="80" fill="#8a4f8f" />
        </g>
        <rect x="14" y="14" width="272" height="392" rx="14" fill="none" stroke="#e8c26a" strokeWidth="1.6" opacity="0.8" />
        <rect x="21" y="21" width="258" height="378" rx="10" fill="none" stroke="#e8c26a" strokeWidth="0.8" opacity="0.5" />
        <g transform="translate(150 200)">
          {Array.from({ length: rays }).map((_, i) => {
            const a = (i / rays) * Math.PI * 2;
            const long = i % 2 ? 72 : 104;
            return (
              <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * long} y2={Math.sin(a) * long}
                stroke="#e8c26a" strokeWidth={i % 2 ? 1 : 2.2} opacity="0.85" strokeLinecap="round" />
            );
          })}
          <circle r="34" fill="#f1c95c" />
          <circle r="34" fill="none" stroke="#fff3c4" strokeWidth="1.2" />
          <path d="M -11 6 L -10 -22 Q -6 -27 2 -26 Q 11 -25 14 -30 Q 13 -24 11 -20 L 11 6 Z" fill="#2c2552" />
          <ellipse cx="0" cy="6" rx="19" ry="4" fill="#2c2552" />
        </g>
        <text x="150" y="364" textAnchor="middle" fill="#e8c26a" fontSize="19" fontFamily="Fredoka, sans-serif" fontWeight="500">כוחות קסם</text>
      </svg>
    </div>
  );
}

// גב חפיסת השדונים: ירוק־לילה עם אוזניים מחודדות ועיניים זוהרות.
function ShedCover({ className }) {
  return (
    <div className={`cover-face ${className}`}>
      <svg viewBox="0 0 300 420" className="cover-art" aria-hidden="true">
        <defs>
          <radialGradient id="cover-shed" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#2f6b5e" />
            <stop offset="60%" stopColor="#1e4a42" />
            <stop offset="100%" stopColor="#122c28" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="300" height="420" rx="22" fill="url(#cover-shed)" />
        <g filter="url(#wc-edge)" opacity="0.16">
          <circle cx="220" cy="90" r="70" fill="#7fb85a" />
          <circle cx="70" cy="330" r="80" fill="#9a6bb8" />
        </g>
        <rect x="14" y="14" width="272" height="392" rx="14" fill="none" stroke="#e8c26a" strokeWidth="1.6" opacity="0.8" />
        <rect x="21" y="21" width="258" height="378" rx="10" fill="none" stroke="#e8c26a" strokeWidth="0.8" opacity="0.5" />
        <g transform="translate(150 200)">
          <path d="M -40 -10 Q -84 -24 -104 -60 Q -76 -6 -46 10 Z" fill="#e8c26a" opacity="0.9" />
          <path d="M 40 -10 Q 84 -24 104 -60 Q 76 -6 46 10 Z" fill="#e8c26a" opacity="0.9" />
          <ellipse rx="52" ry="46" fill="#e8c26a" />
          <ellipse cx="-18" cy="-6" rx="11" ry="13" fill="#122c28" />
          <ellipse cx="18" cy="-6" rx="11" ry="13" fill="#122c28" />
          <circle cx="-15" cy="-9" r="4" fill="#f6f0c4" />
          <circle cx="21" cy="-9" r="4" fill="#f6f0c4" />
          <path d="M -16 20 Q 0 30 16 20" fill="none" stroke="#122c28" strokeWidth="4" strokeLinecap="round" />
        </g>
        <text x="150" y="364" textAnchor="middle" fill="#e8c26a" fontSize="19" fontFamily="Fredoka, sans-serif" fontWeight="500">שדונים</text>
      </svg>
    </div>
  );
}
