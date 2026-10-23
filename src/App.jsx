import { AnimatePresence, motion } from 'framer-motion';
import Particles from './components/Particles.jsx';
import TopBar from './components/TopBar.jsx';
import Home from './pages/Home.jsx';
import Draw from './pages/Draw.jsx';
import Pair from './pages/Pair.jsx';
import Journal from './pages/Journal.jsx';
import About from './pages/About.jsx';
import { useRoute } from './lib/router.js';

function renderPage(route) {
  switch (route.path) {
    case '/draw':
      return <Draw params={route.params} />;
    case '/pair':
      return <Pair params={route.params} />;
    case '/journal':
      return <Journal />;
    case '/about':
      return <About />;
    default:
      return <Home />;
  }
}

export default function App() {
  const route = useRoute();
  const pageKey = route.path.split('/')[1] || 'home';

  return (
    <div className="app">
      <Particles />
      <TopBar path={route.path} />
      <main className="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {renderPage(route)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
