import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import { cardsForDeck, DECK_LABELS } from '../data/cards.js';

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const DECKS = ['all', 'shadow', 'light'];

export default function Draw({ params }) {
  const deck = DECKS.includes(params.deck) ? params.deck : 'all';
  const pool = useMemo(() => cardsForDeck(deck), [deck]);
  const [order, setOrder] = useState(() => shuffle(pool));
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(shuffle(pool));
    setIndex(0);
    setCurrent(null);
    setFlipped(false);
  }, [pool]);

  function draw() {
    if (order.length === 0) return;
    let nextOrder = order;
    let nextIndex = index;
    if (nextIndex >= nextOrder.length) {
      nextOrder = shuffle(pool);
      nextIndex = 0;
      setOrder(nextOrder);
    }
    setCurrent(nextOrder[nextIndex]);
    setIndex(nextIndex + 1);
    setFlipped(false);
  }

  return (
    <section className="page draw">
      <header className="page-head">
        <p className="eyebrow">הגרלה</p>
        <h1>שליפת קלף</h1>
        <p className="lead">שולפים קלף, מסתכלים על היצור, ואז הופכים אותו כדי לקרוא את המשפט שעל הגב.</p>
      </header>

      <div className="filter-row" role="tablist" aria-label="בחירת חפיסה">
        {DECKS.map((d) => (
          <a
            key={d}
            role="tab"
            aria-selected={deck === d}
            href={`#/draw?deck=${d}`}
            className={deck === d ? 'filter active' : 'filter'}
          >
            {DECK_LABELS[d]}
          </a>
        ))}
      </div>

      <div className="stage">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.id + index}
              className="stage-card"
              initial={{ opacity: 0, rotateY: -90, y: 30 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Card3D card={current} flipped={flipped} onClick={() => setFlipped((v) => !v)} size="lg" />
            </motion.div>
          ) : (
            <motion.div
              key="covers"
              className="covers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className={`cover cover--${i}`} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="cta-row center">
        <button type="button" className="btn btn--primary" onClick={draw}>
          {current ? 'קלף נוסף' : 'שליפת קלף'}
        </button>
        {current && (
          <>
            <button type="button" className="btn" onClick={() => setFlipped((v) => !v)}>
              הפיכת הקלף
            </button>
            <a className="btn" href={`#/pair?${current.deck === 'shadow' ? `s=${current.id}` : `l=${current.id}`}`}>
              לצימוד עם הקלף הזה
            </a>
          </>
        )}
      </div>
    </section>
  );
}
