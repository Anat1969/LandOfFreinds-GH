// ספריית אביזרים לסצנות. כל אביזר ממוקם ב-x,y, וכל הנפשה מסתובבת סביב נקודת הראשית המקומית שלה.
import { INK } from './Wanderer.jsx';
import { blobPath, makeRandom } from '../lib/prng.js';

// עטיפה להנפשה: ממקמת, ואז מפעילה מחלקת אנימציה סביב (0,0).
export function A({ x = 0, y = 0, c, d, dur, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={c ? `anim ${c}` : undefined} style={{ animationDelay: d, animationDuration: dur }}>
        {children}
      </g>
    </g>
  );
}

const stroke = { stroke: INK, strokeWidth: 1.2, strokeLinejoin: 'round', strokeLinecap: 'round' };

// כתם צבעי מים: מלבן עם קצוות לא סדירים, גרדיאנט וכתמי צבע שקופים. זו המסגרת הכחולה של הקלפים המקוריים.
export function Wash({ uid, x = 34, y = 16, w = 232, h = 262, c1, c2, seed = 1, round = false }) {
  const rnd = makeRandom(seed);
  const blots = Array.from({ length: 5 }, (_, i) => ({
    cx: x + rnd() * w,
    cy: y + rnd() * h * 0.8,
    r: 30 + rnd() * 50,
    seed: seed * 7 + i,
  }));
  return (
    <g filter="url(#wc-edge)">
      <defs>
        <linearGradient id={`wash-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={c2} />
          <stop offset="70%" stopColor={c1} />
          <stop offset="100%" stopColor={c1} stopOpacity="0.85" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          {round ? <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} /> : <rect x={x} y={y} width={w} height={h} />}
        </clipPath>
      </defs>
      {round ? (
        <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={`url(#wash-${uid})`} />
      ) : (
        <rect x={x} y={y} width={w} height={h} fill={`url(#wash-${uid})`} />
      )}
      <g style={{ mixBlendMode: 'multiply' }} clipPath={`url(#clip-${uid})`}>
        {blots.map((b, i) => (
          <path key={i} d={blobPath(b.seed, { cx: b.cx, cy: b.cy, r: b.r, points: 7, wobble: 0.5 })} fill={c2} opacity={0.22} />
        ))}
      </g>
      {!round && <rect x={x} y={y} width={w} height={h} fill="none" stroke={c2} strokeWidth="5" opacity="0.55" />}
    </g>
  );
}

export function Ground({ y = 278, color = '#e9e4d6', x1 = 20, x2 = 280 }) {
  return (
    <g filter="url(#wc-soft)">
      <path d={`M ${x1} ${y} Q 150 ${y - 10} ${x2} ${y} L ${x2} ${y + 22} Q 150 ${y + 30} ${x1} ${y + 22} Z`} fill={color} opacity="0.85" />
    </g>
  );
}

export function Hills({ y = 230, color = '#9cc79a', seed = 3, opacity = 0.75, x1 = 34, x2 = 266 }) {
  const rnd = makeRandom(seed);
  const a = y - 10 - rnd() * 24;
  const b = y - 4 - rnd() * 30;
  return (
    <g filter="url(#wc-soft)">
      <path
        d={`M ${x1} ${y} Q ${x1 + 50} ${a} ${150} ${y - 6} Q ${x2 - 60} ${b} ${x2} ${y - 4} L ${x2} 278 L ${x1} 278 Z`}
        fill={color}
        opacity={opacity}
      />
    </g>
  );
}

export function Snow({ y = 236, x1 = 34, x2 = 266 }) {
  return (
    <g filter="url(#wc-soft)">
      <path d={`M ${x1} ${y} Q 90 ${y - 18} 150 ${y - 4} Q 210 ${y + 6} ${x2} ${y - 10} L ${x2} 278 L ${x1} 278 Z`} fill="#f4f7fb" />
      <path d={`M ${x1} ${y + 18} Q 120 ${y + 4} ${x2} ${y + 14}`} stroke="#b9cfe0" strokeWidth="3" fill="none" opacity="0.7" />
    </g>
  );
}

// שמש זורחת עם קרניים ארוכות, כמו בקלף התקווה של משחק המקור, בציור מקורי.
export function Sun({ x = 150, y = 210, r = 42, rays = 14, color = '#f7cf3d', long = 130, spin = true }) {
  return (
    <g>
      <A x={x} y={y} c={spin ? 'a-spin' : undefined} dur="80s">
        {Array.from({ length: rays }).map((_, i) => {
          const ang = Math.PI + (i / (rays - 1)) * Math.PI;
          const w = i % 2 ? 5 : 9;
          const len = long * (i % 3 === 0 ? 1 : 0.82);
          const ax = Math.cos(ang);
          const ay = Math.sin(ang);
          const px = -ay * w;
          const py = ax * w;
          return (
            <path
              key={i}
              d={`M ${ax * (r + 6) + px} ${ay * (r + 6) + py} L ${ax * len} ${ay * len} L ${ax * (r + 6) - px} ${ay * (r + 6) - py} Z`}
              fill="#6f8fb0"
              opacity="0.38"
            />
          );
        })}
      </A>
      <A x={x} y={y} c="a-pulse" dur="5s">
        <circle r={r + 14} fill={color} opacity="0.25" />
      </A>
      <circle cx={x} cy={y} r={r} fill={color} filter="url(#wc-soft)" />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.45} fill="#fff6c8" opacity="0.5" />
    </g>
  );
}

