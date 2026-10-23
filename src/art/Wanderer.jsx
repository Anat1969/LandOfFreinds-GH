// הנודד: הדמות המקורית של החפיסה. גוף דק, כובע גבוה ורך, צעיף מתנופף ונעליים מחודדות.
// כל מפרק מונפש סביב ראשית הצירים המקומית שלו, כך שאנימציות CSS מסתובבות בדיוק מהכתף, מהירך או מהכובע.

export const INK = '#2b2431';

export const PALETTES = {
  wanderer: { coat: '#3f7396', scarf: '#e58a3a', hat: '#6b2c54', band: '#f1b94a', skin: '#f5d8b0', pants: '#3a3247', shoe: '#5b2a40', hair: '#7a4a2a' },
  friend: { coat: '#c45a6a', scarf: '#f3c24f', hat: '#3f6e4c', band: '#e9d38a', skin: '#f2cfa2', pants: '#41384d', shoe: '#2f4a3c', hair: '#3a2a22' },
  third: { coat: '#7c62a8', scarf: '#6fc0b0', hat: '#2e4f7a', band: '#f08c6a', skin: '#edc79a', pants: '#3a3247', shoe: '#2e3c5a', hair: '#5c3a1e' },
};

// מיקומי ירך, ברך וכף רגל לכל תנוחה. הירך קובעת את גובה פלג הגוף העליון.
const LEGS = {
  stand: { hip: -62, l: [[-5, -62], [-7, -32], [-9, -3]], r: [[5, -62], [7, -32], [9, -3]] },
  walk: { hip: -61, l: [[-4, -61], [-11, -33], [-21, -5]], r: [[4, -61], [10, -31], [17, -3]] },
  sit: { hip: -26, l: [[-4, -26], [16, -42], [22, -3]], r: [[4, -26], [24, -40], [31, -3]] },
  crouch: { hip: -38, l: [[-4, -38], [15, -52], [11, -3]], r: [[4, -38], [22, -48], [23, -3]] },
  cross: { hip: -12, l: [[-4, -12], [-24, -8], [6, -3]], r: [[4, -12], [24, -8], [-6, -3]] },
  jump: { hip: -84, l: [[-4, -84], [-14, -62], [-6, -42]], r: [[4, -84], [15, -64], [9, -44]] },
  float: { hip: -62, l: [[-4, -62], [-10, -36], [-4, -10]], r: [[4, -62], [12, -38], [18, -14]] },
  lie: { hip: -62, l: [[-4, -62], [-6, -32], [-8, -3]], r: [[4, -62], [8, -33], [14, -6]] },
};

function Shoe({ x, y, dir }) {
  return (
    <path
      d={`M ${x - 3 * dir} ${y - 1} q ${7 * dir} -6 ${15 * dir} -1 q ${5 * dir} 2 ${7 * dir} -4 q ${-1 * dir} 7 ${-8 * dir} 7 L ${x - 4 * dir} ${y + 2} Z`}
      fill="var(--shoe)"
      stroke={INK}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  );
}

