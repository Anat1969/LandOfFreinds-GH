import { motion } from 'framer-motion';
import Card3D from '../components/Card3D.jsx';
import { getCard } from '../data/cards.js';

const PREVIEW = ['s3', 'l5', 's11'];

export default function Home() {
  return (
    <section className="page home">
      <div className="hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="eyebrow">ערכת עבודה רגשית</p>
          <h1>ממלכת הפנים</h1>
          <p className="lead">
            כל צל מביא דחף או רגש שקשה לנהל. כל אור מציע כוח קטן שיכול לעזור. בעזרת הקלפים אפשר להכיר את הצל,
            למצוא את האור המתאים לו, ולכתוב מה נסיתם.
          </p>
          <div className="cta-row">
            <a className="btn btn--primary" href="#/draw">
              הגרלת קלף
            </a>
            <a className="btn" href="#/pair">
              צימוד צל ואור
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-stack"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {PREVIEW.map((id, i) => (
            <div key={id} className={`stack-item stack-item--${i}`}>
              <Card3D card={getCard(id)} size="sm" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="steps">
        <article className="step">
          <span className="step-num">1</span>
          <h2>לזהות צל</h2>
          <p>מגרילים קלף מחפיסת הצללים, או בוחרים אחד שמדבר אלינו עכשיו.</p>
        </article>
        <article className="step">
          <span className="step-num">2</span>
          <h2>למצוא אור</h2>
          <p>בוחרים כוח שיכול לגעת בצל. הכוח לא מבטל את הצל, הוא נותן לו מענה.</p>
        </article>
        <article className="step">
          <span className="step-num">3</span>
          <h2>לנסות דבר אחד</h2>
          <p>כל צימוד מסתיים בתרגול קצר. שומרים את מה שנוסה ביומן האישי.</p>
        </article>
      </div>
    </section>
  );
}
