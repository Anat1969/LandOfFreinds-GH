// סצנה לכל קלף, בשלוש שכבות עומק: back (כתם צבע ונוף רחוק), mid (נוף ואביזרים), front (דמויות).
// השכבות מוצגות במרחקים שונים בתלת־ממד, כך שהטיית הקלף יוצרת פרלקסה אמיתית.
import Wanderer, { INK } from './Wanderer.jsx';
import {
  A, Wash, Ground, Hills, Snow, Sun, Moon, Stars, Cloud, Water, Tree, Flower, Sprout, Mountain, Flag, Path,
  Cliff, RopeBridge, Ladder, Kite, Boat, Lantern, Birds, ColorBird, Heart, Hourglass, Fence, Balloons,
  HeartBalloon, Umbrella, Rain, Tandem, Telescope, Book, BookStack, Gift, Signpost, Easel, Palette, PaperPlane,
  Juggle, WateringCan, Rainbow, Owl, Cat, Turtle, Fish, Nest, BreathRings, Confetti, Leaves, Wind, Sparkles,
} from './props.jsx';

const brush = (
  <g transform="rotate(-30)">
    <rect x="-1.6" y="-24" width="3.2" height="24" fill="#8a5d3b" stroke={INK} strokeWidth="0.7" />
    <path d="M -2 -24 Q 0 -34 2 -24 Z" fill="#e6566b" stroke={INK} strokeWidth="0.7" />
  </g>
);

