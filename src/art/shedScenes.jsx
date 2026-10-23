// סצנה לכל קלף שדון: כתם צבע, תפאורה שמספרת מה השדון עושה, והשדון עצמו בשכבה הקדמית.
import Shed from './Shed.jsx';
import { INK } from './Wanderer.jsx';
import { A, Wash, Ground, Cloud, Rain, Moon, Stars } from './props.jsx';
import { makeRandom } from '../lib/prng.js';

const st = { stroke: INK, strokeWidth: 1.2, strokeLinejoin: 'round', strokeLinecap: 'round' };

function Steam() {
  return [[-30, -150], [0, -162], [30, -150]].map(([x, y], i) => (
    <A key={i} x={150 + x} y={262 + y} c="a-rise" d={`${i * 0.5}s`} dur="1.8s">
      <path d="M 0 0 q -8 -6 0 -12 q 8 -6 0 -12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
    </A>
  ));
}

function Clock({ x, y, r = 14, d }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#fffdf6" {...st} />
      <A c="a-spin" dur="2s" d={d}>
        <line x1="0" y1="0" x2="0" y2={-r * 0.75} stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      </A>
      <A c="a-spin" dur="12s" d={d}>
        <line x1="0" y1="0" x2={r * 0.5} y2="0" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </A>
      <circle r="1.6" fill={INK} />
    </g>
  );
}

function Papers() {
  const rnd = makeRandom(9);
  return Array.from({ length: 9 }).map((_, i) => (
    <A key={i} x={60 + rnd() * 180} y={60 + rnd() * 140} c="a-float" d={`${i * 0.4}s`} dur={`${3 + (i % 3)}s`}>
      <g transform={`rotate(${rnd() * 60 - 30})`}>
        <rect x="-10" y="-13" width="20" height="26" fill="#fffdf6" {...st} />
        <path d="M -6 -6 h 12 M -6 0 h 12 M -6 6 h 8" stroke={INK} strokeWidth="0.7" opacity="0.5" />
      </g>
    </A>
  ));
}

const HOLD = {
  magnifier: (
    <g transform="rotate(-20)">
      <rect x="-2.4" y="0" width="4.8" height="22" rx="2" fill="#8a5d3b" {...st} />
      <circle cx="0" cy="-10" r="12" fill="#dff1fa" fillOpacity="0.7" {...st} strokeWidth="2.2" />
    </g>
  ),
  megaphone: (
    <g transform="rotate(-24)">
      <path d="M -4 -6 L 30 -20 L 30 20 L -4 6 Z" fill="#f2b33d" {...st} />
      <rect x="-12" y="-6" width="10" height="12" rx="2" fill="#e2563f" {...st} />
      <A x={38} y={0} c="a-ring" dur="1.4s"><circle r="10" fill="none" stroke="#fff" strokeWidth="2" /></A>
    </g>
  ),
  phone: (
    <g>
      <A c="a-pulse" dur="2s"><circle cx="0" cy="-4" r="26" fill="#bdf1ff" opacity="0.5" /></A>
      <rect x="-9" y="-20" width="18" height="30" rx="3" fill="#2b2431" {...st} />
      <rect x="-6.5" y="-16" width="13" height="21" rx="1" fill="#7fe0ff" />
    </g>
  ),
  mask: (
    <g transform="translate(0 -6)">
      <rect x="-1.4" y="2" width="2.8" height="20" fill="#8a5d3b" />
      <path d="M -18 -8 Q 0 -16 18 -8 Q 18 8 0 10 Q -18 8 -18 -8 Z" fill="#fffdf6" {...st} />
      <ellipse cx="-7" cy="-3" rx="4" ry="2.6" fill={INK} />
      <ellipse cx="7" cy="-3" rx="4" ry="2.6" fill={INK} />
      <path d="M -6 4 q 6 5 12 0" fill="none" {...st} />
    </g>
  ),
  flag: (
    <g>
      <line x1="0" y1="0" x2="0" y2="-46" stroke="#8a5d3b" strokeWidth="2.6" strokeLinecap="round" />
      <A x={0} y={-46} c="a-flag" dur="2.4s">
        <path d="M 0 0 Q 12 -3 26 2 Q 18 8 26 14 Q 12 11 0 15 Z" fill="#fffdf6" {...st} />
      </A>
    </g>
  ),
  candy: (
    <g>
      <line x1="0" y1="0" x2="0" y2="-26" stroke="#fffdf6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-38" r="14" fill="#f6a4c0" {...st} />
      <path d="M 0 -38 m -9 0 a 9 9 0 1 1 18 0 a 6 6 0 1 1 -12 0 a 3 3 0 1 1 6 0" fill="none" stroke="#e2563f" strokeWidth="2.2" />
    </g>
  ),
};

