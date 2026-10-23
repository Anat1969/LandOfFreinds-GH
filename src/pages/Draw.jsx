import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import CardCover from '../components/CardCover.jsx';
import { CARDS, SPREAD_THREE, getCard } from '../data/cards.js';
import { go } from '../lib/router.js';
import { useJournal } from '../lib/store.js';
import { sample, useReducedMotion } from '../lib/motion.js';

const MODES = [
  { key: 'one', label: 'קלף אחד', need: 1 },
  { key: 'pick', label: 'בחירה מהמניפה', need: 1 },
  { key: 'three', label: 'פריסת שלושה', need: 3 },
];
const FAN_SIZE = 7;

// חפיסה סגורה בתלת־ממד. בזמן ערבוב הקלפים נחצים לשני צדדים ומשתלבים בחזרה.
function DeckStack({ shuffling }) {
  return (
    <div className="deck-stack" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => {
        const side = i % 2 ? 1 : -1;
        return (
          <motion.div
            key={i}
            className="deck-card"
            style={{ zIndex: i }}
            initial={false}
            animate={
              shuffling
                ? {
                    x: [0, side * 120, side * 120, 0, side * -40, 0],
                    y: [-i * 2.4, -i * 2.4 - 18, -i * 2.4 - 18, -i * 2.4, -i * 2.4 - 8, -i * 2.4],
                    rotateZ: [0, side * 10, side * 6, 0, side * -4, (i - 4) * 0.6],
                  }
                : { x: 0, y: -i * 2.4, rotateZ: (i - 4) * 0.6 }
            }
            transition={{ duration: 1.4, delay: shuffling ? (i % 2) * 0.05 + i * 0.02 : 0, ease: 'easeInOut' }}
          >
            <CardCover />
          </motion.div>
        );
      })}
    </div>
  );
}

