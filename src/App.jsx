import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Particles from './components/Particles.jsx';
import TopBar from './components/TopBar.jsx';
import ArtDefs from './art/ArtDefs.jsx';
import Home from './pages/Home.jsx';
import Deck from './pages/Deck.jsx';
import Draw from './pages/Draw.jsx';
import Journal from './pages/Journal.jsx';
import Play from './pages/Play.jsx';
import Pairs from './pages/games/Pairs.jsx';
import War from './pages/games/War.jsx';
import IdCard from './pages/games/IdCard.jsx';
import { useRoute } from './lib/router.js';

function renderPage(route) {
  switch (route.path) {
    case '/deck':
      return <Deck params={route.params} />;
    case '/draw':
    case '/pair':
      return <Draw params={route.params} />;
    case '/journal':
      return <Journal />;
    case '/games/pairs':
      return <Pairs />;
    case '/games/war':
      return <War />;
    case '/games/id':
      return <IdCard params={route.params} />;
    case '/play':
    case '/about':
      return <Play />;
    default:
      return <Home />;
  }
}

export default function App() {
  const route = useRoute();
  const pageKey = route.path.split('/').slice(1, 3).join('/') || 'home';

  // מעבר לעמוד אחר מתחיל מראש העמוד. שינוי פרמטרים באותו עמוד שומר על הגלילה.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pageKey]);

  return (
    <div className="app">
      <ArtDefs />
      <Particles />
      <TopBar path={route.path} />
      <main className="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {renderPage(route)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