// תפאורה לפי סוג השדון: mid = מאחורי השדון, front = לפניו, hold = ביד.
function extras(card) {
  switch (card.extra) {
    case 'steam':
      return { mid: [<Ground key="g" y={286} color="#f1cbbd" />], front: [<Steam key="s" />] };
    case 'shadow':
      return {
        mid: [
          <A key="sh" x={220} y={150} c="a-sway" dur="5s">
            <path d="M -30 80 Q -40 0 -10 -50 Q 10 -70 30 -40 Q 50 0 36 80 Z" fill="#3b4a66" opacity="0.28" />
            <circle cx="-2" cy="-30" r="3" fill="#fff" opacity="0.8" />
            <circle cx="12" cy="-30" r="3" fill="#fff" opacity="0.8" />
          </A>,
          <Ground key="g" y={286} color="#cbd9e8" />,
        ],
        front: [],
      };
    case 'pillow':
      return {
        mid: [
          <g key="p" transform="translate(150 296)">
            <path d="M -86 0 Q -90 -26 -60 -28 L 64 -28 Q 92 -26 86 0 Z" fill="#f6e3a8" {...st} />
            <path d="M -60 -28 Q 0 -20 64 -28" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.4" />
          </g>,
          <Clock key="c" x={236} y={78} r={20} />,
          <Moon key="m" x={70} y={70} r={14} />,
        ],
        front: [],
      };
    case 'cloud':
      return { mid: [<Ground key="g" y={286} color="#d9dee3" />], front: [<g key="c" transform="translate(0 -12)"><Cloud x={150} y={96} s={1.6} color="#b9c2cc" /></g>] };
    case 'binoculars':
      return {
        mid: [
          <g key="gift" transform="translate(236 280)">
            <rect x="-22" y="-34" width="44" height="34" fill="#e6566b" {...st} />
            <rect x="-4" y="-34" width="8" height="34" fill="#f6d36a" />
            <path d="M 0 -34 q -18 -16 -16 0 Z M 0 -34 q 18 -16 16 0 Z" fill="#f6d36a" {...st} />
          </g>,
          <Ground key="g" y={286} color="#d6e8c6" />,
        ],
        front: [],
      };
    case 'blush':
      return { mid: [<Ground key="g" y={286} color="#f3d3dc" />], front: [] };
    case 'magnifier':
      return {
        mid: [
          <g key="drw" transform="translate(66 200) rotate(-8)">
            <rect x="-26" y="-34" width="52" height="66" fill="#fffdf6" {...st} />
            <path d="M -16 -20 q 10 -10 20 0 q 8 10 14 2 M -16 6 h 30 M -16 16 h 22" fill="none" stroke="#e2563f" strokeWidth="1.6" />
            <path d="M -22 -30 L 22 28 M 22 -30 L -22 28" stroke="#e2563f" strokeWidth="2.6" opacity="0.8" />
          </g>,
          <Ground key="g" y={286} color="#cfe9e5" />,
        ],
        front: [],
        hold: HOLD.magnifier,
      };
    case 'zoom':
      return {
        mid: [0, 1, 2, 3].map((i) => (
          <A key={i} x={40} y={170 + i * 22} c="a-wind" d={`${i * 0.3}s`} dur="1.2s">
            <path d={`M 0 0 h ${40 + i * 10}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </A>
        )),
        front: [],
      };
    case 'flies':
      return {
        mid: [<Ground key="g" y={286} color="#e8e0cc" />],
        front: [[100, 120], [200, 110], [176, 80]].map(([x, y], i) => (
          <A key={i} x={x} y={y} c="a-glide" d={`${i * 0.7}s`} dur="2.4s">
            <circle r="2.4" fill={INK} />
            <ellipse cx="-2" cy="-3" rx="3" ry="1.8" fill="#fff" opacity="0.8" />
          </A>
        )),
      };
    case 'rain':
      return {
        mid: [<Ground key="g" y={286} color="#c9d4ea" />, <Rain key="r" x1={86} x2={214} y1={96} n={18} />],
        front: [<Cloud key="c" x={150} y={80} s={1.7} color="#8d9bb8" />],
      };
    case 'megaphone':
      return { mid: [<Ground key="g" y={286} color="#e2d3ec" />], front: [], hold: HOLD.megaphone };
    case 'rock':
      return {
        mid: [
          <path key="rk" d="M 30 286 Q 40 220 90 214 Q 130 216 140 286 Z" fill="#b8ab9a" {...st} filter="url(#wc-soft)" />,
          <Ground key="g" y={286} color="#e5d5c2" />,
        ],
        front: [],
      };
    case 'flag':
      return { mid: [<Ground key="g" y={286} color="#d6e1d3" />], front: [], hold: HOLD.flag };
    case 'alone':
      return {
        mid: [
          <Moon key="m" x={226} y={70} r={16} />,
          <Stars key="s" pts={[[70, 56, 0.6], [110, 90, 0.5], [250, 130, 0.5]]} />,
          <g key="far" opacity="0.5">
            <circle cx="62" cy="250" r="9" fill="#f4d6ae" />
            <circle cx="80" cy="252" r="9" fill="#f4d6ae" />
            <circle cx="98" cy="250" r="9" fill="#f4d6ae" />
            <rect x="52" y="258" width="56" height="24" rx="8" fill="#9a8fc4" />
          </g>,
          <Ground key="g" y={286} color="#cfd0ea" />,
        ],
        front: [],
      };
    case 'clocks':
      return {
        mid: [<Ground key="g" y={286} color="#f6e5b0" />],
        front: [[70, 90, 16], [230, 84, 18], [96, 168, 12], [210, 150, 13], [150, 60, 14]].map(([x, y, r], i) => (
          <A key={i} x={0} y={0} c="a-shake" d={`${i * 0.1}s`} dur="0.4s"><Clock x={x} y={y} r={r} d={`${i * 0.3}s`} /></A>
        )),
      };
    case 'phone':
      return { mid: [<Ground key="g" y={286} color="#cfe8f0" />], front: [], hold: HOLD.phone };
    case 'candy':
      return {
        mid: [
          <Ground key="g" y={286} color="#f6d4de" />,
          ...[[70, 270, '#f2b33d'], [92, 276, '#5fa8d3'], [236, 272, '#7fb86a']].map(([x, y, c], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M -14 -6 L -8 0 L -14 6 Z M 14 -6 L 8 0 L 14 6 Z" fill={c} {...st} strokeWidth="0.8" />
              <ellipse rx="9" ry="6" fill={c} {...st} strokeWidth="0.8" />
            </g>
          )),
        ],
        front: [],
        hold: HOLD.candy,
      };
    case 'crown':
      return {
        mid: [<path key="pd" d="M 90 286 L 96 250 L 204 250 L 210 286 Z" fill="#c9a0d8" {...st} />],
        front: [
          <A key="cr" x={150} y={104} c="a-bob" dur="2.6s">
            <path d="M -22 0 L -26 -24 L -12 -12 L 0 -30 L 12 -12 L 26 -24 L 22 0 Z" fill="#f2c94c" {...st} />
            <circle cx="0" cy="-8" r="3" fill="#e2563f" />
          </A>,
        ],
        lift: 52,
      };
    case 'shell':
      return {
        mid: [
          <Ground key="g" y={286} color="#cfe6e2" />,
          <g key="sh" transform="translate(150 300)">
            <path d="M -86 0 Q -90 -110 0 -118 Q 90 -110 86 0 Z" fill="#e6c48f" fillOpacity="0.88" {...st} strokeWidth="1.6" />
            {[-60, -30, 0, 30, 60].map((x, i) => (
              <path key={i} d={`M ${x * 0.4} -116 Q ${x} -60 ${x * 1.3} 0`} fill="none" stroke="#a7834f" strokeWidth="1.4" />
            ))}
            <path d="M -50 -2 Q -54 -70 0 -76 Q 54 -70 50 -2 Z" fill="#3b3343" opacity="0.85" />
          </g>,
        ],
        front: [],
        scale: 0.56,
        yOff: -4,
      };
    case 'mask':
      return { mid: [<Ground key="g" y={286} color="#e3e7c6" />], front: [], hold: HOLD.mask };
    case 'tear':
      return {
        mid: [<Ground key="g" y={286} color="#efcfe0" />],
        front: [0, 1].map((i) => (
          <A key={i} x={i ? 171 : 129} y={214} c="a-drip" d={`${i * 0.6}s`} dur="1.6s">
            <path d="M 0 -6 Q 5 2 0 6 Q -5 2 0 -6 Z" fill="#8cc8ee" stroke={INK} strokeWidth="0.6" />
          </A>
        )),
      };
    case 'scale':
      return {
        mid: [
          <g key="sc" transform="translate(150 286)">
            <rect x="-3" y="-120" width="6" height="120" fill="#a7834f" {...st} />
            <A x={0} y={-118} c="a-sway" dur="3s">
              <line x1="-80" y1="0" x2="80" y2="10" stroke="#a7834f" strokeWidth="4" strokeLinecap="round" />
              <path d="M -96 30 Q -80 44 -64 30 Z" fill="#e8c88f" {...st} />
              <path d="M -80 0 L -96 30 M -80 0 L -64 30" stroke={INK} strokeWidth="0.8" />
              <path d="M 64 40 Q 80 54 96 40 Z" fill="#e8c88f" {...st} />
              <path d="M 80 10 L 64 40 M 80 10 L 96 40" stroke={INK} strokeWidth="0.8" />
              <circle cx="-80" cy="22" r="8" fill="#f2b33d" {...st} />
            </A>
          </g>,
        ],
        front: [],
      };
    case 'papers':
      return { mid: [<Ground key="g" y={286} color="#f1dcc6" />, <Papers key="p" />], front: [] };
    case 'gloves':
      return {
        mid: [
          <path key="ring" d="M 40 250 L 260 250 M 40 226 L 260 226" stroke="#e2563f" strokeWidth="3" />,
          <Ground key="g" y={286} color="#ecd0cb" />,
        ],
        front: [],
      };
    default:
      return { mid: [], front: [] };
  }
}

export function shedSceneFor(card) {
  const ex = extras(card);
  const s = ex.scale ?? 1.25;
  return {
    back: [<Wash key="wash" uid={card.id} c1={card.sky[0]} c2={card.sky[1]} seed={card.look.seed} />],
    mid: ex.mid,
    front: [
      <Shed
        key="shed"
        uid={card.id}
        x={150}
        y={302 - (ex.lift ?? 0) + (ex.yOff ?? 0)}
        s={s}
        color={card.color}
        look={{ ...card.look, hold: ex.hold }}
      />,
      ...ex.front,
    ],
  };
}