export function Moon({ x = 220, y = 70, r = 20 }) {
  return (
    <A x={x} y={y} c="a-bob" dur="6s">
      <circle r={r + 10} fill="#fff7d6" opacity="0.35" />
      <path d={`M 0 ${-r} A ${r} ${r} 0 1 0 0 ${r} A ${r * 0.75} ${r} 0 1 1 0 ${-r} Z`} fill="#fbe7a0" stroke={INK} strokeWidth="1" />
    </A>
  );
}

export function Stars({ pts = [], color = '#fff6c4' }) {
  return pts.map(([x, y, s = 1], i) => (
    <A key={i} x={x} y={y} c="a-twinkle" d={`${(i * 0.7) % 3}s`} dur={`${2.4 + (i % 3) * 0.6}s`}>
      <path
        d={`M 0 ${-6 * s} Q ${1 * s} ${-1 * s} ${6 * s} 0 Q ${1 * s} ${1 * s} 0 ${6 * s} Q ${-1 * s} ${1 * s} ${-6 * s} 0 Q ${-1 * s} ${-1 * s} 0 ${-6 * s} Z`}
        fill={color}
        stroke="#d6a93a"
        strokeWidth="0.6"
      />
    </A>
  ));
}

export function Cloud({ x, y, s = 1, d = '0s', color = '#ffffff' }) {
  return (
    <A x={x} y={y} c="a-drift" d={d} dur="9s">
      <g transform={`scale(${s})`} filter="url(#wc-soft)">
        <ellipse cx="0" cy="0" rx="26" ry="11" fill={color} opacity="0.92" />
        <ellipse cx="-12" cy="-7" rx="13" ry="11" fill={color} opacity="0.92" />
        <ellipse cx="9" cy="-10" rx="15" ry="13" fill={color} opacity="0.92" />
      </g>
    </A>
  );
}

export function Water({ y = 230, x1 = 34, x2 = 266, color = '#7fb3d5', depth = 48 }) {
  return (
    <g>
      <g filter="url(#wc-soft)">
        <rect x={x1} y={y} width={x2 - x1} height={depth} fill={color} opacity="0.75" />
        <rect x={x1} y={y} width={x2 - x1} height="5" fill="#fff" opacity="0.45" />
      </g>
      <A x={0} y={0} c="a-ripple" dur="5s">
        {[0, 1, 2, 3].map((row) =>
          Array.from({ length: 7 }).map((_, i) => (
            <path
              key={`${row}-${i}`}
              d={`M ${x1 + 6 + i * 36 + (row % 2) * 16} ${y + 12 + row * 9} q 6 -3 12 0`}
              stroke="#fff"
              strokeWidth="1.6"
              fill="none"
              opacity={0.65 - row * 0.12}
              strokeLinecap="round"
            />
          ))
        )}
      </A>
    </g>
  );
}

export function Tree({ x, y, s = 1, color = '#7fae6a', sway = true, fruit = null }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -6 0 Q -4 -40 -2 -70 L 4 -70 Q 6 -40 8 0 Z" fill="#8a5d3b" {...stroke} />
      <path d="M 0 -50 q -14 -8 -20 -20 M 2 -58 q 12 -6 18 -18" stroke="#8a5d3b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <A x={0} y={-70} c={sway ? 'a-sway' : undefined} dur="6s">
        <g filter="url(#wc-soft)">
          <path d={blobPath(17, { cx: 0, cy: -26, r: 46, points: 9, wobble: 0.35 })} fill={color} opacity="0.92" />
          <path d={blobPath(19, { cx: -12, cy: -38, r: 22, points: 7, wobble: 0.4 })} fill="#fff" opacity="0.18" />
        </g>
        {fruit &&
          fruit.map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r="5" fill="#e0583f" {...stroke} strokeWidth="0.9" />)}
      </A>
    </g>
  );
}

export function Flower({ x, y, s = 1, color = '#f08ca0', center = '#f6c84a', grow = false, d }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <A c={grow ? 'a-grow' : 'a-sway'} d={d} dur={grow ? '4s' : '5s'}>
        <path d="M 0 0 Q -3 -18 0 -34" stroke="#5f9a52" strokeWidth="2.6" fill="none" />
        <path d="M 0 -14 q -12 -4 -14 -12 q 10 0 14 10 Z" fill="#7fb86a" {...stroke} strokeWidth="0.8" />
        <g transform="translate(0 -38)">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-7" rx="5" ry="7.5" fill={color} transform={`rotate(${r})`} {...stroke} strokeWidth="0.8" />
          ))}
          <circle r="4.4" fill={center} {...stroke} strokeWidth="0.8" />
        </g>
      </A>
    </g>
  );
}

