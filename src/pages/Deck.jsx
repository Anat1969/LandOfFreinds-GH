import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import { DECKS, deckOf, getCard } from '../data/cards.js';
import { go } from '../lib/router.js';

// כל החפיסה בגריד. לחיצה פותחת את הקלף בגדול, מתחת לסרגל העליון, והכתובת שומרת איזה קלף פתוח.
const TABS = ['power', 'shed', 'all'];
const TAB_LABEL = { power: 'כוחות קסם', shed: 'שדונים', all: 'הכול' };

export default function Deck({ params }) {
  const tab = TABS.includes(params.deck) ? params.deck : (params.card && getCard(params.card)?.deck) || 'power';
  const CARDS = deckOf(tab);
  const open = params.card ? getCard(params.card) : null;
  const [flipped, setFlipped] = useState(false);
  const index = open ? CARDS.indexOf(open) : -1;
  const base = `/deck?deck=${tab}`;

  useEffect(() => setFlipped(false), [params.card]);

  function show(i) {
    const n = CARDS.length;
    go(`${base}&card=${CARDS[(i + n) % n].id}`);
  }

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') go(base);
      if (e.key === 'ArrowLeft') show(index + 1);
      if (e.key === 'ArrowRight') show(index - 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <section className="page deck">
      <header className="page-head">
        <p className="eyebrow">החפיסות</p>
        <h1>{tab === 'shed' ? `${CARDS.length} שדונים` : tab === 'power' ? `${CARDS.length} כוחות קסם` : `${CARDS.length} קלפים`}</h1>
        <p className="lead">
          {tab === 'shed'
            ? 'כל שדון הוא דפוס או רגש שמנסה לנהל אותנו. כשנותנים לו שם ופנים, אפשר לדבר איתו.'
            : 'כל כוח קסם הוא משאב פנימי שעוזר מול השדונים. מעבירים את הסמן כדי להעיר קלף, ולוחצים כדי לפתוח.'}
        </p>
      </header>

      <div className="filter-row" role="tablist" aria-label="בחירת חפיסה">
        {TABS.map((t) => (
          <a key={t} role="tab" aria-selected={tab === t} href={`#/deck?deck=${t}`} className={tab === t ? 'filter active' : 'filter'}>
            {TAB_LABEL[t]}
          </a>
        ))}
      </div>

      <div className="deck-grid">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
          >
            <Card3D card={card} size="sm" onClick={() => go(`${base}&card=${card.id}`)} label={`פתיחת ${card.name}`} />
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
            onClick={(e) => e.target === e.currentTarget && go(base)}
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
                <p className="eyebrow">{DECKS[open.deck].one} · {index >= 0 ? `${index + 1} מתוך ${CARDS.length}` : ''}</p>
                <h2>{open.name}</h2>
                {open.sub && <p className="viewer-sub">{open.sub}</p>}
                <p className="viewer-line">{open.deck === 'shed' ? `"${open.whisper}"` : open.line}</p>
                <div className="viewer-block">
                  <span className="viewer-label">שאלה</span>
                  <p>{open.question}</p>
                </div>
                {open.deck === 'shed' ? (
                  <div className="viewer-block">
                    <span className="viewer-label">כוחות קסם שעוזרים מולו</span>
                    <p className="viewer-links">
                      {open.powers.map((id) => (
                        <a key={id} href={`#/deck?deck=power&card=${id}`}>{getCard(id)?.name}</a>
                      ))}
                    </p>
                  </div>
                ) : (
                  <div className="viewer-block">
                    <span className="viewer-label">לנסות</span>
                    <p>{open.practice}</p>
                  </div>
                )}
                {open.deck === 'shed' && (
                  <a className="btn" href={`#/games/id?shed=${open.id}`}>תעודת זהות לשדון</a>
                )}
                <div className="cta-row">
                  <button type="button" className="btn" onClick={() => show(index - 1)}>הקודם</button>
                  <button type="button" className="btn" onClick={() => show(index + 1)}>הבא</button>
                  <button type="button" className="btn" onClick={() => setFlipped((v) => !v)}>הפיכה</button>
                  <button type="button" className="btn btn--primary" onClick={() => go(base)}>סגירה</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
