import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import CardArt from './CardArt.jsx';

// קלף תלת־ממדי: נטייה לפי הסמן, שכבות איור בעומקים שונים (פרלקסה), ברק נייר, והיפוך לגב עם המשמעות.
export default function Card3D({ card, flipped = false, onClick, size = 'md', interactive = true, live = false, label }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 160, damping: 17 };
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), spring);
  const gx = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(my, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`;

  function onPointerMove(event) {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    mx.set(0);
    my.set(0);
    setHover(false);
  }

  const isLive = live || hover;

  return (
    <div
      ref={ref}
      className={`scene scene--${size}${isLive ? ' is-live' : ''}`}
      onPointerMove={onPointerMove}
      onPointerEnter={() => interactive && setHover(true)}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? label ?? `${card.name}${flipped ? ', הצד האחורי' : ''}` : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <motion.div className="card3d" style={{ rotateX, rotateY }}>
        <motion.div
          className="flipper"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="face front">
            <CardArt card={card} />
            <div className="card-title">
              <h3>{card.name}</h3>
              {card.sub && <p>({card.sub})</p>}
            </div>
            <motion.div className="glare" style={{ background: glare }} />
          </div>

          <div className="face back">
            <div className="back-wash" style={{ '--c1': card.sky[0], '--c2': card.sky[1] }}>
              <h3>{card.name}</h3>
            </div>
            <div className="back-body">
              <p className="back-line">{card.line}</p>
              <div className="back-block">
                <span className="back-label">שאלה</span>
                <p>{card.question}</p>
              </div>
              <div className="back-block">
                <span className="back-label">לנסות</span>
                <p>{card.practice}</p>
              </div>
            </div>
            <motion.div className="glare" style={{ background: glare }} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