export function Sprout({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <A c="a-grow" dur="5s">
        <path d="M 0 0 Q 1 -14 0 -24" stroke="#5f9a52" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M 0 -20 q -14 -2 -16 -14 q 12 0 16 12 Z" fill="#86c06d" {...stroke} strokeWidth="0.9" />
        <path d="M 0 -24 q 12 -6 16 -18 q -14 2 -16 16 Z" fill="#9ccf7f" {...stroke} strokeWidth="0.9" />
      </A>
      <ellipse cx="0" cy="2" rx="16" ry="4" fill="#8a5d3b" opacity="0.55" />
    </g>
  );
}

export function Mountain({ x = 150, y = 278, w = 220, h = 190, color = '#8aa6c4' }) {
  return (
    <g filter="url(#wc-soft)">
      <path d={`M ${x - w / 2} ${y} L ${x - 8} ${y - h} Q ${x} ${y - h - 6} ${x + 8} ${y - h} L ${x + w / 2} ${y} Z`} fill={color} opacity="0.85" />
      <path d={`M ${x - 26} ${y - h + 50} L ${x - 8} ${y - h} Q ${x} ${y - h - 6} ${x + 8} ${y - h} L ${x + 30} ${y - h + 54} Q ${x + 12} ${y - h + 40} ${x} ${y - h + 56} Q ${x - 12} ${y - h + 40} ${x - 26} ${y - h + 50} Z`} fill="#f7f9fc" />
      <path d={`M ${x + 8} ${y - h} L ${x + w / 2} ${y} L ${x + w / 5} ${y}`} fill="#000" opacity="0.08" />
    </g>
  );
}

export function Flag({ x, y, color = '#e2563f' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="0" x2="0" y2="-38" stroke={INK} strokeWidth="1.8" />
      <A x={0} y={-38} c="a-flag" dur="1.6s">
        <path d="M 0 0 Q 10 -3 22 2 Q 14 7 22 12 Q 10 10 0 13 Z" fill={color} {...stroke} strokeWidth="0.9" />
      </A>
    </g>
  );
}

export function Path({ points, color = '#efe1c4', w = 18 }) {
  const d = points.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <g filter="url(#wc-soft)">
      <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#d9c39a" strokeWidth="1.4" strokeDasharray="2 9" fill="none" />
    </g>
  );
}

export function Cliff({ x, y, w = 70, side = 1, color = '#b59a7d' }) {
  return (
    <g filter="url(#wc-soft)">
      <path
        d={`M ${x} ${y} L ${x + w * side} ${y} L ${x + (w + 10) * side} ${y + 110} L ${x - 4 * side} ${y + 110} Z`}
        fill={color}
        opacity="0.9"
      />
      <path d={`M ${x} ${y} L ${x + w * side} ${y} L ${x + w * side} ${y + 8} Q ${x + (w / 2) * side} ${y + 3} ${x} ${y + 8} Z`} fill="#8ebc72" />
    </g>
  );
}

export function RopeBridge({ x1, x2, y }) {
  const n = 9;
  const mid = (x1 + x2) / 2;
  return (
    <g>
      <path d={`M ${x1} ${y - 26} Q ${mid} ${y - 6} ${x2} ${y - 26}`} stroke="#8a5d3b" strokeWidth="1.8" fill="none" />
      <path d={`M ${x1} ${y} Q ${mid} ${y + 18} ${x2} ${y}`} stroke="#8a5d3b" strokeWidth="2" fill="none" />
      {Array.from({ length: n }).map((_, i) => {
        const t = (i + 0.5) / n;
        const bx = x1 + (x2 - x1) * t;
        const by = y + 18 * 4 * t * (1 - t) * 0.5 * 2 * 0.5;
        return <rect key={i} x={bx - 5} y={by - 2} width="10" height="5" rx="1" fill="#c19a6b" {...stroke} strokeWidth="0.8" />;
      })}
    </g>
  );
}

