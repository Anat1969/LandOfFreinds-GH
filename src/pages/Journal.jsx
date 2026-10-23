import { useJournal } from '../lib/store.js';
import { getCard } from '../data/cards.js';

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('he-IL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function exportText(entries) {
  const lines = entries.map((entry) => {
    const shadow = entry.shadowId ? getCard(entry.shadowId)?.name : 'ללא צל (מצב כוחות בלבד)';
    const light = getCard(entry.lightId)?.name ?? '';
    return [
      `תאריך: ${formatDate(entry.createdAt)}`,
      `צל: ${shadow}`,
      `אור: ${light}`,
      `מה נסיתי: ${entry.text || 'לא נכתב'}`,
      '',
    ].join('\n');
  });
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
        <h1>מה נסיתי</h1>
        <p className="lead">הרשומות נשמרות רק בדפדפן של המכשיר הזה. אפשר לייצא לקובץ טקסט ולמחוק כל רשומה.</p>
      </header>

      {entries.length === 0 ? (
        <div className="empty">
          <p>עדיין אין רשומות. אחרי צימוד ראשון, השמירה תופיע כאן.</p>
          <a className="btn btn--primary" href="#/pair">
            לצימוד
          </a>
        </div>
      ) : (
        <>
          <div className="cta-row">
            <button type="button" className="btn" onClick={() => exportText(entries)}>
              ייצוא לקובץ טקסט
            </button>
          </div>
          <ul className="entries">
            {entries.map((entry) => {
              const shadow = entry.shadowId ? getCard(entry.shadowId) : null;
              const light = getCard(entry.lightId);
              return (
                <li key={entry.id} className="entry">
                  <div className="entry-head">
                    <span className="entry-pair">
                      {shadow ? `${shadow.name} ← ${light?.name}` : light?.name}
                    </span>
                    <time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
                  </div>
                  <p className="entry-text">{entry.text || 'בלי רשימה'}</p>
                  <button type="button" className="link-danger" onClick={() => remove(entry.id)}>
                    מחיקת הרשומה
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
