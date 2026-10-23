import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import { CARDS, SHEDIM, getCard } from '../data/cards.js';

const FAN = ['e3', 'c15', 'e1', 'c1', 'e8'];

const WAYS = [
  { to: '#/games/pairs', title: 'משחק זוגות', text: 'מתאימים כוח קסם לשדון ומנמקים. מי שאוסף חמישה זוגות ראשון מנצח.' },
  { to: '#/games/war', title: 'משחק מלחמה', text: 'כל אחד פותח קלף ומשכנע למה הקלף שלו חזק יותר. מחליטים יחד.' },
  { to: '#/draw?mode=shed', title: 'איזה שדון מנהל אותי?', text: 'שליפה עיוורת מתוך מניפת שדונים, ומפגש עם השדון של עכשיו.' },
  { to: '#/games/id', title: 'תעודת זהות לשדון', text: 'נותנים לשדון שם, מתארים אותו, ובוחרים כוח קסם שעוזר מולו.' },
];

export default function Home() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [10, -10]), { stiffness: 80, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [-6, 6]), { stiffness: 80, damping: 18 });

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section className="page home">
      <div className="hero" onPointerMove={onMove} onPointerLeave={() => { px.set(0); py.set(0); }}>
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="eyebrow">{SHEDIM.length} שדונים · {CARDS.length} כוחות קסם</p>
          <h1>ממלכת הפנים</h1>
          <p className="lead">
            בכל אחד מאיתנו גרים שדונים: הכעס, הפחד, הדחיינות, הקנאה. וגם כוחות קסם: תקווה, סבלנות, אומץ, הקשבה. כשנותנים
            לשדון שם ופנים, אפשר לבחור את הכוח שיעמוד מולו.
          </p>
          <div className="cta-row">
            <a className="btn btn--primary" href="#/games/pairs">משחק זוגות</a>
            <a className="btn" href="#/draw?mode=shed">איזה שדון מנהל אותי?</a>
            <a className="btn" href="#/deck?deck=shed">החפיסות</a>
          </div>
        </motion.div>

        <motion.div className="fan-wrap" style={{ rotateX: rotX, rotateY: rotY }}>
          {FAN.map((id, i) => {
            const offset = i - 2;
            return (
              <motion.div
                key={id}
                className="fan-item"
                style={{ zIndex: 10 - Math.abs(offset) }}
                initial={{ opacity: 0, y: 120, rotateZ: 0, x: 0 }}
                animate={{ opacity: 1, y: Math.abs(offset) * 16, rotateZ: offset * 8, x: `${offset * -46}%` }}
                transition={{ duration: 1.1, delay: 0.2 + Math.abs(offset) * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="fan-float" style={{ animationDelay: `${i * 0.6}s` }}>
                  <a href={`#/deck?card=${id}`} aria-label={getCard(id).name}>
                    <Card3D card={getCard(id)} size="sm" live />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <h2 className="section-title">משחקים</h2>
      <div className="ways">
        {WAYS.map((way, i) => (
          <motion.a
            key={way.to}
            href={way.to}
            className="way"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <span className="way-num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{way.title}</h3>
            <p>{way.text}</p>
          </motion.a>
        ))}
      </div>

      <div className="home-note">
        <p>
          עוד משחקים למשפחה, לכיתה ולחדר הטיפול בעמוד <a href="#/play">משחקים</a>.
        </p>
      </div>
    </section>
  );
}