export function Ladder({ x, y, h = 120, lean = 12 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean})`}>
      <line x1="-11" y1="0" x2="-9" y2={-h} stroke="#9a6a40" strokeWidth="4" strokeLinecap="round" />
      <line x1="11" y1="0" x2="9" y2={-h} stroke="#9a6a40" strokeWidth="4" strokeLinecap="round" />
      {Array.from({ length: Math.floor(h / 18) }).map((_, i) => (
        <line key={i} x1="-10" y1={-12 - i * 18} x2="10" y2={-12 - i * 18} stroke="#b27f4e" strokeWidth="3" />
      ))}
    </g>
  );
}

export function Kite({ x, y, to, color = '#e8574a' }) {
  return (
    <g>
      {to && <path d={`M ${x} ${y + 18} Q ${(x + to[0]) / 2 - 20} ${(y + to[1]) / 2 + 30} ${to[0]} ${to[1]}`} stroke={INK} strokeWidth="0.9" fill="none" opacity="0.7" />}
      <A x={x} y={y} c="a-float" dur="4s">
        <path d="M 0 -20 L 14 0 L 0 18 L -14 0 Z" fill={color} {...stroke} />
        <path d="M 0 -20 L 0 18 M -14 0 L 14 0" stroke={INK} strokeWidth="0.8" />
        <path d="M 0 18 q -6 10 0 18 q 6 8 0 16" stroke={INK} strokeWidth="1" fill="none" />
        {[22, 32, 44].map((ty, i) => (
          <path key={i} d={`M 0 ${ty} l -4 -3 l 0 6 Z M 0 ${ty} l 4 -3 l 0 6 Z`} fill={i % 2 ? '#f6c84a' : '#6fb0d8'} />
        ))}
      </A>
    </g>
  );
}

export function Boat({ x, y, s = 1, color = '#c9693f' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -52 -14 Q 0 -8 52 -14 Q 40 10 0 12 Q -40 10 -52 -14 Z" fill={color} {...stroke} />
      <path d="M -46 -9 Q 0 -4 46 -9" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" />
    </g>
  );
}

export function Lantern({ x, y, s = 1, hang = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {hang > 0 && <line x1="0" y1={-hang} x2="0" y2="-14" stroke={INK} strokeWidth="1" />}
      <A c="a-pulse" dur="3.4s">
        <circle r="30" fill="url(#glow-amber)" />
      </A>
      <path d="M -6 -14 L 6 -14 L 4 -18 L -4 -18 Z" fill="#5a4a3a" {...stroke} strokeWidth="0.9" />
      <path d="M -9 -13 Q -11 0 -8 12 L 8 12 Q 11 0 9 -13 Z" fill="#ffd56a" {...stroke} />
      <path d="M -3 -8 Q -4 2 -2 8" stroke="#fff" strokeWidth="1.6" opacity="0.6" fill="none" />
      <rect x="-9" y="12" width="18" height="4" fill="#5a4a3a" {...stroke} strokeWidth="0.9" />
    </g>
  );
}

export function Birds({ list = [], color = INK }) {
  return list.map(([x, y, s = 1], i) => (
    <A key={i} x={x} y={y} c="a-glide" d={`${i * 0.5}s`} dur={`${5 + i}s`}>
      <g transform={`scale(${s})`}>
        <A c="a-flap" d={`${i * 0.2}s`} dur="0.9s">
          <path d="M -9 -2 Q -4 -7 0 0 Q 4 -7 9 -2" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </A>
      </g>
    </A>
  ));
}

export function ColorBird({ x, y, s = 1, color = '#e86b5a', d }) {
  return (
    <A x={x} y={y} c="a-glide" d={d} dur="5s">
      <g transform={`scale(${s})`}>
        <ellipse cx="0" cy="0" rx="9" ry="6" fill={color} {...stroke} strokeWidth="0.9" />
        <circle cx="8" cy="-4" r="4.6" fill={color} {...stroke} strokeWidth="0.9" />
        <path d="M 12 -4 l 5 1 l -5 2 Z" fill="#f2b33d" />
        <circle cx="9" cy="-5" r="0.9" fill={INK} />
        <A x={-1} y={-2} c="a-flap" dur="0.7s">
          <path d="M 0 0 Q -6 -12 -14 -10 Q -8 -2 0 0 Z" fill={color} {...stroke} strokeWidth="0.9" />
        </A>
        <path d="M -9 0 l -7 -3 l 1 6 Z" fill={color} {...stroke} strokeWidth="0.8" />
      </g>
    </A>
  );
}

export function Heart({ x, y, s = 1, color = '#e6566b', c = 'a-pulse' }) {
  return (
    <A x={x} y={y} c={c} dur="2.4s">
      <path
        transform={`scale(${s})`}
        d="M 0 8 C -14 -2 -16 -12 -9 -16 C -4 -19 0 -15 0 -11 C 0 -15 4 -19 9 -16 C 16 -12 14 -2 0 8 Z"
        fill={color}
        {...stroke}
      />
    </A>
  );
}

export function Hourglass({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-18" y="-64" width="36" height="5" rx="2" fill="#9a6a40" {...stroke} />
      <rect x="-18" y="-5" width="36" height="5" rx="2" fill="#9a6a40" {...stroke} />
      <path d="M -13 -59 Q -13 -38 0 -32 Q 13 -38 13 -59 Z M -13 -5 Q -13 -26 0 -32 Q 13 -26 13 -5 Z" fill="#e8f3f8" opacity="0.8" {...stroke} />
      <path d="M -8 -52 Q 0 -44 8 -52 Q 6 -40 0 -35 Q -6 -40 -8 -52 Z" fill="#e9b75a" />
      <path d="M -11 -5 Q 0 -18 11 -5 Z" fill="#e9b75a" />
      <A x={0} y={-33} c="a-sand" dur="1.2s">
        <line x1="0" y1="0" x2="0" y2="16" stroke="#e9b75a" strokeWidth="1.6" strokeDasharray="2 3" />
      </A>
    </g>
  );
}

export function Fence({ x1, x2, y, color = '#c9a57a', gate = false }) {
  const n = Math.floor((x2 - x1) / 14);
  return (
    <g>
      <rect x={x1} y={y - 34} width={x2 - x1} height="5" fill={color} {...stroke} strokeWidth="0.8" />
      <rect x={x1} y={y - 16} width={x2 - x1} height="5" fill={color} {...stroke} strokeWidth="0.8" />
      {Array.from({ length: n + 1 }).map((_, i) => (
        <path key={i} d={`M ${x1 + i * 14 - 4} ${y} L ${x1 + i * 14 - 4} ${y - 40} L ${x1 + i * 14} ${y - 46} L ${x1 + i * 14 + 4} ${y - 40} L ${x1 + i * 14 + 4} ${y} Z`} fill={gate && i > n / 2 - 2 && i < n / 2 + 2 ? '#d8b78a' : color} {...stroke} strokeWidth="0.9" />
      ))}
    </g>
  );
}

export function Balloons({ x, y, to, colors = ['#e6566b', '#f2b33d', '#5fa8d3'] }) {
  return colors.map((col, i) => {
    const bx = x + (i - (colors.length - 1) / 2) * 22;
    const by = y - (i % 2) * 14;
    return (
      <g key={i}>
        <path d={`M ${bx} ${by + 18} Q ${bx + 4} ${(by + to[1]) / 2} ${to[0]} ${to[1]}`} stroke={INK} strokeWidth="0.8" fill="none" opacity="0.7" />
        <A x={bx} y={by} c="a-bob" d={`${i * 0.4}s`} dur="3.6s">
          <ellipse cx="0" cy="0" rx="13" ry="16" fill={col} {...stroke} />
          <ellipse cx="-4" cy="-6" rx="3.4" ry="5" fill="#fff" opacity="0.45" />
          <path d="M -2 16 l 2 4 l 2 -4 Z" fill={col} />
        </A>
      </g>
    );
  });
}

export function HeartBalloon({ x, y, to }) {
  return (
    <g>
      <path d={`M ${x} ${y + 12} Q ${x + 8} ${(y + to[1]) / 2} ${to[0]} ${to[1]}`} stroke={INK} strokeWidth="0.9" fill="none" opacity="0.7" />
      <Heart x={x} y={y} s={2.4} c="a-bob" />
    </g>
  );
}

export function Umbrella({ x, y, s = 1, color = '#e2563f' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -56 0 Q -50 -44 0 -48 Q 50 -44 56 0 Q 47 -8 38 0 Q 28 -9 19 0 Q 9 -9 0 0 Q -9 -9 -19 0 Q -28 -9 -38 0 Q -47 -8 -56 0 Z" fill={color} {...stroke} />
      <path d="M 0 -48 Q -16 -24 -19 0 M 0 -48 Q 16 -24 19 0" stroke={INK} strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M -30 -34 Q -20 -42 -6 -44" stroke="#fff" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
      <line x1="0" y1="-48" x2="0" y2="46" stroke={INK} strokeWidth="1.8" />
      <path d="M 0 46 q 0 6 -6 6 q -5 0 -5 -5" stroke={INK} strokeWidth="1.8" fill="none" />
    </g>
  );
}

export function Rain({ x1 = 40, x2 = 260, y1 = 30, n = 26 }) {
  const rnd = makeRandom(41);
  return Array.from({ length: n }).map((_, i) => (
    <A key={i} x={x1 + rnd() * (x2 - x1)} y={y1 + rnd() * 120} c="a-rain" d={`${rnd() * 1.4}s`} dur="1.4s">
      <line x1="0" y1="0" x2="-3" y2="11" stroke="#6d93b6" strokeWidth="1.5" strokeLinecap="round" />
    </A>
  ));
}

function Wheel({ x, y, r = 24 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="none" stroke={INK} strokeWidth="2.6" />
      <circle r={r - 2.5} fill="none" stroke="#7b7b86" strokeWidth="1" />
      <A c="a-spin" dur="2.4s">
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <line key={i} x1="0" y1="0" x2={Math.cos(a) * (r - 2)} y2={Math.sin(a) * (r - 2)} stroke="#55525e" strokeWidth="0.7" />;
        })}
      </A>
      <circle r="2.6" fill={INK} />
    </g>
  );
}

// אופניים כפולים. נקודות המושב חוזרות כדי להושיב עליהן דמויות.
export function Tandem({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Wheel x={-62} y={-24} />
      <Wheel x={62} y={-24} />
      <path d="M -62 -24 L -30 -58 L 28 -58 L 62 -24 M -30 -58 L -14 -24 L 22 -24 L 28 -58 M -14 -24 L -62 -24 M 22 -24 L 62 -24" stroke="#2f6a8c" strokeWidth="3.6" fill="none" strokeLinejoin="round" />
      <path d="M 28 -58 L 40 -70 M 34 -72 L 48 -68" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M -36 -62 l 14 0" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M 18 -62 l 14 0" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

export function Telescope({ x, y, angle = -32, legs = 42 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M 0 0 L ${-legs / 3} ${legs} M 0 0 L ${legs / 3} ${legs} M 0 0 L 0 ${legs + 2}`} stroke="#7a5a3a" strokeWidth="2.4" strokeLinecap="round" />
      <g transform={`rotate(${angle})`}>
        <rect x="-22" y="-7" width="54" height="14" rx="3" fill="#c48a3c" stroke={INK} strokeWidth="1.2" />
        <rect x="30" y="-9" width="10" height="18" rx="2" fill="#8a5a2a" stroke={INK} strokeWidth="1.2" />
        <rect x="-30" y="-5" width="9" height="10" rx="2" fill="#8a5a2a" stroke={INK} strokeWidth="1.2" />
        <rect x="-4" y="-7" width="4" height="14" fill="#f2c25a" />
      </g>
    </g>
  );
}

