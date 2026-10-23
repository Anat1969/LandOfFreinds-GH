import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import CardCover from '../components/CardCover.jsx';
import { CARDS, SHEDIM, SPREAD_THREE, getCard } from '../data/cards.js';
import { go } from '../lib/router.js';
import { useJournal } from '../lib/store.js';
import { sample, useReducedMotion } from '../lib/motion.js';

// מצבי שליפה. deck קובע מאיזו חפיסה שולפים; duo שולף שדון ואז בוחרים כוח קסם מולו.
const MODES = [
  { key: 'shed', label: 'איזה שדון מנהל אותי?', deck: 'shed', need: 1, pick: true, lead: 'שבעה שדונים הפוכים במניפה. בוחרים אחד בלי לחשוב יותר מדי, ופוגשים את השדון שמנהל אותי עכשיו.' },
  { key: 'duo', label: 'שדון וכוח', deck: 'shed', need: 2, lead: 'שולפים שדון, ואז בוחרים כוח קסם שיכול לעזור מולו. כדאי לנמק למה דווקא הכוח הזה.' },
  { key: 'one', label: 'כוח קסם אחד', deck: 'power', need: 1, lead: 'מערבבים את חפיסת כוחות הקסם ושולפים קלף. לחיצה על הקלף הופכת אותו לשאלה ולתרגול.' },
  { key: 'pick', label: 'כוח מהמניפה', deck: 'power', need: 1, pick: true, lead: 'שבעה כוחות קסם הפוכים. בוחרים אחד לפי תחושה.' },
  { key: 'three', label: 'פריסת שלושה כוחות', deck: 'power', need: 3, lead: 'שלושה כוחות בשלוש עמדות: כוח שכבר יש בי, כוח שאפשר לחזק, וכוח לדרך.' },
];
const FAN_SIZE = 7;

function DeckStack({ shuffling, deck }) {
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
            <CardCover deck={deck} />
          </motion.div>
        );
      })}
    </div>
  );
}

function Fan({ cards, deck, onPick }) {
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
            <CardCover deck={deck} />
          </motion.button>
        );
      })}
    </div>
  );
}

