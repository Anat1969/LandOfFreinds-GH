import { useEffect, useState } from 'react';
import { go } from '../lib/router.js';

// קישורים קבועים. שנה כאן כשיש קישור לפרויקט המחקר של ענת.
export const CLAUDE_DEV_URL = 'https://claude.ai/code/session_01C3hSzdpgw9gTZ2nK8eQ6Ek';
export const RESEARCH_PROJECT_URL = '';

const NAV = [
  { to: '/draw', label: 'הגרלה' },
  { to: '/pair', label: 'צימוד' },
  { to: '/journal', label: 'יומן' },
  { to: '/about', label: 'הסבר' },
];

export default function TopBar({ path }) {
  const [copied, setCopied] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);

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
    <header className="topbar">
      <a
        className="brand"
        href="#/"
        onClick={(e) => {
          e.preventDefault();
          go('/');
        }}
      >
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

      <div className="actions">
        <button type="button" className="chip" onClick={copyLink}>
          {copied ? 'הקישור הועתק' : 'העתקת קישור'}
        </button>
        <a className="chip" href={CLAUDE_DEV_URL} target="_blank" rel="noopener noreferrer">
          שיחת הפיתוח
        </a>
        {RESEARCH_PROJECT_URL ? (
          <a className="chip" href={RESEARCH_PROJECT_URL} target="_blank" rel="noopener noreferrer">
            פרויקט המחקר
          </a>
        ) : (
          <button type="button" className="chip" disabled title="יופעל כשיוגדר קישור לפרויקט המחקר">
            פרויקט המחקר
          </button>
        )}
        {installEvent && (
          <button type="button" className="chip chip--accent" onClick={install}>
            התקנת האפליקציה
          </button>
        )}
      </div>
    </header>
  );
}