export function Book({ x, y, s = 1, color = '#3f7396' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 0 Q -14 -6 -28 -2 L -28 -26 Q -14 -30 0 -24 Q 14 -30 28 -26 L 28 -2 Q 14 -6 0 0 Z" fill="#fbf7ee" {...stroke} />
      <path d="M 0 0 L 0 -24" stroke={INK} strokeWidth="0.9" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} opacity="0.45">
          <line x1="-23" y1={-21 + i * 4.5} x2="-5" y2={-22 + i * 4.5} stroke={INK} strokeWidth="0.7" />
          <line x1="5" y1={-22 + i * 4.5} x2="23" y2={-21 + i * 4.5} stroke={INK} strokeWidth="0.7" />
        </g>
      ))}
      <path d="M -30 0 Q -14 -4 0 2 Q 14 -4 30 0 L 30 3 Q 14 -1 0 5 Q -14 -1 -30 3 Z" fill={color} {...stroke} strokeWidth="0.9" />
    </g>
  );
}

export function BookStack({ x, y }) {
  const books = [['#c45a6a', 52], ['#3f7396', 46], ['#e3a13a', 50], ['#6f9e6a', 42]];
  return (
    <g transform={`translate(${x} ${y})`}>
      {books.map(([col, w], i) => (
        <g key={i}>
          <rect x={-w / 2 + (i % 2) * 3} y={-12 - i * 12} width={w} height="12" rx="2" fill={col} {...stroke} />
          <line x1={-w / 2 + 6} y1={-6 - i * 12} x2={w / 2 - 6} y2={-6 - i * 12} stroke="#fff" opacity="0.35" strokeWidth="1.4" />
        </g>
      ))}
    </g>
  );
}

