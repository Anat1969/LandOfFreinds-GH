import { useState } from 'react';
import Creature from '../components/Creature.jsx';
import Card3D from '../components/Card3D.jsx';
import { SHADOWS, LIGHTS, getCard } from '../data/cards.js';
import { useJournal } from '../lib/store.js';
import { go } from '../lib/router.js';

function PickButton({ card, selected, onPick }) {
  return (
    <button
      type="button"
      className={selected ? 'pick selected' : 'pick'}
      onClick={() => onPick(card.id)}
      aria-pressed={selected}
    >
      <span className="pick-art">
        <Creature card={card} />
      </span>
      <span className="pick-name">{card.name}</span>
    </button>
  );
}

export default function Pair({ params }) {
  const initialShadow = params.s && getCard(params.s)?.deck === 'shadow' ? params.s : null;
  const initialLight = params.l && getCard(params.l)?.deck === 'light' ? params.l : null;

  const [lightsOnly, setLightsOnly] = useState(false);
  const [shadowId, setShadowId] = useState(initialShadow);
  const [lightId, setLightId] = useState(initialLight);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const { add } = useJournal();

  const shadow = shadowId ? getCard(shadowId) : null;
  const light = lightId ? getCard(lightId) : null;
  const ready = light && (lightsOnly || shadow);

  function save() {
    if (!light) return;
    add({
      shadowId: lightsOnly ? null : shadowId,
      lightId,
      text: text.trim(),
    });
    setText('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <section className="page pair">
      <header className="page-head">
        <p className="eyebrow">צימוד</p>
        <h1>צל ואור</h1>
        <p className="lead">בוחרים כוח, ואם רוצים, גם צל שהוא מתמודד איתו. ואז כותבים מה אפשר לנסות.</p>
      </header>

      <div className="toggle-row">
        <label className="toggle">
          <input type="checkbox" checked={lightsOnly} onChange={(e) => setLightsOnly(e.target.checked)} />
          <span>מצב כוחות בלבד</span>
        </label>
        <span className="hint">מתאים לילדים צעירים ולמצבים רגישים. פרטים בעמוד ההסבר.</span>
      </div>

      {!lightsOnly && (
        <div className="pick-section">
          <h2 className="section-title">צל</h2>
          <div className="pick-grid">
            {SHADOWS.map((card) => (
              <PickButton key={card.id} card={card} selected={card.id === shadowId} onPick={setShadowId} />
            ))}
          </div>
        </div>
      )}

      <div className="pick-section">
        <h2 className="section-title">אור</h2>
        <div className="pick-grid">
          {LIGHTS.map((card) => (
            <PickButton key={card.id} card={card} selected={card.id === lightId} onPick={setLightId} />
          ))}
        </div>
      </div>

      {ready && (
        <div className="pairing">
          <div className="pairing-cards">
            {!lightsOnly && shadow && (
              <div className="pairing-item">
                <Card3D card={shadow} size="sm" />
              </div>
            )}
            <div className="pairing-item">
              <Card3D card={light} size="sm" />
            </div>
          </div>

          <div className="pairing-text">
            {!lightsOnly && shadow && (
              <p className="whisper">
                <strong>{shadow.name}:</strong> {shadow.whisper}
              </p>
            )}
            <p className="gift">
              <strong>{light.name}:</strong> {light.gift}
            </p>
            <div className="practice">
              <h3>תרגול קצר</h3>
              <p>{light.practice}</p>
            </div>

            <label className="field">
              <span>{lightsOnly ? 'מה אני רוצה לנסות?' : 'איך האור הזה יכול לגעת בצל הזה?'}</span>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="כמה מילים מספיקות"
              />
            </label>

            <div className="cta-row">
              <button type="button" className="btn btn--primary" onClick={save}>
                שמירה ליומן
              </button>
              {saved && <span className="saved">נשמר ליומן</span>}
              <button type="button" className="btn" onClick={() => go('/journal')}>
                מעבר ליומן
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
