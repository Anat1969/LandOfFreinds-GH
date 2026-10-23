import { useEffect, useRef, useState } from 'react';
import { go } from '../lib/router.js';

// קישורים קבועים: שיחת הפיתוח ופרויקט המחקר של ענת.
export const CLAUDE_DEV_URL = 'https://claude.ai/code/session_015iJnWkFEQKseWeRQGCaajZ';
export const RESEARCH_PROJECT_URL = 'https://claude.ai/chat/7ee3fc1b-8d3d-44bf-83d9-fff6a62fe78d';

const NAV = [
  { to: '/deck', label: 'החפיסה' },
  { to: '/draw', label: 'שליפה' },
  { to: '/journal', label: 'יומן' },
  { to: '/play', label: 'איך משחקים' },
];

export default function TopBar({ path }) {
  const [copied, setCopied] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef(null);
  const menuRef = useRef(null);

  // תפריט הלוגו נסגר בלחיצה מחוץ לו, ב-Escape ובמעבר עמוד.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [path]);

  // גובה הסרגל נשמר במשתנה CSS, כדי שחלונות העמקה ייפתחו מתחתיו.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--topbar-h', `${bar.offsetHeight}px`);
    });
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    function onBeforeInstall(event) {
      event.preventDefault();
      setInstallEvent(event);
    }
    function onInstalled() {
      setInstallEvent(null);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const area = document.createElement('textarea');
      area.value = url;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function install() {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <header className="topbar" ref={barRef}>
      <a
        className="brand"
        href="#/"
        onClick={(e) => {
          e.preventDefault();
          go('/');
        }}
      >
        <img src="/icons/icon-192.png" alt="" width="34" height="34" />
        ממלכת הפנים
      </a>

      <nav className="nav" aria-label="ניווט ראשי">
        {NAV.map((item) => (
          <a
            key={item.to}
            href={`#${item.to}`}
            className={path.startsWith(item.to) ? 'nav-link active' : 'nav-link'}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="studio" ref={menuRef}>
        <button
          type="button"
          className={menuOpen ? 'studio-btn open' : 'studio-btn'}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls="studio-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="studio-mark">A&amp;I</span>
          <span className="studio-name">אד' ענת שטיבלמן</span>
          {installEvent && <span className="studio-dot" aria-label="אפשר להתקין" />}
        </button>

        {menuOpen && (
          <div className="studio-menu" id="studio-menu" role="menu">
            <button type="button" role="menuitem" className="studio-item" onClick={copyLink}>
              {copied ? 'הקישור הועתק' : 'העתקת קישור'}
            </button>
            <a role="menuitem" className="studio-item" href={CLAUDE_DEV_URL} target="_blank" rel="noopener noreferrer">
              שיחת הפיתוח
            </a>
            <a role="menuitem" className="studio-item" href={RESEARCH_PROJECT_URL} target="_blank" rel="noopener noreferrer">
              פרויקט המחקר
            </a>
            {installEvent && (
              <button type="button" role="menuitem" className="studio-item studio-item--accent" onClick={install}>
                התקנת האפליקציה
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