export function Gift({ x, y, s = 1, color = '#e2563f' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-14" y="-24" width="28" height="24" fill={color} {...stroke} />
      <rect x="-16" y="-30" width="32" height="7" fill={color} {...stroke} />
      <rect x="-3" y="-30" width="6" height="30" fill="#f6d36a" />
      <path d="M 0 -30 q -14 -14 -14 -2 Z M 0 -30 q 14 -14 14 -2 Z" fill="#f6d36a" {...stroke} strokeWidth="0.9" />
    </g>
  );
}

export function Signpost({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3" y="-96" width="6" height="96" fill="#8a5d3b" {...stroke} />
      <A x={0} y={-82} c="a-sway" dur="7s">
        <path d="M 0 -8 L 42 -8 L 52 2 L 42 12 L 0 12 Z" fill="#e8c27a" {...stroke} />
      </A>
      <A x={0} y={-54} c="a-sway" d="1s" dur="7s">
        <path d="M 0 -8 L -42 -8 L -52 2 L -42 12 L 0 12 Z" fill="#a7cf8a" {...stroke} />
      </A>
    </g>
  );
}

export function Easel({ x, y }) {
  const splashes = [['#e6566b', -18, -22, 13], ['#f2b33d', 8, -30, 12], ['#5fa8d3', 14, -6, 14], ['#7fb86a', -8, 0, 11], ['#9a7bd0', -24, -2, 8]];
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -26 0 L -6 -100 M 26 0 L 6 -100 M 0 -100 L 0 -6" stroke="#8a5d3b" strokeWidth="3.4" strokeLinecap="round" />
      <rect x="-40" y="-92" width="80" height="62" fill="#fffdf6" {...stroke} />
      <g transform="translate(0 -60)">
        {splashes.map(([col, sx, sy, r], i) => (
          <A key={i} x={sx} y={sy} c="a-pulse" d={`${i * 0.5}s`} dur="4s">
            <path d={blobPath(30 + i, { cx: 0, cy: 0, r, points: 7, wobble: 0.6 })} fill={col} opacity="0.85" />
          </A>
        ))}
      </g>
      <rect x="-42" y="-32" width="84" height="5" fill="#8a5d3b" {...stroke} strokeWidth="0.9" />
    </g>
  );
}

