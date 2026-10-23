import { motion } from 'framer-motion';
import { blobPath } from '../lib/prng.js';

// יצור מונפש בתוך SVG. צל: גוף כהה עם עיניים שמצמצות. אור: זוהר מסתובב עם קרניים.
export default function Creature({ card, idle = true }) {
  const gradId = `grad-${card.id}`;
  const glowId = `glow-${card.id}`;
  const isShadow = card.deck === 'shadow';
  const hueA = card.hue;
  const hueB = (card.hue + 24) % 360;

  return (
    <svg viewBox="0 0 200 200" className="creature" role="img" aria-label={card.name}>
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="75%">
          {isShadow ? (
            <>
              <stop offset="0%" stopColor={`hsl(${hueA} 35% 52%)`} />
              <stop offset="55%" stopColor={`hsl(${hueB} 40% 26%)`} />
              <stop offset="100%" stopColor={`hsl(${hueA} 45% 10%)`} />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor={`hsl(${hueA} 100% 92%)`} />
              <stop offset="50%" stopColor={`hsl(${hueA} 92% 66%)`} />
              <stop offset="100%" stopColor={`hsl(${hueB} 85% 46%)`} />
            </>
          )}
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hueA} 100% 80%)`} stopOpacity="0.9" />
          <stop offset="100%" stopColor={`hsl(${hueA} 100% 60%)`} stopOpacity="0" />
        </radialGradient>
      </defs>

      {isShadow ? (
        <>
          <motion.g
            animate={idle ? { y: [0, -6, 0] } : undefined}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M ${58 + i * 42} 160 q ${(i - 1) * 10} 22 ${(i - 1) * 4} 34`}
                fill="none"
                stroke={`hsl(${hueA} 40% 22%)`}
                strokeWidth="7"
                strokeLinecap="round"
                animate={idle ? { d: [`M ${58 + i * 42} 160 q ${(i - 1) * 10} 22 ${(i - 1) * 4} 34`, `M ${58 + i * 42} 160 q ${(i - 1) * -10} 26 ${(i - 1) * -4} 38`, `M ${58 + i * 42} 160 q ${(i - 1) * 10} 22 ${(i - 1) * 4} 34`] } : undefined}
                transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            <path d={blobPath(card.seed)} fill={`url(#${gradId})`} stroke={`hsl(${hueA} 30% 8% / 0.6)`} strokeWidth="2" />
            <path
              d={blobPath(card.seed + 3, { r: 26, cx: 128, cy: 60, points: 6, wobble: 0.5 })}
              fill={`hsl(${hueB} 40% 30%)`}
              opacity="0.8"
            />
            <path
              d={blobPath(card.seed + 5, { r: 22, cx: 70, cy: 62, points: 6, wobble: 0.5 })}
              fill={`hsl(${hueB} 40% 30%)`}
              opacity="0.8"
            />
            <motion.g
              style={{ transformOrigin: '100px 100px' }}
              animate={idle ? { scaleY: [1, 1, 0.08, 1, 1] } : undefined}
              transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.82, 0.86, 0.9, 1], ease: 'easeInOut' }}
            >
              <ellipse cx="80" cy="98" rx="10" ry="13" fill="#fdf8ef" />
              <ellipse cx="120" cy="98" rx="10" ry="13" fill="#fdf8ef" />
              <circle cx="83" cy="101" r="4.5" fill="#1a1520" />
              <circle cx="123" cy="101" r="4.5" fill="#1a1520" />
            </motion.g>
            <path d="M 84 134 q 16 10 32 0" fill="none" stroke="#1a1520" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          </motion.g>
        </>
      ) : (
        <>
          <motion.circle
            cx="100"
            cy="100"
            r="92"
            fill={`url(#${glowId})`}
            animate={idle ? { scale: [1, 1.08, 1] } : undefined}
            style={{ transformOrigin: '100px 100px' }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.g
            style={{ transformOrigin: '100px 100px' }}
            animate={idle ? { rotate: 360 } : undefined}
            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={100 + Math.cos(a) * 60}
                  y1={100 + Math.sin(a) * 60}
                  x2={100 + Math.cos(a) * 88}
                  y2={100 + Math.sin(a) * 88}
                  stroke={`hsl(${hueA} 100% 85%)`}
                  strokeWidth={i % 2 ? 2 : 3.5}
                  strokeLinecap="round"
                  opacity="0.7"
                />
              );
            })}
          </motion.g>
          <motion.g
            style={{ transformOrigin: '100px 110px' }}
            animate={idle ? { scale: [1, 1.04, 1] } : undefined}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d={blobPath(card.seed, { r: 56, cx: 100, cy: 108, points: 8, wobble: 0.2 })} fill={`url(#${gradId})`} />
            <path d="M 78 104 q 8 -8 16 0" fill="none" stroke="#3a2a10" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 106 104 q 8 -8 16 0" fill="none" stroke="#3a2a10" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 86 126 q 14 12 28 0" fill="none" stroke="#3a2a10" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          </motion.g>
        </>
      )}
    </svg>
  );
}