function Fan({ cards, onPick }) {
  const mid = (cards.length - 1) / 2;
  return (
    <div className="fan-pick">
      {cards.map((card, i) => {
        const offset = i - mid;
        return (
          <motion.button
            type="button"
            key={card.id}
            className="fan-cover"
            aria-label={`קלף סגור ${i + 1}`}
            style={{ zIndex: i }}
            initial={{ opacity: 0, y: 80, rotateZ: 0, x: '-50%' }}
            animate={{ opacity: 1, y: Math.abs(offset) * 10, rotateZ: offset * 9, x: `calc(-50% + ${offset * 34}%)` }}
            whileHover={{ y: Math.abs(offset) * 10 - 34, scale: 1.04 }}
            whileFocus={{ y: Math.abs(offset) * 10 - 34, scale: 1.04 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={() => onPick(card)}
          >
            <CardCover />
          </motion.button>
        );
      })}
    </div>
  );
}

export default function Draw({ params }) {
  const mode = MODES.find((m) => m.key === params.mode) ?? MODES[0];
  const dealtCards = (params.cards ?? '').split(',').map(getCard).filter(Boolean);
  const dealt = dealtCards.length === mode.need ? dealtCards : null;
  const reduce = useReducedMotion();

  const [shuffling, setShuffling] = useState(false);
  const [fan, setFan] = useState(() => sample(CARDS, FAN_SIZE));
  const [fanKey, setFanKey] = useState(0);
  const [fresh, setFresh] = useState(false);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const { add } = useJournal();

  function route(modeKey, ids) {
    go(`/draw?mode=${modeKey}${ids ? `&cards=${ids.join(',')}` : ''}`);
  }

  function shuffleAndDeal() {
    if (shuffling) return;
    setShuffling(true);
    setTimeout(() => {
      setShuffling(false);
      setFresh(true);
      setFlipped({});
      setSaved(false);
      route(mode.key, sample(CARDS, mode.need).map((c) => c.id));
    }, reduce ? 60 : 1500);
  }

  function pick(card) {
    setFresh(true);
    setFlipped({});
    setSaved(false);
    route('pick', [card.id]);
  }

  function again() {
    setFan(sample(CARDS, FAN_SIZE));
    setFanKey((k) => k + 1);
    setText('');
    setSaved(false);
    route(mode.key);
  }

  function save() {
    add({ mode: mode.key, cards: dealt.map((c) => c.id), text: text.trim() });
    setText('');
    setSaved(true);
  }

  return (
    <section className="page draw">
      <header className="page-head">
        <p className="eyebrow">שליפה</p>
        <h1>{mode.label}</h1>
        <p className="lead">
          {mode.key === 'pick'
            ? 'הקלפים פרושים הפוכים. בוחרים אחד לפי תחושה.'
            : mode.key === 'three'
              ? 'שלושה קלפים, שלוש עמדות: כוח שכבר יש בי, כוח שאפשר לחזק, וכוח לדרך.'
              : 'מערבבים את החפיסה ושולפים קלף אחד. לחיצה על הקלף הופכת אותו לשאלה ולתרגול.'}
        </p>
      </header>

      <div className="filter-row" role="tablist" aria-label="סוג שליפה">
        {MODES.map((m) => (
          <a key={m.key} role="tab" aria-selected={mode.key === m.key} href={`#/draw?mode=${m.key}`}
            className={mode.key === m.key ? 'filter active' : 'filter'}>
            {m.label}
          </a>
        ))}
      </div>

      <div className={`table${dealt ? ' table--dealt' : ''}`}>
        <AnimatePresence mode="wait">
          {dealt ? (
            <motion.div key={`dealt-${dealt.map((c) => c.id).join('-')}`} className={`slots slots--${dealt.length}`}
              initial={{ opacity: 1 }} exit={{ opacity: 0, y: 20 }}>
              {dealt.map((card, i) => (
                <div key={card.id} className="slot">
                  {mode.key === 'three' && <span className="slot-label">{SPREAD_THREE[i].label}</span>}
                  <motion.div
                    className="slot-card"
                    initial={fresh && !reduce ? { opacity: 0, y: -140, rotateY: -180, scale: 0.7 } : { opacity: 0 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                    transition={{ duration: 1, delay: fresh ? i * 0.28 : 0, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Card3D card={card} size={dealt.length === 3 ? 'md' : 'lg'} live
                      flipped={!!flipped[card.id]} onClick={() => setFlipped((f) => ({ ...f, [card.id]: !f[card.id] }))} />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          ) : mode.key === 'pick' ? (
            <motion.div key={`fan-${fanKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Fan cards={fan} onPick={pick} />
            </motion.div>
          ) : (
            <motion.div key="stack" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <DeckStack shuffling={shuffling} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="cta-row center">
        {dealt ? (
          <>
            <button type="button" className="btn btn--primary" onClick={again}>שליפה חדשה</button>
            <button type="button" className="btn" onClick={() => setFlipped(Object.fromEntries(dealt.map((c) => [c.id, !flipped[dealt[0].id]])))}>
              הפיכת {dealt.length === 1 ? 'הקלף' : 'הקלפים'}
            </button>
            {dealt.length === 1 && <a className="btn" href={`#/deck?card=${dealt[0].id}`}>הקלף בחפיסה</a>}
          </>
        ) : mode.key === 'pick' ? (
          <button type="button" className="btn" onClick={again}>ערבוב המניפה</button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={shuffleAndDeal} disabled={shuffling}>
            {shuffling ? 'מערבבים' : 'ערבוב ושליפה'}
          </button>
        )}
      </div>

      {dealt && (
        <motion.div className="reflect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="reflect-qs">
            {dealt.map((card, i) => (
              <p key={card.id}>
                <strong>{mode.key === 'three' ? `${SPREAD_THREE[i].label}: ` : ''}{card.name}.</strong> {card.question}
              </p>
            ))}
          </div>
          <label className="field">
            <span>מה הקלף מעורר בי?</span>
            <textarea rows={4} value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} placeholder="כמה מילים מספיקות" />
          </label>
          <div className="cta-row">
            <button type="button" className="btn btn--primary" onClick={save}>שמירה ביומן</button>
            {saved && <span className="saved" role="status">נשמר ביומן</span>}
            <a className="btn" href="#/journal">ליומן</a>
          </div>
        </motion.div>
      )}
    </section>
  );
}
