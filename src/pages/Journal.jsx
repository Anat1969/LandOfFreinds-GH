import Card3D from '../components/Card3D.jsx';
import { SPREAD_THREE, getCard } from '../data/cards.js';
import { useJournal } from '../lib/store.js';

const MODE_LABELS = {
  one: 'כוח קסם אחד', pick: 'כוח מהמניפה', three: 'פריסת שלושה כוחות', shed: 'איזה שדון מנהל אותי',
  duo: 'שדון וכוח', pairs: 'משחק זוגות', id: 'תעודת זהות לשדון',
};

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('he-IL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function cardNames(entry) {
  return (entry.cards ?? []).map((id, i) => {
    const name = getCard(id)?.name ?? '';
    return entry.mode === 'three' ? `${SPREAD_THREE[i]?.label}: ${name}` : name;
  });
}

function exportText(entries) {
  const lines = entries.map((entry) =>
    [`תאריך: ${formatDate(entry.createdAt)}`, `סוג: ${MODE_LABELS[entry.mode] ?? ''}`, ...cardNames(entry), `מה כתבתי: ${entry.text || 'לא נכתב'}`, ''].join('\n')
  );
  const blob = new Blob([`יומן ממלכת הפנים\n\n${lines.join('\n')}`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'יומן-ממלכת-הפנים.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Journal() {
  const { entries, remove } = useJournal();

  return (
    <section className="page journal">
      <header className="page-head">
        <p className="eyebrow">יומן</p>
        <h1>מה הקלפים עוררו</h1>
        <p className="lead">הרשומות נשמרות רק בדפדפן של המכשיר הזה. אפשר לייצא לקובץ טקסט ולמחוק כל רשומה.</p>
      </header>

      {entries.length === 0 ? (
        <div className="empty">
          <p>עדיין אין רשומות. אחרי שליפה, משחק או תעודת זהות לשדון, מה שנשמר יופיע כאן.</p>
          <a className="btn btn--primary" href="#/draw?mode=shed">איזה שדון מנהל אותי?</a>
        </div>
      ) : (
        <>
          <div className="cta-row">
            <button type="button" className="btn" onClick={() => exportText(entries)}>ייצוא לקובץ טקסט</button>
          </div>
          <ul className="entries">
            {entries.map((entry) => (
              <li key={entry.id} className="entry">
                <div className="entry-cards">
                  {(entry.cards ?? []).map(getCard).filter(Boolean).map((card) => (
                    <a key={card.id} href={`#/deck?card=${card.id}`} aria-label={card.name}>
                      <Card3D card={card} size="xs" interactive={false} />
                    </a>
                  ))}
                </div>
                <div className="entry-body">
                  <div className="entry-head">
                    <span className="entry-pair">
                      <span className="entry-mode">{MODE_LABELS[entry.mode] ?? ''}</span>
                      {cardNames(entry).join(' · ')}
                    </span>
                    <time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
                  </div>
                  <p className="entry-text">{entry.text || 'לא נכתב טקסט'}</p>
                  <button type="button" className="link-danger" onClick={() => remove(entry.id)}>מחיקת הרשומה</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
