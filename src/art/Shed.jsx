// השדון: יצור קטן ושובב שמגלם דפוס או רגש מאתגר. אוזניים מחודדות גדולות, עיניים מביעות, זנב, ולפעמים קרניים.
// כל שדון נבנה מאותו שלד עם "מראה" אחר: צבע, צורת גוף, עיניים, פה, ידיים, רגליים, תוספות והנפשה.
import { INK } from './Wanderer.jsx';
import { blobPath } from '../lib/prng.js';

const line = { stroke: INK, strokeLinecap: 'round', strokeLinejoin: 'round' };

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `rgb(${r} ${g} ${b})`;
}

function Eyes({ type, color }) {
  const lid = shade(color, -0.05);
  if (type === 'shut') {
    return (
      <g>
        <path d="M -27 -74 q 9 7 18 0" fill="none" strokeWidth="2.6" {...line} />
        <path d="M 9 -74 q 9 7 18 0" fill="none" strokeWidth="2.6" {...line} />
      </g>
    );
  }
  const r = type === 'wide' ? 13 : type === 'scared' ? 12 : 10.5;
  const pr = type === 'scared' ? 2.6 : type === 'wide' ? 6 : 4.6;
  const py = type === 'sad' || type === 'sleepy' ? 3 : 0;
  const px = type === 'sly' ? 4 : 0;
  return (
    <g>
      <g transform="translate(0 -74)">
        <g className="anim a-blink">
          {[-17, 17].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="0" r={r} fill="#fffdf6" stroke={INK} strokeWidth="1.3" />
              <circle cx={cx + px} cy={py} r={pr} fill={INK} />
              <circle cx={cx + px - pr * 0.35} cy={py - pr * 0.4} r={Math.max(0.9, pr * 0.32)} fill="#fff" />
            </g>
          ))}
        </g>
      </g>
      {(type === 'sleepy' || type === 'sly') &&
        [-17, 17].map((cx) => (
          <path key={cx} d={`M ${cx - r - 1} -74 A ${r + 1} ${r + 1} 0 0 1 ${cx + r + 1} -74 Z`} fill={lid} stroke={INK} strokeWidth="1.3" />
        ))}
      {type === 'angry' && (
        <>
          <path d="M -31 -92 L -8 -83" strokeWidth="4" {...line} />
          <path d="M 31 -92 L 8 -83" strokeWidth="4" {...line} />
        </>
      )}
      {type === 'sad' && (
        <>
          <path d="M -29 -84 L -9 -91" strokeWidth="3" {...line} />
          <path d="M 29 -84 L 9 -91" strokeWidth="3" {...line} />
        </>
      )}
      {type === 'scared' && (
        <>
          <path d="M -29 -92 q 10 -8 20 -2" fill="none" strokeWidth="2.6" {...line} />
          <path d="M 29 -92 q -10 -8 -20 -2" fill="none" strokeWidth="2.6" {...line} />
        </>
      )}
    </g>
  );
}

function Mouth({ type }) {
  switch (type) {
    case 'growl':
      return (
        <g>
          <path d="M -20 -50 Q 0 -32 20 -50 Q 0 -43 -20 -50 Z" fill="#5a1a26" stroke={INK} strokeWidth="1.3" />
          <path d="M -14 -47 l 3 5 l 3 -4 M 4 -46 l 3 5 l 3 -5" fill="#fff" stroke={INK} strokeWidth="0.7" />
        </g>
      );
    case 'wobble':
      return <path d="M -14 -46 l 5 -4 l 5 4 l 5 -4 l 5 4 l 5 -4" fill="none" strokeWidth="2.2" {...line} />;
    case 'yawn':
      return <ellipse cx="0" cy="-44" rx="7" ry="9" fill="#5a1a26" stroke={INK} strokeWidth="1.3" />;
    case 'frown':
      return <path d="M -13 -40 Q 0 -52 13 -40" fill="none" strokeWidth="2.6" {...line} />;
    case 'smirk':
      return <path d="M -12 -48 Q 4 -40 15 -51" fill="none" strokeWidth="2.6" {...line} />;
    case 'flat':
      return <path d="M -10 -46 L 10 -46" strokeWidth="2.6" {...line} />;
    case 'o':
      return <circle cx="0" cy="-45" r="4.4" fill="#5a1a26" stroke={INK} strokeWidth="1.2" />;
    case 'grin':
    default:
      return (
        <g>
          <path d="M -17 -52 Q 0 -30 17 -52 Z" fill="#5a1a26" stroke={INK} strokeWidth="1.3" />
          <path d="M -6 -40 q 6 -6 12 0 q -6 5 -12 0 Z" fill="#e66d7c" />
        </g>
      );
  }
}

