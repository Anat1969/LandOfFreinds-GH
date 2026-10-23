import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card3D from '../../components/Card3D.jsx';
import CardCover from '../../components/CardCover.jsx';
import Setup from './Setup.jsx';
import { CARDS, SHEDIM, getCard } from '../../data/cards.js';
import { sample } from '../../lib/motion.js';

// משחק מלחמה: החפיסה מתחלקת לשתי ערימות הפוכות. כל אחד פותח קלף, מנמק למה הקלף שלו חזק יותר במצב הזה,
// ויחד מחליטים. מי שקלפו נבחר לוקח את שני הקלפים. בתיקו הקלפים מחכים לסיבוב הבא.
function newGame(names, deck) {
  const ids = sample(deck === 'shed' ? SHEDIM : CARDS, deck === 'shed' ? SHEDIM.length : CARDS.length).map((c) => c.id);
  const half = Math.floor(ids.length / 2);
  return { names, deck, piles: [ids.slice(0, half), ids.slice(half, half * 2)], won: [0, 0], pot: 0, open: null, round: 1 };
}

export default function War() {
  const [deck, setDeck] = useState('power');
  const [game, setGame] = useState(null);

  if (!game) {
    return (
      <section className="page game-page">
        <header className="page-head">
          <p className="eyebrow">משחק</p>
          <h1>משחק מלחמה</h1>
          <p className="lead">
            כל משתתף פותח קלף מהערימה שלו. כל אחד מסביר מה המשמעות של הקלף ולמה הוא חזק יותר במצב הזה. מחליטים יחד, והקלפים
            עוברים למי ששכנע.
          </p>
        </header>
        <Setup min={2} max={2} initial={2} onStart={(names) => setGame(newGame(names, deck))}>
          <div className="setup-row">
            <span className="setup-label">משחקים עם</span>
            <div className="filter-row">
              {[['power', 'כוחות קסם'], ['shed', 'שדונים']].map(([k, l]) => (
                <button key={k} type="button" className={deck === k ? 'filter active' : 'filter'} onClick={() => setDeck(k)} aria-pressed={deck === k}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </Setup>
      </section>
    );
  }

  const over = game.piles[0].length === 0 && !game.open;

  function flip() {
    setGame((g) => ({ ...g, open: [g.piles[0].at(-1), g.piles[1].at(-1)], piles: [g.piles[0].slice(0, -1), g.piles[1].slice(0, -1)] }));
  }

  function decide(who) {
    setGame((g) => {
      const won = [...g.won];
      let pot = g.pot + 2;
      if (who !== null) {
        won[who] += pot;
        pot = 0;
      }
      return { ...g, won, pot, open: null, round: g.round + 1 };
    });
  }

  const best = game.won[0] === game.won[1] ? null : game.won[0] > game.won[1] ? 0 : 1;

  return (
    <section className="page game-page">
      <header className="game-head">
        <h1>משחק מלחמה</h1>
        <div className="scoreboard">
          {game.names.map((n, i) => (
            <div key={i} className="score">
              <span className="score-name">{n}</span>
              <span className="score-num">{game.won[i]}</span>
              <span className="score-of">קלפים · נשארו {game.piles[i].length}</span>
            </div>
          ))}
        </div>
      </header>

      {over ? (
        <motion.div className="winner" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <p className="eyebrow">סוף המשחק</p>
          <h2>{best === null ? 'תיקו' : `הניצחון הולך ל${game.names[best]}`}</h2>
          <p className="hint">{game.won[0]} מול {game.won[1]} קלפים</p>
          <div className="cta-row center">
            <button type="button" className="btn btn--primary" onClick={() => setGame(newGame(game.names, game.deck))}>משחק חדש</button>
            <button type="button" className="btn" onClick={() => setGame(null)}>שינוי הגדרות</button>
          </div>
        </motion.div>
      ) : (
        <>
          <p className="turn-line">סיבוב {game.round}{game.pot ? ` · ממתינים ${game.pot} קלפים מהתיקו` : ''}</p>
          <div className="war-table">
            {[0, 1].map((i) => (
              <div key={i} className="war-side">
                <span className="slot-label">{game.names[i]}</span>
                <AnimatePresence mode="wait">
                  {game.open ? (
                    <motion.div key={game.open[i]} initial={{ rotateY: 180, opacity: 0, y: -40 }} animate={{ rotateY: 0, opacity: 1, y: 0 }} exit={{ opacity: 0, x: i ? -60 : 60 }} transition={{ duration: 0.7, delay: i * 0.15 }}>
                      <Card3D card={getCard(game.open[i])} size="md" live />
                    </motion.div>
                  ) : (
                    <motion.div key="cover" className="war-pile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CardCover deck={game.deck} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          {game.open ? (
            <div className="verdict">
              <h2>של מי הקלף חזק יותר?</h2>
              <p className="hint">כל אחד מסביר את המשמעות של הקלף שלו, ולמה הוא חזק יותר עכשיו.</p>
              <div className="cta-row">
                <button type="button" className="btn btn--primary" onClick={() => decide(0)}>הקלף של {game.names[0]}</button>
                <button type="button" className="btn btn--primary" onClick={() => decide(1)}>הקלף של {game.names[1]}</button>
                <button type="button" className="btn" onClick={() => decide(null)}>תיקו</button>
              </div>
            </div>
          ) : (
            <div className="cta-row center">
              <button type="button" className="btn btn--primary" onClick={flip}>פתיחת קלפים</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