const S = {
  hope: (w) => ({
    back: [w({ seed: 2 }), <Sun key="sun" x={150} y={214} r={40} long={150} />],
    mid: [<Snow key="snow" y={232} />, <Cloud key="c" x={70} y={60} s={0.8} />],
    front: [<Wanderer key="w" x={150} y={302} s={1.15} pose={{ armL: [8, 4], armR: [8, 4], mood: 'smile', hatTilt: -4 }} />,
      <Birds key="b" list={[[215, 70, 0.9], [235, 86, 0.7]]} />],
  }),

  ignore: (w) => ({
    back: [w({ seed: 4, x: 120, y: 26, w: 150, h: 196 })],
    mid: [<Leaves key="l" list={[[150, 120, 10], [178, 96, -20], [206, 70, 30], [234, 52, 0]]} />],
    front: [
      <Wanderer key="f" x={92} y={304} s={1.05} palette="friend" pose={{ hat: 'cone', mood: 'tongue', look: 1, armL: [20, 30], armR: [55, -30], hatTilt: 8 }} />,
      <Wanderer key="w" x={206} y={304} s={1.12} flip pose={{ hat: 'cone', mood: 'closed', armL: [10, 10], armR: [10, 10], hatTilt: -10, lean: 4 }} />,
    ],
  }),

  together: (w) => ({
    back: [w({ seed: 6 }), <Cloud key="c1" x={80} y={56} s={0.9} />, <Cloud key="c2" x={220} y={84} s={0.7} d="2s" />],
    mid: [<Hills key="h" y={252} color="#a9cf98" seed={6} />, <Path key="p" points={[[34, 288], [266, 288]]} w={14} />],
    front: [
      <A key="ride" c="a-bob" dur="1.2s">
        <Tandem x={150} y={300} />
        <Wanderer x={120} y={264} s={0.92} palette="friend" pose={{ legs: 'sit', hat: 'cone', armL: [24, 40], armR: [60, -20], look: 1, mood: 'laugh', hatTilt: -14 }} />
        <Wanderer x={176} y={264} s={0.92} pose={{ legs: 'sit', armL: [30, 10], armR: [62, -26], look: 1, mood: 'smile', hatTilt: -18 }} />
      </A>,
      <Birds key="b" list={[[230, 48, 0.8]]} />,
    ],
  }),

  reflect: (w) => ({
    back: [w({ seed: 8 }), <Water key="wa" y={196} depth={82} color="#86b9d8" />],
    mid: [
      <g key="refl" clipPath="url(#clip-reflect-water)">
        <defs>
          <clipPath id="clip-reflect-water"><rect x="34" y="198" width="232" height="80" /></clipPath>
        </defs>
        <g transform="translate(0 396) scale(1 -1)" opacity="0.38" filter="url(#wc-ripple)">
          <Wanderer x={150} y={198} s={1.05} pose={{ legs: 'crouch', armL: [40, -60], armR: [40, -60], mood: 'wonder', lean: 6 }} />
        </g>
      </g>,
      <Fish key="f1" x={90} y={262} s={0.8} color="#f2a23d" />,
    ],
    front: [<Wanderer key="w" x={150} y={198} s={1.05} pose={{ legs: 'crouch', armL: [40, -60], armR: [40, -60], mood: 'wonder', lean: 6 }} />],
  }),

  patience: (w) => ({
    back: [w({ seed: 10 }), <Sun key="sun" x={226} y={62} r={16} long={0} spin={false} />],
    mid: [<Hills key="h" y={250} color="#9fcf9a" seed={10} />, <Sprout key="sp" x={64} y={284} s={1.5} />, <Hourglass key="hg" x={234} y={292} s={1.05} />],
    front: [
      <Wanderer key="w" x={150} y={302} s={1.08} pose={{ legs: 'sit', armL: [22, 40], armR: [22, 40], mood: 'closed', hatTilt: -2 }} />,
      <Turtle key="t" x={96} y={306} s={0.8} />,
    ],
  }),

  limits: (w) => ({
    back: [w({ seed: 12 })],
    mid: [<Fence key="fe" x1={42} x2={260} y={262} gate />],
    front: [
      <Wanderer key="w" x={176} y={304} s={1.18} pose={{ armL: [86, 92], armR: [14, 6], mood: 'flat', hatTilt: 4 }} />,
      <Cat key="cat" x={82} y={304} s={1.05} />,
    ],
  }),

  courage: (w) => ({
    back: [w({ seed: 14 }), <Cloud key="c" x={150} y={250} s={1.2} />, <Cloud key="c2" x={110} y={268} s={0.8} d="3s" />],
    mid: [<Cliff key="cl" x={34} y={212} w={72} side={1} />, <Cliff key="cr" x={266} y={212} w={72} side={-1} />,
      <RopeBridge key="rb" x1={104} x2={196} y={214} />, <Flag key="fl" x={236} y={212} />],
    front: [<Wanderer key="w" x={138} y={224} s={0.82} pose={{ legs: 'walk', armL: [84, 14], armR: [84, 14], mood: 'wonder', look: 1, hatTilt: -8 }} />,
      <Birds key="b" list={[[70, 70], [92, 58, 0.8]]} />],
  }),

  imagine: (w) => ({
    back: [w({ seed: 16 }), <Stars key="st" pts={[[70, 50], [110, 80, 0.7], [230, 46], [250, 120, 0.8], [60, 150, 0.7], [200, 170, 0.6]]} />, <Moon key="m" x={226} y={84} r={16} />],
    mid: [<Cloud key="c" x={84} y={216} s={1.1} />, <Fish key="fish" x={70} y={110} s={1.1} color="#f2a23d" />, <Rainbow key="rb" x={150} y={278} r={110} />],
    front: [
      <A key="fl" c="a-float" dur="5s">
        <Balloons x={118} y={70} to={[118, 116]} colors={['#e6566b', '#f2b33d', '#5fa8d3', '#7fb86a']} />
        <Wanderer x={150} y={252} s={1} pose={{ legs: 'float', armL: [150, 0], armR: [60, 30], mood: 'laugh', hatTilt: 10 }} />
      </A>,
    ],
  }),

  friendship: (w) => ({
    back: [w({ seed: 18 }), <Rain key="r" />],
    mid: [<Ground key="g" y={284} color="#c9d6e2" />],
    front: [
      <Wanderer key="w" x={122} y={304} s={1.08} pose={{ armL: [10, 4], armR: [24, 20], mood: 'smile', look: 1 }} />,
      <Wanderer key="f" x={186} y={304} s={1.08} flip palette="friend" pose={{ hat: 'beret', armL: [10, 4], armR: [146, -6], mood: 'smile', look: 1 }} />,
      <Umbrella key="u" x={154} y={130} s={1.08} />,
    ],
  }),

  listen: (w) => ({
    back: [w({ seed: 20 }), <Hills key="h" y={240} color="#a6d08f" seed={20} />],
    mid: [<Tree key="t" x={214} y={282} s={1.25} color="#86b86d" />, <Owl key="o" x={226} y={176} s={0.75} />,
      <ColorBird key="b1" x={176} y={142} s={0.8} color="#e86b5a" />, <ColorBird key="b2" x={250} y={120} s={0.7} color="#5fa8d3" d="1s" />],
    front: [<Wanderer key="w" x={112} y={304} s={1.12} pose={{ armR: [100, 110], armL: [12, 6], mood: 'wonder', look: 1, hatTilt: 10, lean: 6 }} />],
  }),

  joy: (w) => ({
    back: [w({ seed: 22 }), <Sun key="sun" x={150} y={76} r={24} long={80} rays={11} />],
    mid: [<Confetti key="cf" />, <Flower key="f1" x={58} y={292} color="#e6566b" />, <Flower key="f2" x={246} y={292} color="#9a7bd0" d="1s" />],
    front: [<A key="hop" c="a-hop" dur="1.4s"><Wanderer x={150} y={292} s={1.08} pose={{ legs: 'jump', armL: [150, 14], armR: [150, 14], mood: 'laugh', hatTilt: -12 }} /></A>],
  }),

  askhelp: (w) => ({
    back: [w({ seed: 24 })],
    mid: [<Tree key="t" x={204} y={282} s={1.55} color="#7fae6a" fruit={[[-20, -20], [12, -40], [26, -10]]} />, <Kite key="k" x={216} y={78} />,
      <Ladder key="l" x={170} y={292} h={150} lean={8} />],
    front: [
      <Wanderer key="w" x={182} y={226} s={0.86} pose={{ legs: 'walk', armL: [170, -10], armR: [150, 10], mood: 'wonder', look: 1, hatTilt: 6 }} />,
      <Wanderer key="f" x={112} y={304} s={1.02} palette="friend" pose={{ hat: 'cone', armR: [74, -14], armL: [16, 10], mood: 'smile', look: 1 }} />,
    ],
  }),

  persist: (w) => ({
    back: [w({ seed: 26 }), <Mountain key="m" x={150} y={278} w={250} h={212} />],
    mid: [<Path key="p" points={[[70, 276], [150, 240], [98, 196], [160, 152], [128, 110]]} w={8} color="#f3e6c9" />, <Flag key="f" x={151} y={70} />,
      <Cloud key="c" x={230} y={130} s={0.8} />],
    front: [<Wanderer key="w" x={112} y={250} s={0.78} pose={{ legs: 'walk', armL: [40, 30], armR: [20, -20], mood: 'smile', look: 1, lean: -8 }} />],
  }),

  curious: (w) => ({
    back: [w({ seed: 28 }), <Stars key="st" pts={[[60, 48], [96, 90, 0.7], [130, 40, 0.9], [180, 120, 0.6], [252, 150, 0.7], [76, 160, 0.6]]} />, <Moon key="m" x={226} y={66} r={22} />],
    mid: [<Hills key="h" y={262} color="#8f97c6" seed={28} />, <Telescope key="t" x={196} y={210} angle={-34} legs={70} />],
    front: [<Wanderer key="w" x={146} y={304} s={1.02} pose={{ legs: 'crouch', armL: [30, 20], armR: [70, -40], mood: 'wonder', look: 1, hatTilt: -16 }} />],
  }),

  calm: (w) => ({
    back: [w({ seed: 30 }), <Hills key="h" y={246} color="#a9d3b0" seed={30} />, <Tree key="t" x={228} y={262} s={1.2} color="#93c28a" />, <Moon key="m" x={70} y={62} r={14} />],
    mid: [<BreathRings key="br" x={150} y={236} />, <Sparkles key="sp" pts={[[70, 150, 0.5], [230, 170, 0.5], [90, 220, 0.4], [210, 230, 0.4]]} />],
    front: [<Wanderer key="w" x={150} y={304} s={1.12} pose={{ legs: 'cross', armL: [26, 64], armR: [26, 64], mood: 'closed', hatTilt: 0 }} />],
  }),

  forgive: (w) => ({
    back: [w({ seed: 32 }), <Hills key="h" y={250} color="#d9b5c0" seed={32} />],
    mid: [<Heart key="h1" x={152} y={118} s={1.3} c="a-rise" />, <Heart key="h2" x={136} y={150} s={0.8} c="a-rise" />],
    front: [
      <Wanderer key="w" x={104} y={304} s={1.08} pose={{ armR: [74, -26], armL: [12, 6], mood: 'smile', look: 1, holdR: <Flower x={0} y={10} s={0.7} color="#f6d36a" center="#e6566b" /> }} />,
      <Wanderer key="f" x={200} y={304} s={1.08} flip palette="friend" pose={{ hat: 'beret', armL: [10, 4], armR: [36, 30], mood: 'wonder', look: 1 }} />,
    ],
  }),

  give: (w) => ({
    back: [w({ seed: 34 }), <Sun key="sun" x={60} y={60} r={18} long={0} spin={false} />],
    mid: [<Hills key="h" y={256} color="#e5c49a" seed={34} />, <Sparkles key="sp" pts={[[150, 150, 0.6], [168, 132, 0.5], [138, 128, 0.4]]} />],
    front: [
      <Wanderer key="w" x={100} y={304} s={1.08} pose={{ armR: [62, -48], armL: [14, 6], mood: 'smile', look: 1, holdR: <Gift x={4} y={12} s={0.85} /> }} />,
      <Wanderer key="f" x={210} y={304} s={0.88} flip palette="third" pose={{ hat: 'cone', armL: [10, 4], armR: [64, -30], mood: 'wonder', look: 1 }} />,
    ],
  }),

  soothe: (w) => ({
    back: [w({ seed: 36 }), <Stars key="st" pts={[[66, 52, 0.7], [120, 36, 0.6], [250, 110, 0.7], [70, 140, 0.5]]} />, <Moon key="m" x={226} y={64} r={18} />],
    mid: [<Ground key="g" y={284} color="#c9cbe4" />, <Lantern key="l" x={226} y={268} s={1.2} />, <BreathRings key="br" x={146} y={200} color="#fff3c4" />],
    front: [<Wanderer key="w" x={140} y={304} s={1.14} pose={{ hug: true, mood: 'closed', hatTilt: -8 }} />],
  }),

  create: (w) => ({
    back: [w({ seed: 38 })],
    mid: [<Easel key="e" x={196} y={296} />, <Ground key="g" y={286} color="#efdcc6" />],
    front: [<Wanderer key="w" x={104} y={304} s={1.1} pose={{ armR: [84, -34], armL: [24, 40], mood: 'smile', look: 1, holdR: brush, holdL: <Palette x={0} y={4} /> }} />],
  }),

  change: (w) => ({
    back: [w({ seed: 40 }), <Hills key="h" y={214} color="#b5d69a" seed={40} />],
    mid: [<Path key="p1" points={[[150, 300], [150, 236], [70, 168]]} />, <Path key="p2" points={[[150, 236], [236, 176]]} />, <Signpost key="s" x={152} y={240} />],
    front: [<Wanderer key="w" x={112} y={304} s={1.04} pose={{ legs: 'walk', armL: [14, 10], armR: [40, 120], mood: 'wonder', look: 1, hatTilt: 12 }} />],
  }),

  love: (w) => ({
    back: [w({ seed: 42 }), <Cloud key="c" x={84} y={70} />, <Cloud key="c2" x={236} y={190} s={0.7} d="2s" />],
    mid: [<Hills key="h" y={258} color="#e8b6b4" seed={42} />, <Heart key="h1" x={90} y={180} s={0.6} c="a-rise" />, <Heart key="h2" x={214} y={140} s={0.5} c="a-rise" />],
    front: [<HeartBalloon key="hb" x={186} y={84} to={[184, 164]} />, <Wanderer key="w" x={150} y={304} s={1.12} pose={{ armR: [150, 0], armL: [16, 6], mood: 'smile', look: 1, hatTilt: -6 }} />],
  }),

  alone: (w) => ({
    back: [w({ seed: 44 }), <Stars key="st" pts={[[70, 48], [116, 84, 0.7], [180, 40, 0.8], [250, 130, 0.6]]} />, <Moon key="m" x={218} y={72} r={22} />, <Water key="wa" y={210} depth={68} color="#6d86bf" />],
    mid: [<ellipse key="shine" cx="218" cy="236" rx="22" ry="3" fill="#fff6c4" opacity="0.5" />, <Fish key="f" x={80} y={262} s={0.7} color="#f2b33d" />],
    front: [<A key="bob" c="a-bob" dur="4s"><Boat x={146} y={232} /><Wanderer x={140} y={240} s={0.86} pose={{ legs: 'sit', armL: [20, 40], armR: [20, 40], mood: 'smile', look: 1 }} /></A>],
  }),

  humor: (w) => ({
    back: [w({ seed: 46 })],
    mid: [<Ground key="g" y={286} color="#f1e1b6" />, <Cat key="cat" x={236} y={302} s={0.9} flip />],
    front: [<Juggle key="j" x={150} y={128} />, <Wanderer key="w" x={146} y={304} s={1.12} pose={{ armL: [64, -60], armR: [64, -60], mood: 'laugh', hatTilt: -28 }} />],
  }),

  learn: (w) => ({
    back: [w({ seed: 48 }), <Hills key="h" y={246} color="#a6d0c0" seed={48} />],
    mid: [<PaperPlane key="p1" x={72} y={282} rot={26} c={null} />, <PaperPlane key="p2" x={96} y={290} rot={-160} c={null} />],
    front: [<PaperPlane key="p3" x={222} y={88} rot={-16} />, <Wanderer key="w" x={150} y={304} s={1.1} pose={{ armR: [140, 30], armL: [14, 6], mood: 'smile', look: 1, hatTilt: -6 }} />],
  }),

  thanks: (w) => ({
    back: [w({ seed: 50 }), <Rainbow key="rb" x={150} y={200} r={96} />],
    mid: [<Ground key="g" y={288} color="#d9e7c4" />, <Flower key="f1" x={196} y={294} color="#e6566b" grow />, <Flower key="f2" x={226} y={292} s={1.15} color="#f2b33d" grow d="0.6s" />, <Flower key="f3" x={254} y={296} s={0.9} color="#9a7bd0" grow d="1.2s" />],
    front: [<Wanderer key="w" x={112} y={304} s={1.08} pose={{ armR: [62, -30], armL: [14, 6], mood: 'smile', look: 1, holdR: <WateringCan x={6} y={8} s={0.9} /> }} />],
  }),

  dream: (w) => ({
    back: [w({ seed: 52 }), <Stars key="st" pts={[[60, 44], [100, 96, 0.7], [150, 34, 0.9], [210, 70, 0.7], [254, 40], [240, 130, 0.6], [70, 170, 0.6]]} />],
    mid: [<Cloud key="c" x={80} y={250} s={1.1} />, <Cloud key="c2" x={230} y={262} s={0.9} d="2s" />],
    front: [
      <A key="mb" c="a-float" dur="6s">
        <path d="M 70 196 Q 150 300 236 196 Q 150 252 70 196 Z" fill="#fbe39a" stroke={INK} strokeWidth="1.3" filter="url(#wc-soft)" />
        <Wanderer x={154} y={246} s={0.92} pose={{ legs: 'sit', armL: [30, 50], armR: [30, 50], mood: 'sleep', hatTilt: 24, lean: -6 }} />
      </A>,
    ],
  }),

  flex: (w) => ({
    back: [w({ seed: 54 }), <Wind key="wi" list={[[60, 80, 70], [140, 120, 60], [70, 190, 50]]} />],
    mid: [<g key="t" className="anim-wrap"><Tree x={220} y={284} s={1.35} color="#8cc0a8" /></g>, <Leaves key="l" list={[[120, 60], [170, 90, 40], [90, 140, -20], [200, 40, 10]]} />],
    front: [<Wanderer key="w" x={118} y={304} s={1.1} pose={{ armL: [110, 30], armR: [80, 40], mood: 'laugh', lean: -12, hatTilt: -24 }} />],
  }),

  care: (w) => ({
    back: [w({ seed: 56 }), <Tree key="t" x={226} y={268} s={1.2} color="#9cc985" />],
    mid: [<Ground key="g" y={288} color="#dbe8c8" />, <Nest key="n" x={190} y={290} />, <ColorBird key="b" x={226} y={110} s={0.9} color="#5fa8d3" />],
    front: [<Wanderer key="w" x={124} y={304} s={1.08} pose={{ legs: 'crouch', armR: [66, -10], armL: [24, 40], mood: 'smile', look: 1, lean: 8 }} />],
  }),

  express: (w) => ({
    back: [w({ seed: 58 })],
    mid: [
      <ColorBird key="b1" x={92} y={130} s={0.9} color="#e6566b" />, <ColorBird key="b2" x={208} y={120} s={0.85} color="#f2b33d" d="0.6s" />,
      <ColorBird key="b3" x={150} y={70} s={0.8} color="#5fa8d3" d="1.2s" />, <ColorBird key="b4" x={70} y={70} s={0.7} color="#7fb86a" d="1.8s" />,
      <ColorBird key="b5" x={234} y={56} s={0.7} color="#9a7bd0" d="2.4s" />,
    ],
    front: [<Wanderer key="w" x={150} y={304} s={1.14} pose={{ armL: [124, -10], armR: [124, -10], mood: 'laugh', hatTilt: -4 }} />, <Heart key="h" x={150} y={212} s={0.5} />],
  }),

  wisdom: (w) => ({
    back: [w({ seed: 60 }), <Stars key="st" pts={[[66, 50, 0.6], [240, 60, 0.7], [120, 40, 0.5]]} />],
    mid: [<BookStack key="bs" x={218} y={298} />, <Owl key="o" x={218} y={250} s={0.9} />, <Lantern key="l" x={76} y={96} hang={60} />],
    front: [<Wanderer key="w" x={124} y={304} s={1.08} pose={{ legs: 'sit', armL: [40, -64], armR: [40, -64], mood: 'smile', look: 1, holdL: <Book x={-2} y={10} s={0.75} /> }} />],
  }),
};

export function sceneFor(card) {
  const build = S[card.scene] ?? S.hope;
  const w = (opts = {}) => <Wash key="wash" uid={card.id} c1={card.sky[0]} c2={card.sky[1]} {...opts} />;
  return build(w);
}
