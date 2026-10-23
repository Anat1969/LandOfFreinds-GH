import { useEffect, useState } from 'react';

// יומן אישי נשמר רק בדפדפן של המכשיר. אין שרת ואין חשבונות.
// גרסה 2: כל רשומה שומרת את סוג השליפה ואת רשימת הקלפים.
const KEY = 'mamlechet-hapnim:journal:v2';

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useJournal() {
  const [entries, setEntries] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
    } catch {
      // אחסון מלא או חסום: האפליקציה ממשיכה לפעול בזיכרון בלבד.
    }
  }, [entries]);

  function add(entry) {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setEntries((prev) => [{ ...entry, id, createdAt: new Date().toISOString() }, ...prev]);
  }

  function remove(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  return { entries, add, remove };
}