function Limb({ d, color, w = 7 }) {
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 2.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

const ARMS = {
  down: [['M -46 -60 Q -58 -48 -56 -34', [-56, -32]], ['M 46 -60 Q 58 -48 56 -34', [56, -32]]],
  up: [['M -46 -64 Q -62 -80 -66 -98', [-66, -100]], ['M 46 -64 Q 62 -80 66 -98', [66, -100]]],
  fists: [['M -46 -62 Q -66 -66 -64 -84', [-64, -86]], ['M 46 -62 Q 66 -66 64 -84', [64, -86]]],
  hold: [['M -46 -60 Q -58 -48 -56 -34', [-56, -32]], ['M 46 -62 Q 62 -60 66 -50', [67, -48]]],
  holdUp: [['M -46 -60 Q -58 -48 -56 -34', [-56, -32]], ['M 46 -64 Q 62 -78 64 -94', [64, -96]]],
};

/**
 * look: { seed, eyes, mouth, arms, legs, ears, horns, tail, tuft, spikes, anim, hold }
 * hold: אביזר שמוצב ביד ימין (או מעל הראש ב-holdUp).
 */
export default function Shed({ uid, x = 150, y = 300, s = 1, color = '#d9604f', look = {}, flip = false }) {
  const dark = shade(color, -0.18);
  const light = shade(color, 0.16);
  const belly = shade(color, 0.28);
  const seed = look.seed ?? 5;
  const arms = look.arms ?? 'down';
  const gid = `shed-${uid}`;
  const earsDown = look.ears === 'down';

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        <radialGradient id={gid} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="2" rx="40" ry="5" fill={INK} opacity="0.13" />
      <g className={`anim a-${look.anim ?? 'breathe'}`}>
        {/* זנב */}
        {look.tail !== false && (
          <g transform="translate(38 -26)">
            <g className="anim a-tail">
              <path d="M 0 0 Q 34 4 38 -22 Q 40 -36 50 -40" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
              <path d="M 0 0 Q 34 4 38 -22 Q 40 -36 50 -40" fill="none" stroke={color} strokeWidth="4.4" strokeLinecap="round" />
              <path d="M 46 -46 L 60 -44 L 50 -34 Z" fill={dark} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
            </g>
          </g>
        )}

        {/* רגליים */}
        {look.legs === 'spring' ? (
          <>
            <path d="M -18 -20 l -8 -3 l 12 -4 M -18 -20 l 10 4 l -14 4 l 12 4 l -10 4" fill="none" strokeWidth="2.4" {...line} />
            <path d="M 18 -20 l 10 4 l -14 4 l 12 4 l -10 4" fill="none" strokeWidth="2.4" {...line} />
            <ellipse cx="-22" cy="-1" rx="10" ry="4.5" fill={dark} stroke={INK} strokeWidth="1.2" />
            <ellipse cx="20" cy="-1" rx="10" ry="4.5" fill={dark} stroke={INK} strokeWidth="1.2" />
          </>
        ) : (
          <>
            <Limb d="M -18 -22 L -20 -4" color={dark} w={8} />
            <Limb d="M 18 -22 L 20 -4" color={dark} w={8} />
            <ellipse cx="-24" cy="-1" rx="11" ry="5" fill={dark} stroke={INK} strokeWidth="1.2" />
            <ellipse cx="24" cy="-1" rx="11" ry="5" fill={dark} stroke={INK} strokeWidth="1.2" />
          </>
        )}

        {/* אוזניים */}
        {[1, -1].map((sx) => (
          <g key={sx} transform={`scale(${sx} 1)`}>
            {earsDown ? (
              <>
                <path d="M -40 -92 Q -78 -88 -92 -62 Q -68 -72 -44 -74 Z" fill={color} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M -46 -86 Q -70 -82 -80 -68 Q -64 -74 -48 -78 Z" fill="#f2a7a0" opacity="0.7" />
              </>
            ) : (
              <>
                <path d="M -38 -98 Q -74 -106 -92 -130 Q -70 -86 -44 -76 Z" fill={color} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M -44 -94 Q -66 -100 -80 -116 Q -64 -90 -48 -82 Z" fill="#f2a7a0" opacity="0.7" />
              </>
            )}
          </g>
        ))}

        {/* קרניים, ציצה וקוצים */}
        {look.horns && [1, -1].map((sx) => (
          <path key={sx} transform={`scale(${sx} 1)`} d="M -16 -110 Q -26 -132 -12 -142 Q -16 -126 -6 -114 Z" fill="#f4ead2" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
        ))}
        {look.spikes && (
          <path d="M -36 -100 l 6 -16 l 6 12 l 6 -18 l 6 14 l 6 -18 l 6 14 l 6 -18 l 6 12 l 6 -14 l 4 16" fill={dark} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
        )}

        {/* גוף */}
        <path d={blobPath(seed, { cx: 0, cy: -64, r: 50, points: 8, wobble: 0.28 })} fill={`url(#${gid})`} stroke={INK} strokeWidth="1.5" />
        <ellipse cx="0" cy="-40" rx="26" ry="18" fill={belly} opacity="0.55" />
        {look.tuft && <path d="M -6 -112 Q -2 -134 6 -118 Q 10 -138 16 -116" fill="none" stroke={dark} strokeWidth="3.4" strokeLinecap="round" />}
        <circle cx="-30" cy="-56" r="5" fill="#e9877a" opacity="0.3" />
        <circle cx="30" cy="-56" r="5" fill="#e9877a" opacity="0.3" />

        <Eyes type={look.eyes ?? 'wide'} color={color} />
        <Mouth type={look.mouth ?? 'grin'} />

        {/* ידיים */}
        {arms === 'cross' ? (
          <>
            <Limb d="M -46 -60 Q -14 -36 26 -50" color={dark} />
            <Limb d="M 46 -60 Q 14 -44 -24 -54" color={dark} />
          </>
        ) : arms === 'face' ? (
          <>
            <Limb d="M -46 -58 Q -46 -78 -18 -76" color={dark} />
            <Limb d="M 46 -58 Q 46 -78 18 -76" color={dark} />
            <circle cx="-17" cy="-76" r="8" fill={color} stroke={INK} strokeWidth="1.2" />
            <circle cx="17" cy="-76" r="8" fill={color} stroke={INK} strokeWidth="1.2" />
          </>
        ) : (
          (ARMS[arms] ?? ARMS.down).map(([d, [hx, hy]], i) => (
            <g key={i}>
              <Limb d={d} color={dark} />
              <circle cx={hx} cy={hy} r={arms === 'fists' ? 8 : 5.4} fill={color} stroke={INK} strokeWidth="1.2" />
            </g>
          ))
        )}
        {look.hold && <g transform={`translate(${arms === 'holdUp' ? '64 -98' : '67 -48'})`}>{look.hold}</g>}
      </g>
    </g>
  );
}
