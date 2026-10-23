import { useEffect, useState } from 'react';

// ניתוב מבוסס hash: הכתובת נשארת בתוך הדומיין, והמצב (הקלף, החפיסה) נשמר בקישור.
export function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return {
    path: path || '/',
    params: Object.fromEntries(new URLSearchParams(query)),
  };
}

export function useRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function go(to) {
  window.location.hash = to;
}
