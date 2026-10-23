import { memo, useMemo } from 'react';
import { sceneFor } from '../art/scenes.jsx';

// שלוש שכבות SVG באותו viewBox, כל אחת בעומק אחר. ההנפשות רצות רק כשהקלף "חי".
function CardArt({ card }) {
  const scene = useMemo(() => sceneFor(card), [card]);
  return (
    <div className="art-stack" aria-hidden="true">
      {['back', 'mid', 'front'].map((layer) => (
        <svg key={layer} className={`layer layer--${layer}`} viewBox="0 0 300 330" preserveAspectRatio="xMidYMid meet">
          {scene[layer]}
        </svg>
      ))}
    </div>
  );
}

export default memo(CardArt);
