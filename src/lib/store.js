import { useEffect, useState } from 'react';

// יומן אישי נשמר רק בדפדפן של המכשיר. אין שרת ואין חשבונות.
const KEY = 'mamlechet-hapnim:journal:v1';

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
    setEntries((prev) => [{ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...prev]);
  }

  function remove(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  return { entries, add, remove };
}
