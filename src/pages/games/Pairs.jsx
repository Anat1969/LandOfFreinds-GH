import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card3D from '../../components/Card3D.jsx';
import CardCover from '../../components/CardCover.jsx';
import Setup from './Setup.jsx';
import { CARDS, SHEDIM, getCard } from '../../data/cards.js';
import { sample } from '../../lib/motion.js';
import { useJournal } from '../../lib/store.js';

const TABLE = 4;
const TARGET = 5;

// משחק זוגות: על השולחן שדונים גלויים. בכל תור שולפים כוח קסם, מתאימים אותו לשדון ומנמקים.
// אם המשתתפים מקבלים את ההתאמה, הזוג עובר לשחקן. ראשון לחמישה זוגות מנצח.
function newGame(names) {
  const sheds = sample(SHEDIM, SHEDIM.length).map((c) => c.id);
  return {
    players: names.map((name) => ({ name, pairs: [] })),
    turn: 0,
    table: sheds.slice(0, TABLE),
    shedDeck: sheds.slice(TABLE),
    powerDeck: sample(CARDS, CARDS.length).map((c) => c.id),
    aside: [],
    current: null,
    chosen: null,
    winner: null,
  };
}

export default function Pairs() {
  const [game, setGame] = useState(null);
  const [reason, setReason] = useState('');
  const [hint, setHint] = useState(false);
  const [saved, setSaved] = useState(false);
  const { add } = useJournal();

  if (!game) {
    return (
      <section className="page game-page">
        <header className="page-head">
          <p className="eyebrow">משחק</p>
          <h1>משחק זוגות</h1>
          <p className="lead">
            על השולחן ארבעה שדונים גלויים. בכל תור שולפים כוח קסם, בוחרים שדון שהכוח יכול לעזור מולו, ומסבירים למה.
            אם כולם מסכימים, הזוג שלכם. מי שאוסף {TARGET} זוגות ראשון מנצח.
          </p>
        </header>
        <Setup min={1} max={4} initial={2} onStart={(names) => { setGame(newGame(names)); setSaved(false); }} />
      </section>
    );
  }

  const player = game.players[game.turn];
  const current = game.current ? getCard(game.current) : null;
  const chosen = game.chosen ? getCard(game.chosen) : null;
  const tableCards = game.table.map(getCard);
  const suggested = current ? tableCards.filter((s) => s.powers.includes(current.id)).map((s) => s.id) : [];

  function update(fn) {
    setGame((g) => fn(structuredClone(g)));
  }

  function nextTurn(g) {
    g.turn = (g.turn + 1) % g.players.length;
    g.current = null;
    g.chosen = null;
    return g;
  }

  function finishIfOver(g) {
    const noPowers = g.powerDeck.length === 0 && g.aside.length === 0 && !g.current;
    if (g.table.length === 0 || noPowers) {
      const best = Math.max(...g.players.map((p) => p.pairs.length));
      g.winner = g.players.filter((p) => p.pairs.length === best).map((p) => p.name);
    }
    return g;
  }

  function draw() {
    update((g) => {
      if (g.powerDeck.length === 0) {
        g.powerDeck = sample(g.aside, g.aside.length);
        g.aside = [];
      }
      g.current = g.powerDeck.pop() ?? null;
      return finishIfOver(g);
    });
    setHint(false);
  }

  function takeAside() {
    update((g) => {
      g.current = g.aside.pop() ?? null;
      return g;
    });
    setHint(false);
  }

  function accept() {
    update((g) => {
      const p = g.players[g.turn];
      p.pairs.push([g.chosen, g.current]);
      const idx = g.table.indexOf(g.chosen);
      const next = g.shedDeck.pop();
      if (next) g.table[idx] = next;
      else g.table.splice(idx, 1);
      if (p.pairs.length >= TARGET) {
        g.winner = [p.name];
        g.current = null;
        g.chosen = null;
        return g;
      }
      return finishIfOver(nextTurn(g));
    });
    setReason('');
  }

  function putAside() {
    update((g) => {
      g.aside.push(g.current);
      return finishIfOver(nextTurn(g));
    });
    setReason('');
  }

  function saveGame() {
    game.players.forEach((p) => {
      if (p.pairs.length) add({ mode: 'pairs', cards: p.pairs.flat(), text: `הזוגות של ${p.name} במשחק הזוגות` });
    });
    setSaved(true);
  }

  return (
    <section className="page game-page">
      <header className="game-head">
        <h1>משחק זוגות</h1>
        <div className="scoreboard" aria-label="ניקוד">
          {game.players.map((p, i) => (
            <div key={i} className={i === game.turn && !game.winner ? 'score active' : 'score'}>
              <span className="score-name">{p.name}</span>
              <span className="score-num">{p.pairs.length}</span>
              <span className="score-of">מתוך {TARGET}</span>
            </div>
          ))}
        </div>
      </header>

      {game.winner ? (
        <motion.div className="winner" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <p className="eyebrow">סוף המשחק</p>
          <h2>{game.winner.length > 1 ? `תיקו בין ${game.winner.join(' ו')}` : `הניצחון הולך ל${game.winner[0]}`}</h2>
          {game.players.map((p, i) => (
            <div key={i} className="pairs-of">
              <h3>{p.name}</h3>
              <div className="pairs-list">
                {p.pairs.map(([s, c]) => (
                  <div key={s + c} className="pair-mini">
                    <Card3D card={getCard(s)} size="xs" interactive={false} />
                    <Card3D card={getCard(c)} size="xs" interactive={false} />
                  </div>
                ))}
                {!p.pairs.length && <p className="hint">אין זוגות הפעם</p>}
              </div>
            </div>
          ))}
          <div className="cta-row center">
            <button type="button" className="btn btn--primary" onClick={() => { setGame(newGame(game.players.map((p) => p.name))); setSaved(false); }}>משחק חדש</button>
            <button type="button" className="btn" onClick={saveGame} disabled={saved}>{saved ? 'נשמר ביומן' : 'שמירת הזוגות ביומן'}</button>
            <button type="button" className="btn" onClick={() => setGame(null)}>שינוי משתתפים</button>
          </div>
        </motion.div>
      ) : (
        <>
          <p className="turn-line">
            התור של <strong>{player.name}</strong>.{' '}
            {!current ? 'שולפים כוח קסם, או לוקחים את הכוח שהונח בצד.' : !chosen ? 'בוחרים שדון על השולחן שהכוח יכול לעזור מולו.' : 'מסבירים לכולם למה הכוח עוזר מול השדון, ומחליטים יחד.'}
          </p>

          <div className="pairs-table">
            <div className="pairs-sheds">
              <span className="slot-label">שדונים על השולחן</span>
              <div className="pairs-row">
                <AnimatePresence>
                  {tableCards.map((s) => (
                    <motion.div key={s.id} layout initial={{ opacity: 0, y: -30, rotateY: -90 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} exit={{ opacity: 0, scale: 0.6 }}
                      className={`pairs-shed${chosen?.id === s.id ? ' chosen' : ''}${hint && suggested.includes(s.id) ? ' hinted' : ''}`}>
                      <Card3D card={s} size="sm" onClick={current ? () => update((g) => { g.chosen = s.id; return g; }) : undefined}
                        label={current ? `התאמת ${current.name} ל${s.name}` : undefined} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="pairs-hand">
              <div className="piles">
                <button type="button" className="pile" onClick={draw} disabled={!!current} aria-label="שליפת כוח קסם">
                  <CardCover deck="power" />
                  <span className="pile-count">{game.powerDeck.length}</span>
                </button>
                <button type="button" className="pile pile--aside" onClick={takeAside} disabled={!!current || !game.aside.length} aria-label="לקיחת כוח מהצד">
                  {game.aside.length ? <Card3D card={getCard(game.aside[game.aside.length - 1])} size="xs" interactive={false} /> : <span className="pile-empty">בצד</span>}
                  <span className="pile-count">{game.aside.length}</span>
                </button>
              </div>
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div key={current.id} className="hand-card" initial={{ opacity: 0, y: 40, rotateY: 180 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7 }}>
                    <Card3D card={current} size="md" live />
                  </motion.div>
                )}
              </AnimatePresence>
              {current && !chosen && (
                <div className="cta-row center">
                  <button type="button" className="btn" onClick={() => setHint((v) => !v)}>{hint ? 'הסתרת הרמז' : 'רמז'}</button>
                  <button type="button" className="btn" onClick={putAside}>אין התאמה, להניח בצד</button>
                </div>
              )}
              {hint && current && !chosen && (
                <p className="hint center">{suggested.length ? 'השדונים המודגשים מתאימים במיוחד לכוח הזה.' : 'אין התאמה מומלצת על השולחן. אפשר לנמק התאמה אחרת, או להניח בצד.'}</p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {chosen && current && (
              <motion.div className="verdict" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <h2>{current.name} מול {chosen.name}</h2>
                <p className="hint">{chosen.name} לוחש: "{chosen.whisper}"</p>
                <label className="field">
                  <span>למה הכוח הזה עוזר מול השדון הזה?</span>
                  <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="אפשר גם רק להגיד בקול" />
                </label>
                <div className="cta-row">
                  <button type="button" className="btn btn--primary" onClick={accept}>ההתאמה מתקבלת</button>
                  <button type="button" className="btn" onClick={() => update((g) => { g.chosen = null; return g; })}>לבחור שדון אחר</button>
                  <button type="button" className="btn" onClick={putAside}>להניח בצד</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}
