import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Creature from './Creature.jsx';
import { DECK_LABELS } from '../data/cards.js';

// קלף תלת־ממדי: נטייה לפי מיקום העכבר, והיפוך מלא בין הצד הקדמי (יצור) לגב (משפט).
export default function Card3D({ card, flipped = false, onClick, size = 'md', interactive = true }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 180, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 });

  function onPointerMove(event) {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  const back = card.deck === 'shadow' ? card.whisper : card.gift;
  const deckName = DECK_LABELS[card.deck];

  return (
    <div
      ref={ref}
      className={`scene scene--${size}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <motion.div className="card3d" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <motion.div
          className="flipper"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={`face front deck-${card.deck}`} style={{ '--hue': card.hue }}>
            <div className="card-top">
              <span className="tag">{deckName}</span>
            </div>
            <div className="art">
              <Creature card={card} />
            </div>
            <h3 className="card-name">{card.name}</h3>
          </div>
          <div className={`face back deck-${card.deck}`} style={{ '--hue': card.hue }}>
            <div className="card-top">
              <span className="tag">{card.name}</span>
            </div>
            <p className="card-back-text">{back}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
