import { useEffect, useState } from 'react';
import Card3D from '../../components/Card3D.jsx';
import { CARDS, SHEDIM, getCard } from '../../data/cards.js';
import { go } from '../../lib/router.js';
import { sample } from '../../lib/motion.js';
import { useJournal } from '../../lib/store.js';

// תעודת זהות לשדון: החצנה. נותנים לשדון שם משלי, מתארים מתי הוא מגיע ומה הוא רוצה, ובוחרים כוח קסם מולו.
const FIELDS = [
  { key: 'nick', label: 'שם משלי לשדון', rows: 1 },
  { key: 'when', label: 'מתי הוא מגיע?', rows: 2 },
  { key: 'says', label: 'מה הוא לוחש לי?', rows: 2 },
  { key: 'body', label: 'איפה הוא יושב לי בגוף?', rows: 1 },
  { key: 'wants', label: 'מה הוא מנסה להשיג בשבילי?', rows: 2 },
];

export default function IdCard({ params }) {
  const shed = params.shed ? getCard(params.shed) : null;
  const [form, setForm] = useState({});
  const [strength, setStrength] = useState(5);
  const [power, setPower] = useState('');
  const [saved, setSaved] = useState(false);
  const { add } = useJournal();

  useEffect(() => {
    setForm({});
    setStrength(5);
    setPower(shed?.powers[0] ?? '');
    setSaved(false);
  }, [params.shed]);

  if (!shed || shed.deck !== 'shed') {
    return (
      <section className="page game-page">
        <header className="page-head">
          <p className="eyebrow">משחק</p>
          <h1>תעודת זהות לשדון</h1>
          <p className="lead">בוחרים שדון, או שולפים אחד בעיוורון, ומכינים לו תעודת זהות: שם, מתי הוא מגיע, מה הוא לוחש ומה עוזר מולו.</p>
        </header>
        <div className="cta-row">
          <button type="button" className="btn btn--primary" onClick={() => go(`/games/id?shed=${sample(SHEDIM, 1)[0].id}`)}>שליפה עיוורת של שדון</button>
        </div>
        <div className="deck-grid id-grid">
          {SHEDIM.map((c) => (
            <Card3D key={c.id} card={c} size="sm" onClick={() => go(`/games/id?shed=${c.id}`)} label={`תעודת זהות ל${c.name}`} />
          ))}
        </div>
      </section>
    );
  }

  const powerOptions = [...shed.powers.map(getCard), ...CARDS.filter((c) => !shed.powers.includes(c.id))];

  function save() {
    const lines = [
      ...FIELDS.map((f) => (form[f.key] ? `${f.label} ${form[f.key]}` : null)),
      `כמה הוא חזק היום: ${strength} מתוך 10`,
    ].filter(Boolean);
    add({ mode: 'id', cards: power ? [shed.id, power] : [shed.id], text: lines.join('\n') });
    setSaved(true);
  }

  return (
    <section className="page game-page id-page">
      <header className="page-head no-print">
        <p className="eyebrow">משחק</p>
        <h1>תעודת זהות ל{shed.name}</h1>
      </header>

      <div className="id-card">
        <div className="id-art">
          <Card3D card={shed} size="lg" live />
        </div>
        <div className="id-fields">
          <p className="id-title">תעודת זהות</p>
          <h2>{form.nick || shed.name}</h2>
          {FIELDS.map((f) => (
            <label key={f.key} className="field">
              <span>{f.label}</span>
              {f.rows > 1 ? (
                <textarea rows={f.rows} value={form[f.key] ?? ''} onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
              ) : (
                <input value={form[f.key] ?? ''} onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setSaved(false); }} />
              )}
            </label>
          ))}
          <label className="field">
            <span>כמה הוא חזק היום: {strength} מתוך 10</span>
            <input type="range" min="1" max="10" value={strength} onChange={(e) => setStrength(Number(e.target.value))} />
          </label>
          <label className="field">
            <span>כוח קסם שעוזר מולו</span>
            <select value={power} onChange={(e) => setPower(e.target.value)}>
              {powerOptions.map((c, i) => (
                <option key={c.id} value={c.id}>{c.name}{i < shed.powers.length ? ' (מומלץ)' : ''}</option>
              ))}
            </select>
          </label>
          <div className="cta-row no-print">
            <button type="button" className="btn btn--primary" onClick={save}>{saved ? 'נשמר ביומן' : 'שמירה ביומן'}</button>
            <button type="button" className="btn" onClick={() => window.print()}>הדפסה</button>
            <a className="btn" href="#/games/id">שדון אחר</a>
          </div>
        </div>
      </div>
    </section>
  );
}
