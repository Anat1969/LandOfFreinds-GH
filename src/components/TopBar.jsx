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

      {/* כפתור הלוגו A&I (https://appofapp-gh.vercel.app/ai-menu.js): העתקת קישור, שיחת הפיתוח, פרויקט המחקר והתקנה נמצאים בתוכו. */}
      <div className="actions">
        <ai-menu chat={CLAUDE_DEV_URL} research={RESEARCH_PROJECT_URL || undefined} />
      </div>
    </header>
  );
}
