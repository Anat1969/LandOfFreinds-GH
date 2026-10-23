import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import { CARDS, getCard } from '../data/cards.js';
import { go } from '../lib/router.js';

// כל החפיסה בגריד. לחיצה פותחת את הקלף בגדול, מתחת לסרגל העליון, והכתובת שומרת איזה קלף פתוח.
export default function Deck({ params }) {
  const open = params.card ? getCard(params.card) : null;
  const [flipped, setFlipped] = useState(false);
  const index = open ? CARDS.indexOf(open) : -1;

  useEffect(() => setFlipped(false), [params.card]);

  function show(i) {
    const n = CARDS.length;
    go(`/deck?card=${CARDS[(i + n) % n].id}`);
  }

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') go('/deck');
      if (e.key === 'ArrowLeft') show(index + 1);
      if (e.key === 'ArrowRight') show(index - 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <section className="page deck">
      <header className="page-head">
        <p className="eyebrow">החפיסה</p>
        <h1>{CARDS.length} כוחות</h1>
        <p className="lead">מעבירים את הסמן מעל קלף כדי להעיר אותו. לחיצה פותחת אותו בגדול, ולחיצה נוספת הופכת אותו.</p>
      </header>

      <div className="deck-grid">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
          >
            <Card3D card={card} size="sm" onClick={() => go(`/deck?card=${card.id}`)} label={`פתיחת ${card.name}`} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="viewer"
            role="dialog"
            aria-modal="true"
            aria-label={open.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && go('/deck')}
          >
            <div className="viewer-inner">
              <motion.div
                key={open.id}
                className="viewer-card"
                initial={{ opacity: 0, scale: 0.85, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Card3D card={open} size="xl" live flipped={flipped} onClick={() => setFlipped((v) => !v)} />
              </motion.div>

              <div className="viewer-text">
                <p className="eyebrow">קלף {index + 1} מתוך {CARDS.length}</p>
                <h2>{open.name}</h2>
                {open.sub && <p className="viewer-sub">{open.sub}</p>}
                <p className="viewer-line">{open.line}</p>
                <div className="viewer-block">
                  <span className="viewer-label">שאלה</span>
                  <p>{open.question}</p>
                </div>
                <div className="viewer-block">
                  <span className="viewer-label">לנסות</span>
                  <p>{open.practice}</p>
                </div>
                <div className="cta-row">
                  <button type="button" className="btn" onClick={() => show(index - 1)}>הקודם</button>
                  <button type="button" className="btn" onClick={() => show(index + 1)}>הבא</button>
                  <button type="button" className="btn" onClick={() => setFlipped((v) => !v)}>הפיכה</button>
                  <button type="button" className="btn btn--primary" onClick={() => go('/deck')}>סגירה</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