function Leg({ pts, dir }) {
  const [h, k, f] = pts;
  const d = `M ${h[0]} ${h[1]} Q ${k[0]} ${k[1]} ${f[0]} ${f[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="6.4" strokeLinecap="round" />
      <path d={d} fill="none" stroke="var(--pants)" strokeWidth="4.2" strokeLinecap="round" />
      <Shoe x={f[0]} y={f[1]} dir={dir} />
    </g>
  );
}

// זרוע: side=1 שמאל המסך, side=-1 ימין. a = הרמה החוצה במעלות, e = כיפוף המרפק.
function Arm({ side, a = 10, e = 0, wave = false, hold = null }) {
  return (
    <g transform={`translate(${-11 * side} -101) rotate(${a * side})`}>
      <g className={wave ? 'anim a-wave' : undefined}>
        <line x1="0" y1="0" x2="0" y2="21" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2="21" stroke="var(--coat)" strokeWidth="5.6" strokeLinecap="round" />
        <g transform={`translate(0 21) rotate(${e * side})`}>
          <line x1="0" y1="0" x2="0" y2="18" stroke={INK} strokeWidth="7.4" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="18" stroke="var(--coat)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="0" cy="21" r="3.6" fill="var(--skin)" stroke={INK} strokeWidth="1.1" />
          {hold && <g transform="translate(0 22)">{hold}</g>}
        </g>
      </g>
    </g>
  );
}

function Hat({ type, tilt }) {
  return (
    <g transform={`translate(0 -133) rotate(${tilt})`}>
      <g className="anim a-hat">
        {type === 'cone' ? (
          <>
            <path d="M -16 0 Q -4 -26 6 -54 Q 8 -26 16 0 Z" fill="var(--hat)" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M -13 -6 Q 0 -2 13 -6 L 14 -1 Q 0 3 -14 -1 Z" fill="var(--band)" opacity="0.9" />
            <circle cx="6" cy="-55" r="3.4" fill="var(--band)" stroke={INK} strokeWidth="1" />
            <ellipse cx="0" cy="0" rx="21" ry="4.4" fill="var(--hat)" stroke={INK} strokeWidth="1.3" />
          </>
        ) : type === 'beret' ? (
          <>
            <ellipse cx="2" cy="-5" rx="17" ry="8" fill="var(--hat)" stroke={INK} strokeWidth="1.3" />
            <circle cx="4" cy="-13" r="2" fill={INK} />
          </>
        ) : (
          <>
            <path d="M -11 0 L -10 -36 Q -6 -42 2 -41 Q 12 -40 15 -46 Q 14 -38 11 -34 L 11 0 Z" fill="var(--hat)" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M -11 -8 L 11 -8 L 11 -1 L -11 -1 Z" fill="var(--band)" stroke={INK} strokeWidth="0.9" />
            <path d="M -7 -30 Q -6 -20 -7 -12" stroke="#fff" strokeOpacity="0.25" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <ellipse cx="0" cy="0" rx="20" ry="4.4" fill="var(--hat)" stroke={INK} strokeWidth="1.3" />
          </>
        )}
      </g>
    </g>
  );
}

function Face({ mood, look }) {
  const ex = look * 1.6;
  return (
    <g>
      <circle cx="-8.5" cy="-116" r="3" fill="#e9877a" opacity="0.35" />
      <circle cx="8.5" cy="-116" r="3" fill="#e9877a" opacity="0.35" />
      {mood === 'closed' || mood === 'sleep' ? (
        <>
          <path d="M -7 -122 q 2.6 2.4 5 0" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M 2 -122 q 2.6 2.4 5 0" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <g transform="translate(0 -122)">
          <g className="anim a-blink">
            <ellipse cx={-4.6 + ex} cy="0" rx="2" ry="2.6" fill={INK} />
            <ellipse cx={4.6 + ex} cy="0" rx="2" ry="2.6" fill={INK} />
            <circle cx={-4 + ex} cy="-0.9" r="0.7" fill="#fff" />
            <circle cx={5.2 + ex} cy="-0.9" r="0.7" fill="#fff" />
          </g>
        </g>
      )}
      <path d={`M ${-1 + ex} -119 q ${3 + look} 3 ${0.5} 4.6`} stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.7" />
      {mood === 'wonder' ? (
        <ellipse cx={ex * 0.6} cy="-111.5" rx="1.8" ry="2.3" fill={INK} opacity="0.8" />
      ) : mood === 'laugh' ? (
        <path d="M -4.5 -113 q 4.5 6 9 0 Z" fill="#7a2a36" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      ) : mood === 'flat' ? (
        <path d="M -3 -112 l 6 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      ) : mood === 'tongue' ? (
        <>
          <path d="M -3.5 -112.5 q 3.5 2 7 0" stroke={INK} strokeWidth="1.2" fill="none" />
          <path d="M 0 -112 q 1 6 4 4 q 1 -2 -1 -4 Z" fill="#e66d7c" stroke={INK} strokeWidth="0.8" />
        </>
      ) : (
        <path d="M -4 -113 q 4 3.6 8 0" stroke={INK} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

/**
 * x,y = נקודת כפות הרגליים בתוך ה-viewBox. s = קנה מידה. flip = מבט הפוך.
 * pose: { legs, armL:[a,e], armR:[a,e], waveL, waveR, holdL, holdR, hatTilt, lean, hat, mood, look, hug }
 */
export default function Wanderer({ x = 150, y = 300, s = 1, flip = false, palette = 'wanderer', pose = {}, className }) {
  const p = PALETTES[palette] ?? PALETTES.wanderer;
  const legs = LEGS[pose.legs ?? 'stand'];
  const hip = legs.hip;
  const [aL, eL] = pose.armL ?? [12, 6];
  const [aR, eR] = pose.armR ?? [12, 6];
  const vars = {
    '--coat': p.coat, '--scarf': p.scarf, '--hat': p.hat, '--band': p.band,
    '--skin': p.skin, '--pants': p.pants, '--shoe': p.shoe,
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} style={vars} className={className}>
      <ellipse cx="0" cy="1" rx={pose.legs === 'cross' ? 30 : 22} ry="4" fill={INK} opacity="0.12" />
      <Leg pts={legs.l} dir={-1} />
      <Leg pts={legs.r} dir={1} />

      <g transform={`translate(0 ${hip}) rotate(${pose.lean ?? 0})`}>
        <g className="anim a-breathe">
          <g transform="translate(0 62)">
            {/* זרוע אחורית */}
            {!pose.hug && <Arm side={-1} a={aR} e={eR} wave={pose.waveR} hold={pose.holdR} />}

            {/* מעיל */}
            <path
              d="M -11 -105 Q -15 -82 -21 -55 Q 0 -49 21 -55 Q 15 -82 11 -105 Z"
              fill="var(--coat)"
              stroke={INK}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path d="M -14 -66 Q 0 -61 14 -66" stroke={INK} strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M 0 -100 L 0 -58" stroke={INK} strokeWidth="0.9" opacity="0.35" />
            <circle cx="2.5" cy="-90" r="1.4" fill="var(--band)" />
            <circle cx="2.5" cy="-80" r="1.4" fill="var(--band)" />
            <path d="M -9 -100 Q -14 -84 -17 -60" stroke="#fff" strokeOpacity="0.18" strokeWidth="3" fill="none" />

            {/* צעיף */}
            <g transform="translate(7 -102)">
              <g className="anim a-scarf">
                <path d="M 0 0 Q 6 12 4 26 L 10 25 Q 12 12 6 -1 Z" fill="var(--scarf)" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
              </g>
            </g>
            <path d="M -11 -108 Q 0 -101 11 -108 L 12 -101 Q 0 -94 -12 -101 Z" fill="var(--scarf)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />

            {/* ראש */}
            <path d="M -12 -126 q -4 -6 2 -9 M 12 -126 q 4 -6 -2 -9" stroke={p.hair} strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="0" cy="-121" r="13" fill="var(--skin)" stroke={INK} strokeWidth="1.3" />
            <Face mood={pose.mood ?? 'smile'} look={pose.look ?? 0} />
            <Hat type={pose.hat ?? 'tall'} tilt={pose.hatTilt ?? -6} />

            {/* זרוע קדמית, או חיבוק עצמי */}
            {pose.hug ? (
              <g>
                <path d="M -11 -100 Q -20 -86 -4 -80 Q 8 -78 12 -88" fill="none" stroke={INK} strokeWidth="7.6" strokeLinecap="round" />
                <path d="M -11 -100 Q -20 -86 -4 -80 Q 8 -78 12 -88" fill="none" stroke="var(--coat)" strokeWidth="5.2" strokeLinecap="round" />
                <path d="M 11 -100 Q 20 -88 6 -84 Q -6 -82 -10 -90" fill="none" stroke={INK} strokeWidth="7.6" strokeLinecap="round" />
                <path d="M 11 -100 Q 20 -88 6 -84 Q -6 -82 -10 -90" fill="none" stroke="var(--coat)" strokeWidth="5.2" strokeLinecap="round" />
                <circle cx="12" cy="-89" r="3.4" fill="var(--skin)" stroke={INK} strokeWidth="1" />
                <circle cx="-10" cy="-91" r="3.4" fill="var(--skin)" stroke={INK} strokeWidth="1" />
              </g>
            ) : (
              <Arm side={1} a={aL} e={eL} wave={pose.waveL} hold={pose.holdL} />
            )}
          </g>
        </g>
      </g>
    </g>
  );
}