export function Palette({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={blobPath(51, { cx: 0, cy: 0, r: 14, points: 7, wobble: 0.25 })} fill="#e8c88f" {...stroke} />
      <circle cx="-6" cy="-4" r="2.6" fill="#e6566b" />
      <circle cx="2" cy="-7" r="2.6" fill="#f2b33d" />
      <circle cx="8" cy="-1" r="2.6" fill="#5fa8d3" />
      <circle cx="-2" cy="4" r="2.6" fill="#7fb86a" />
    </g>
  );
}

export function PaperPlane({ x, y, rot = 0, c = 'a-glide', d, color = '#ffffff' }) {
  return (
    <A x={x} y={y} c={c} d={d} dur="5s">
      <g transform={`rotate(${rot})`}>
        <path d="M -16 0 L 18 -10 L -4 6 Z" fill={color} {...stroke} />
        <path d="M -4 6 L 18 -10 L -2 12 Z" fill="#dfe7ef" {...stroke} />
      </g>
    </A>
  );
}

export function Juggle({ x, y }) {
  const balls = [['#e6566b', -26], ['#f2b33d', 0], ['#5fa8d3', 26]];
  return balls.map(([col, bx], i) => (
    <g key={i} transform={`translate(${x + bx} ${y})`}>
      <A c="a-toss" d={`${i * 0.35}s`} dur="1.05s">
        <circle r="7" fill={col} {...stroke} />
        <circle cx="-2" cy="-2" r="2" fill="#fff" opacity="0.5" />
      </A>
    </g>
  ));
}

export function WateringCan({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -14 -16 L 14 -16 L 12 6 L -12 6 Z" fill="#5fa8d3" {...stroke} />
      <path d="M 12 -10 L 34 -24 L 36 -20 L 13 -2 Z" fill="#5fa8d3" {...stroke} />
      <path d="M -14 -12 q -12 2 -10 10 q 2 6 10 4" fill="none" stroke={INK} strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <A key={i} x={37 + i * 3} y={-20} c="a-drip" d={`${i * 0.25}s`} dur="1.1s">
          <ellipse rx="1.4" ry="2.4" fill="#6fb7e0" />
        </A>
      ))}
    </g>
  );
}

export function Rainbow({ x = 150, y = 200, r = 90 }) {
  const cols = ['#e6566b', '#f2a23d', '#f6d36a', '#7fb86a', '#5fa8d3', '#8a7bd0'];
  return (
    <g filter="url(#wc-soft)" opacity="0.7">
      {cols.map((c, i) => (
        <path key={c} d={`M ${x - r + i * 6} ${y} A ${r - i * 6} ${r - i * 6} 0 0 1 ${x + r - i * 6} ${y}`} stroke={c} strokeWidth="6.5" fill="none" />
      ))}
    </g>
  );
}

export function Owl({ x, y, s = 1, color = '#a77a52' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <A c="a-bob" dur="4s">
        <path d="M -16 0 Q -20 -24 -12 -36 L -8 -44 L -2 -36 L 2 -36 L 8 -44 L 12 -36 Q 20 -24 16 0 Z" fill={color} {...stroke} />
        <path d="M -10 -4 Q 0 -22 10 -4 Z" fill="#e9d2a8" opacity="0.8" />
        <circle cx="-6.5" cy="-27" r="6.5" fill="#fff8e6" {...stroke} strokeWidth="0.9" />
        <circle cx="6.5" cy="-27" r="6.5" fill="#fff8e6" {...stroke} strokeWidth="0.9" />
        <g transform="translate(0 -27)">
          <g className="anim a-blink">
            <circle cx="-6.5" cy="0" r="3" fill={INK} />
            <circle cx="6.5" cy="0" r="3" fill={INK} />
          </g>
        </g>
        <path d="M -2.4 -21 L 0 -16 L 2.4 -21 Z" fill="#f2a23d" />
        <path d="M -6 0 l -2 4 M -2 0 l 0 4 M 2 0 l 0 4 M 6 0 l 2 4" stroke="#f2a23d" strokeWidth="1.4" />
      </A>
    </g>
  );
}

export function Cat({ x, y, s = 1, color = '#f1ece2', flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <A x={14} y={-6} c="a-tail" dur="2.8s">
        <path d="M 0 0 Q 18 -2 16 -22 Q 14 -30 20 -34" stroke={INK} strokeWidth="5.4" fill="none" strokeLinecap="round" />
        <path d="M 0 0 Q 18 -2 16 -22 Q 14 -30 20 -34" stroke={color} strokeWidth="3.6" fill="none" strokeLinecap="round" />
      </A>
      <path d="M -14 0 Q -18 -26 -4 -32 Q 10 -34 16 -14 Q 18 -2 14 0 Z" fill={color} {...stroke} />
      <path d="M -12 -30 L -16 -46 L -4 -36 L 4 -36 L 12 -46 L 10 -30 Q 12 -18 0 -16 Q -12 -16 -12 -30 Z" fill={color} {...stroke} />
      <g transform="translate(0 -28)">
        <g className="anim a-blink">
          <ellipse cx="-4.4" cy="0" rx="1.8" ry="2.6" fill="#7aa35a" />
          <ellipse cx="4.4" cy="0" rx="1.8" ry="2.6" fill="#7aa35a" />
        </g>
      </g>
      <path d="M -1.4 -23 l 1.4 1.6 l 1.4 -1.6 Z" fill="#e9877a" />
      <path d="M -6 -21 l -9 -1 M -6 -20 l -9 2 M 6 -21 l 9 -1 M 6 -20 l 9 2" stroke={INK} strokeWidth="0.5" opacity="0.6" />
    </g>
  );
}

