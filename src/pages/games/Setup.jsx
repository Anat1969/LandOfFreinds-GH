import { useState } from 'react';

// הגדרת משתתפים משותפת למשחקים: מספר שחקנים ושמות. השמות נשמרים רק בזיכרון של הדף.
export default function Setup({ min = 1, max = 4, initial = 2, children, onStart, startLabel = 'מתחילים' }) {
  const [count, setCount] = useState(initial);
  const [names, setNames] = useState(() => Array.from({ length: max }, (_, i) => `שחקן ${i + 1}`));

  return (
    <div className="setup">
      {max > min && (
        <div className="setup-row">
          <span className="setup-label">מספר משתתפים</span>
          <div className="filter-row">
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
              <button key={n} type="button" className={n === count ? 'filter active' : 'filter'} onClick={() => setCount(n)} aria-pressed={n === count}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="setup-names">
        {names.slice(0, count).map((name, i) => (
          <label key={i} className="field">
            <span>שם משתתף {i + 1}</span>
            <input
              value={name}
              maxLength={24}
              onChange={(e) => setNames((list) => list.map((n, j) => (j === i ? e.target.value : n)))}
            />
          </label>
        ))}
      </div>
      {children}
      <div className="cta-row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onStart(names.slice(0, count).map((n, i) => n.trim() || `שחקן ${i + 1}`))}
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}