export default function Draw({ params }) {
  const mode = MODES.find((m) => m.key === params.mode) ?? MODES[0];
  const pool = mode.deck === 'shed' ? SHEDIM : CARDS;
  const ids = (params.cards ?? '').split(',').map(getCard).filter(Boolean);
  const dealt = ids.length === mode.need ? ids : null;
  const duoShed = mode.key === 'duo' && ids.length === 1 && ids[0].deck === 'shed' ? ids[0] : null;
  const reduce = useReducedMotion();

  const [shuffling, setShuffling] = useState(false);
  const [fan, setFan] = useState(() => sample(pool, FAN_SIZE));
  const [fanKey, setFanKey] = useState(0);
  const [fresh, setFresh] = useState(false);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const { add } = useJournal();

  useEffect(() => {
    setFan(sample(pool, FAN_SIZE));
  }, [pool]);

  function route(modeKey, list) {
    go(`/draw?mode=${modeKey}${list ? `&cards=${list.join(',')}` : ''}`);
  }

  function shuffleAndDeal() {
    if (shuffling) return;
    setShuffling(true);
    setTimeout(() => {
      setShuffling(false);
      setFresh(true);
      setFlipped({});
      setSaved(false);
      const need = mode.key === 'duo' ? 1 : mode.need;
      route(mode.key, sample(pool, need).map((c) => c.id));
    }, reduce ? 60 : 1500);
  }

  function pick(card) {
    setFresh(true);
    setFlipped({});
    setSaved(false);
    route(mode.key, [card.id]);
  }

  function choosePower(power) {
    setFresh(true);
    route('duo', [duoShed.id, power.id]);
  }

  function again() {
    setFan(sample(pool, FAN_SIZE));
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

  const shown = dealt ?? (duoShed ? [duoShed] : null);
  const label = (card, i) =>
    mode.key === 'three' ? SPREAD_THREE[i].label : mode.key === 'duo' ? (card.deck === 'shed' ? 'השדון' : 'כוח הקסם') : null;

  return (
    <section className="page draw">
      <header className="page-head">
        <p className="eyebrow">שליפה</p>
        <h1>{mode.label}</h1>
        <p className="lead">{mode.lead}</p>
      </header>

      <div className="filter-row" role="tablist" aria-label="סוג שליפה">
        {MODES.map((m) => (
          <a key={m.key} role="tab" aria-selected={mode.key === m.key} href={`#/draw?mode=${m.key}`}
            className={`${mode.key === m.key ? 'filter active' : 'filter'} filter--${m.deck}`}>
            {m.label}
          </a>
        ))}
      </div>

      <div className={`table${shown ? ' table--dealt' : ''}`}>
        <AnimatePresence mode="wait">
          {shown ? (
            <motion.div key={`dealt-${shown.map((c) => c.id).join('-')}`} className={`slots slots--${shown.length}`}
              initial={{ opacity: 1 }} exit={{ opacity: 0, y: 20 }}>
              {shown.map((card, i) => (
                <div key={card.id} className="slot">
                  {label(card, i) && <span className="slot-label">{label(card, i)}</span>}
                  <motion.div
                    className="slot-card"
                    initial={fresh && !reduce ? { opacity: 0, y: -140, rotateY: -180, scale: 0.7 } : { opacity: 0 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                    transition={{ duration: 1, delay: fresh ? i * 0.28 : 0, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Card3D card={card} size={shown.length === 3 ? 'md' : shown.length === 2 ? 'md' : 'lg'} live
                      flipped={!!flipped[card.id]} onClick={() => setFlipped((f) => ({ ...f, [card.id]: !f[card.id] }))} />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          ) : mode.pick ? (
            <motion.div key={`fan-${mode.key}-${fanKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Fan cards={fan[0]?.deck === mode.deck ? fan : []} deck={mode.deck} onPick={pick} />
            </motion.div>
          ) : (
            <motion.div key={`stack-${mode.deck}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <DeckStack shuffling={shuffling} deck={mode.deck} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {duoShed && (
        <motion.div className="duo-choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2>איזה כוח קסם יעזור מול {duoShed.name}?</h2>
          <p className="hint">אלה כוחות שמתאימים במיוחד. אפשר גם לבחור כוח אחר מהחפיסה.</p>
          <div className="duo-row">
            {duoShed.powers.map(getCard).map((p) => (
              <button key={p.id} type="button" className="duo-option" onClick={() => choosePower(p)} aria-label={`בחירת ${p.name}`}>
                <Card3D card={p} size="sm" />
              </button>
            ))}
            <button type="button" className="duo-option duo-option--random" onClick={() => choosePower(sample(CARDS, 1)[0])}>
              <CardCover deck="power" />
              <span>כוח אקראי</span>
            </button>
          </div>
        </motion.div>
      )}

      <div className="cta-row center">
        {shown ? (
          <>
            <button type="button" className="btn btn--primary" onClick={again}>שליפה חדשה</button>
            <button type="button" className="btn" onClick={() => setFlipped(Object.fromEntries(shown.map((c) => [c.id, !flipped[shown[0].id]])))}>
              הפיכת {shown.length === 1 ? 'הקלף' : 'הקלפים'}
            </button>
            {shown.length === 1 && shown[0].deck === 'shed' && (
              <a className="btn" href={`#/games/id?shed=${shown[0].id}`}>תעודת זהות לשדון</a>
            )}
          </>
        ) : mode.pick ? (
          <button type="button" className="btn" onClick={again}>ערבוב המניפה</button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={shuffleAndDeal} disabled={shuffling}>
            {shuffling ? 'מערבבים' : mode.key === 'duo' ? 'שליפת שדון' : 'ערבוב ושליפה'}
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
            <span>{mode.key === 'duo' ? 'למה הכוח הזה עוזר מול השדון הזה?' : 'מה הקלף מעורר בי?'}</span>
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