export function Turtle({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <A c="a-creep" dur="6s">
        <ellipse cx="22" cy="-8" rx="8" ry="6" fill="#9ac27a" {...stroke} />
        <circle cx="25" cy="-10" r="1.2" fill={INK} />
        <path d="M -14 -2 l -4 4 M 12 -2 l 4 4 M -8 0 l -2 4 M 6 0 l 2 4" stroke="#7aa35a" strokeWidth="4" strokeLinecap="round" />
        <path d="M -20 -2 Q -18 -26 0 -26 Q 18 -26 20 -2 Z" fill="#6f9e6a" {...stroke} />
        <path d="M -8 -2 L -6 -18 L 6 -18 L 8 -2 M -14 -10 L -6 -10 M 6 -10 L 15 -10" stroke={INK} strokeWidth="0.8" fill="none" opacity="0.5" />
      </A>
    </g>
  );
}

export function Fish({ x, y, s = 1, color = '#f2a23d', d, flip = false }) {
  return (
    <A x={x} y={y} c="a-swim" d={d} dur="4.6s">
      <g transform={`scale(${flip ? -s : s} ${s})`}>
        <path d="M -12 0 Q 0 -10 12 0 Q 0 10 -12 0 Z" fill={color} {...stroke} strokeWidth="0.9" />
        <path d="M -12 0 L -20 -6 L -20 6 Z" fill={color} {...stroke} strokeWidth="0.9" />
        <circle cx="6" cy="-1.5" r="1.2" fill={INK} />
      </g>
    </A>
  );
}

export function Nest({ x, y }) {
  const chicks = [-12, 0, 12];
  return (
    <g transform={`translate(${x} ${y})`}>
      {chicks.map((cx, i) => (
        <A key={i} x={cx} y={-8} c="a-chirp" d={`${i * 0.3}s`} dur="1.6s">
          <circle r="7" fill="#f6d36a" {...stroke} />
          <circle cx="-2" cy="-2" r="1" fill={INK} />
          <circle cx="2.4" cy="-2" r="1" fill={INK} />
          <path d="M -2 1 L 0 6 L 2 1 Z" fill="#f2793d" />
        </A>
      ))}
      <path d="M -26 -6 Q 0 14 26 -6 Q 22 8 0 10 Q -22 8 -26 -6 Z" fill="#a77a52" {...stroke} />
      <path d="M -22 -2 q 10 6 20 0 M 0 0 q 10 6 20 -2 M -18 4 q 12 4 28 0" stroke="#7a5432" strokeWidth="1" fill="none" />
    </g>
  );
}

export function BreathRings({ x, y, color = '#ffffff' }) {
  return [0, 1, 2].map((i) => (
    <A key={i} x={x} y={y} c="a-ring" d={`${i * 1.4}s`} dur="4.2s">
      <circle r="40" fill="none" stroke={color} strokeWidth="2" />
    </A>
  ));
}

export function Confetti({ x1 = 50, x2 = 250, y = 40, n = 22 }) {
  const rnd = makeRandom(77);
  const cols = ['#e6566b', '#f2b33d', '#5fa8d3', '#7fb86a', '#9a7bd0'];
  return Array.from({ length: n }).map((_, i) => (
    <A key={i} x={x1 + rnd() * (x2 - x1)} y={y + rnd() * 70} c="a-confetti" d={`${rnd() * 2}s`} dur={`${2.4 + rnd()}s`}>
      <rect x="-2.5" y="-4" width="5" height="8" rx="1" fill={cols[i % cols.length]} transform={`rotate(${rnd() * 180})`} />
    </A>
  ));
}

export function Leaves({ list = [] }) {
  return list.map(([x, y, rot = 0], i) => (
    <A key={i} x={x} y={y} c="a-leaf" d={`${i * 0.6}s`} dur={`${4 + (i % 3)}s`}>
      <path transform={`rotate(${rot})`} d="M 0 0 Q 7 -9 16 0 Q 7 9 0 0 Z" fill={i % 2 ? '#e3a13a' : '#8cbf6a'} {...stroke} strokeWidth="0.8" />
    </A>
  ));
}

export function Wind({ list = [] }) {
  return list.map(([x, y, w = 60], i) => (
    <A key={i} x={x} y={y} c="a-wind" d={`${i * 0.7}s`} dur="3s">
      <path d={`M 0 0 Q ${w / 2} -8 ${w} 0 q 10 6 4 12 q -6 4 -8 -4`} stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />
    </A>
  ));
}

export function Sparkles({ pts = [] }) {
  return <Stars pts={pts} color="#ffe58a" />;
}
