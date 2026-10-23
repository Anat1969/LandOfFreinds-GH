import { AnimatePresence, motion } from 'framer-motion';
import Particles from './components/Particles.jsx';
import TopBar from './components/TopBar.jsx';
import ArtDefs from './art/ArtDefs.jsx';
import Home from './pages/Home.jsx';
import Deck from './pages/Deck.jsx';
import Draw from './pages/Draw.jsx';
import Journal from './pages/Journal.jsx';
import Play from './pages/Play.jsx';
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
    case '/play':
    case '/about':
      return <Play />;
    default:
      return <Home />;
  }
}

export default function App() {
  const route = useRoute();
  const pageKey = route.path.split('/')[1] || 'home';

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
