import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import { CARDS, getCard } from '../data/cards.js';

const FAN = ['c8', 'c3', 'c1', 'c4', 'c11'];

const WAYS = [
  { to: '#/draw?mode=one', title: 'קלף אחד', text: 'שולפים מהחפיסה המעורבבת, מתבוננים באיור, והופכים לשאלה ולתרגול.' },
  { to: '#/draw?mode=pick', title: 'בחירה מהמניפה', text: 'הקלפים פרושים הפוכים. בוחרים אחד לפי תחושה, והוא נפתח.' },
  { to: '#/draw?mode=three', title: 'פריסת שלושה', text: 'כוח שכבר יש בי, כוח שאפשר לחזק, וכוח לדרך.' },
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
          <p className="eyebrow">חפיסת כוחות · {CARDS.length} קלפים</p>
          <h1>ממלכת הפנים</h1>
          <p className="lead">
            בכל קלף מסתתר כוח פנימי: תקווה, סבלנות, אומץ, הקשבה. הנודד בכובע הגבוה עובר מסצנה לסצנה ומזמין
            להתבונן, לשאול ולנסות דבר אחד קטן.
          </p>
          <div className="cta-row">
            <a className="btn btn--primary" href="#/draw?mode=one">שליפת קלף</a>
            <a className="btn" href="#/deck">כל החפיסה</a>
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

      <h2 className="section-title">שלוש דרכים לשחק</h2>
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
          משחקים בקבוצה? בעמוד <a href="#/play">איך משחקים</a> יש משחקים למשפחה, לכיתה ולחדר הטיפול.
        </p>
      </div>
    </section>
  );
}
