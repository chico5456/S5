import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull, Crown, Star, AlertTriangle, ChevronRight, Tv, Music, Theater, Palette, Mic, Smile, Sparkles, MessageCircle, HeartCrack, Gavel, Flame, XCircle, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

type StatType = 'design' | 'comedy' | 'acting' | 'improv' | 'dancing' | 'lipsync' | 'makeover' | 'singing' | 'branding';
type Placement = 'WIN' | 'HIGH' | 'SAFE' | 'LOW' | 'BTM2' | 'ELIM' | 'WINNER' | 'RUNNER-UP' | 'DOUBLE SHANTAY';
type Phase = 'PROMO' | 'EPISODE_INTRO' | 'PERFORMING' | 'UNTUCKED' | 'PRODUCER_HUB' | 'LIPSYNC' | 'RESULTS' | 'CROWNING' | 'SEASON_END';

interface Queen {
  id: string;
  name: string;
  imageUrl: string;
  stats: Record<StatType, number>;
  trackRecord: Placement[];
  status: 'active' | 'eliminated' | 'winner' | 'runner-up';
  storyline: string;
  eliminatedEpisode?: number;
}

interface Episode {
  number: number;
  title: string;
  description: string;
  challengeType: StatType[];
}

interface UntuckedEvent {
  id: string;
  quote: string;
  queensInvolved: Queen[];
}

// --- Initial Data --- //

const MOCK_IMAGES: Record<string, string> = {
  Jinkx: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/b/b4/JinkxMonsoonS5CastMug.jpg",
  Alaska: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/8/8e/AlaskaS5CastMug.jpg",
  Roxxxy: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/7/7e/RoxxxyAndrewsS5CastMug.jpg",
  Detox: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/96/DetoxS5CastMug.jpg",
  Coco: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/0/00/CocoMontreseS5CastMug.jpg",
  Alyssa: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/4/45/AlyssaEdwardsS5CastMug.jpg",
  Ivy: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/6/6c/IvyWintersS5CastMug.jpg",
  Jade: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f2/JadeJolieS5CastMug.jpg",
  Lineysha: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/c/c9/LineyshaSparxS5CastMug.jpg",
  Honey: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/9/90/HoneyMahoganyS5CastMug.jpg",
  Vivienne: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/e/ea/ViviennePinayS5CastMug.jpg",
  Monica: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/2/2e/MonicaBeverlyHillzS5CastMug.jpg",
  Serena: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/d/da/SerenaChaChaS5CastMug.jpg",
  Penny: "https://static.wikia.nocookie.net/logosrupaulsdragrace/images/f/f8/PennyTrationS5CastMug.jpg",
};

const getImageUrl = (name: string) => MOCK_IMAGES[name] || `https://ui-avatars.com/api/?name=${name}&background=random&size=400`;

const INITIAL_CAST: Queen[] = [
  { id: '1', name: 'Jinkx Monsoon', imageUrl: getImageUrl('Jinkx'), status: 'active', trackRecord: [], storyline: 'The lovable underdog', stats: { acting: 10, comedy: 10, singing: 10, improv: 9, branding: 8, lipsync: 7, dancing: 5, design: 4, makeover: 6 } },
  { id: '2', name: 'Alaska', imageUrl: getImageUrl('Alaska'), status: 'active', trackRecord: [], storyline: 'Out of the shadow', stats: { acting: 9, comedy: 9, branding: 10, improv: 8, singing: 7, lipsync: 6, dancing: 4, design: 6, makeover: 7 } },
  { id: '3', name: 'Roxxxy Andrews', imageUrl: getImageUrl('Roxxxy'), status: 'active', trackRecord: [], storyline: 'Pageant perfection', stats: { design: 10, makeover: 10, dancing: 7, lipsync: 8, branding: 5, acting: 4, comedy: 3, improv: 3, singing: 2 } },
  { id: '4', name: 'Detox', imageUrl: getImageUrl('Detox'), status: 'active', trackRecord: [], storyline: 'Too cool for school', stats: { design: 8, acting: 7, comedy: 7, lipsync: 9, branding: 7, dancing: 6, improv: 5, makeover: 6, singing: 4 } },
  { id: '5', name: 'Coco Montrese', imageUrl: getImageUrl('Coco'), status: 'active', trackRecord: [], storyline: 'The lipsync assassin', stats: { lipsync: 10, dancing: 9, makeover: 7, acting: 5, comedy: 6, design: 5, branding: 4, improv: 3, singing: 3 } },
  { id: '6', name: 'Alyssa Edwards', imageUrl: getImageUrl('Alyssa'), status: 'active', trackRecord: [], storyline: 'Unintentional comedy gold', stats: { dancing: 10, lipsync: 8, branding: 8, acting: 4, comedy: 4, improv: 3, design: 3, makeover: 4, singing: 2 } },
  { id: '7', name: 'Ivy Winters', imageUrl: getImageUrl('Ivy'), status: 'active', trackRecord: [], storyline: 'Miss congeniality', stats: { design: 9, singing: 7, dancing: 6, makeover: 8, acting: 5, comedy: 4, improv: 4, lipsync: 5, branding: 4 } },
  { id: '8', name: 'Jade Jolie', imageUrl: getImageUrl('Jade'), status: 'active', trackRecord: [], storyline: 'Taylor Swift wannabe', stats: { acting: 6, lipsync: 7, comedy: 5, dancing: 5, design: 5, makeover: 4, improv: 4, branding: 3, singing: 3 } },
  { id: '9', name: 'Lineysha Sparx', imageUrl: getImageUrl('Lineysha'), status: 'active', trackRecord: [], storyline: 'Language barrier beauty', stats: { design: 9, makeover: 8, dancing: 7, lipsync: 6, acting: 3, comedy: 2, improv: 2, branding: 3, singing: 2 } },
  { id: '10', name: 'Honey Mahogany', imageUrl: getImageUrl('Honey'), status: 'active', trackRecord: [], storyline: 'Caftan queen', stats: { singing: 8, acting: 5, comedy: 4, branding: 5, design: 4, lipsync: 3, dancing: 3, improv: 3, makeover: 4 } },
  { id: '11', name: 'Vivienne Pinay', imageUrl: getImageUrl('Vivienne'), status: 'active', trackRecord: [], storyline: 'Fishiest queen', stats: { makeover: 8, design: 6, branding: 6, acting: 3, comedy: 2, lipsync: 4, dancing: 3, improv: 2, singing: 2 } },
  { id: '12', name: 'Monica B. Hillz', imageUrl: getImageUrl('Monica'), status: 'active', trackRecord: [], storyline: 'Truth teller', stats: { dancing: 7, lipsync: 7, design: 5, makeover: 4, acting: 3, comedy: 2, improv: 2, branding: 3, singing: 2 } },
  { id: '13', name: 'Serena ChaCha', imageUrl: getImageUrl('Serena'), status: 'active', trackRecord: [], storyline: 'Art school dropout', stats: { design: 6, acting: 4, dancing: 5, lipsync: 5, comedy: 3, improv: 2, branding: 2, makeover: 3, singing: 2 } },
  { id: '14', name: 'Penny Tration', imageUrl: getImageUrl('Penny'), status: 'active', trackRecord: [], storyline: 'Fan favorite vote', stats: { comedy: 6, acting: 5, lipsync: 5, branding: 5, design: 3, dancing: 3, improv: 3, makeover: 2, singing: 2 } },
];

const EPISODES: Episode[] = [
  { number: 1, title: "RuPaullywood or Bust", description: "Create a Hollywood glamour look from garbage.", challengeType: ['design'] },
  { number: 2, title: "Lip Sync Extravaganza", description: "Reenact iconic moments from past seasons.", challengeType: ['lipsync', 'acting'] },
  { number: 3, title: "Draggle Rock", description: "Star in a kids TV show.", challengeType: ['acting', 'improv'] },
  { number: 4, title: "Black Swan", description: "Perform a ballet inspired by RuPaul's life.", challengeType: ['dancing'] },
  { number: 5, title: "Snatch Game", description: "Celebrity impersonation game show.", challengeType: ['comedy', 'improv'] },
  { number: 6, title: "Can I Get an Amen?", description: "Record a 'We Are the World' style anthem.", challengeType: ['singing'] },
  { number: 7, title: "RuPaul Roast", description: "Roast RuPaul and the judges.", challengeType: ['comedy'] },
  { number: 8, title: "Scent of a Drag Queen", description: "Create and market a signature perfume.", challengeType: ['branding'] },
  { number: 9, title: "Telenovela Drama", description: "Overact in a dramatic Spanish soap opera.", challengeType: ['acting'] },
  { number: 10, title: "Super Troopers", description: "Turn veterans into drag sisters.", challengeType: ['makeover'] },
  { number: 11, title: "Sugar Ball", description: "Create three looks for the Sugar Ball.", challengeType: ['design'] },
];

const DRAMA_TEMPLATES = [
  "{Q1} accused {Q2} of having someone else make her costume!",
  "{Q1} is crying alone because the judges hated her look.",
  "{Q1} and {Q2} got into a screaming match over a wig.",
  "{Q1} told {Q2} she has no talent and is just relying on her body.",
  "The queens are all annoyed with {Q1}'s constant excuses.",
  "{Q1} is delusinal and thinks she won the challenge.",
  "{Q1} threw a drink at {Q2} in the interior illusions lounge!",
  "{Q1} stormed out of the lounge and {Q2} said, 'Don't let the door hit you!'.",
  "{Q1} started reading everyone for filth while fanning herself dramatically.",
  "{Q1} swears {Q2} copied her runway concept down to the rhinestones.",
  "{Q1} is pacing while {Q2} yells that she didn't come here to make friends.",
  "{Q1} whispered that {Q2} should have been in the bottom and chaos erupted.",
  "{Q1} won't stop singing the challenge song and {Q2} is losing it.",
  "{Q1} tried to hug {Q2}, but {Q2} told her to save the fake tears for the runway.",
  "{Q1} is plotting revenge with a lipstick message if she goes home.",
  "{Q1} is giving a motivational speech while {Q2} rolls her eyes in the background.",
  "{Q1} found {Q2}'s padding in the trash and the conspiracy theories are flying.",
  "{Q1} spilled a drink on {Q2}'s outfit and blamed it on nerves.",
  "{Q1} is manifesting a win and sage-smudging the lounge while {Q2} coughs dramatically.",
  "{Q1} called {Q2} out for coasting and the entire room went silent.",
  "{Q1} is practicing her exit speech even though {Q2} thinks she's safe.",
];

// --- Helper Functions & Components ---

const getPlacementColor = (placement: Placement) => {
  switch (placement) {
    case 'WIN': return 'bg-[royalblue] text-white border-[rgba(65,105,225,0.6)]';
    case 'HIGH': return 'bg-[lightblue] text-blue-900 border-[rgba(135,206,250,0.6)]';
    case 'LOW': return 'bg-[lightpink] text-rose-900 border-[rgba(255,182,193,0.7)]';
    case 'BTM2': return 'bg-[tomato] text-white border-[rgba(255,99,71,0.7)]';
    case 'ELIM': return 'bg-zinc-800 text-zinc-500 border-zinc-900';
    case 'WINNER': return 'bg-fuchsia-500 text-white border-fuchsia-300';
    case 'RUNNER-UP': return 'bg-zinc-300 text-zinc-900 border-zinc-400';
    case 'DOUBLE SHANTAY': return 'bg-blue-400 text-blue-950 border-blue-600';
    default: return 'bg-zinc-200 text-zinc-800 border-zinc-300'; // SAFE
  }
};

const StatIcon = ({ stat }: { stat: StatType }) => {
  const icons = { design: Palette, comedy: Smile, acting: Theater, improv: Sparkles, dancing: Music, lipsync: Mic, makeover: Star, singing: Mic, branding: Tv };
  const Icon = icons[stat] || Star;
  return <Icon className="w-4 h-4 inline mr-1" />;
};

// --- Main Component ---

export default function DragRaceSimulator() {
  const [cast, setCast] = useState<Queen[]>(INITIAL_CAST);
  const [episodeIdx, setEpisodeIdx] = useState(-1);
  const [phase, setPhase] = useState<Phase>('PROMO');
  const [untuckedDrama, setUntuckedDrama] = useState<UntuckedEvent[]>([]);

  // Producer Room State
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [lipsyncers, setLipsyncers] = useState<Queen[]>([]);
  const [eliminatedQueen, setEliminatedQueen] = useState<Queen | null>(null);
  const [doubleShantayOccurred, setDoubleShantayOccurred] = useState(false);

  const activeQueens = useMemo(() => cast.filter(q => q.status === 'active'), [cast]);
  const currentEpisode = EPISODES[episodeIdx];

  // --- Simulation Logic ---

  const runSimulation = useCallback(() => {
    if (!currentEpisode) return;
    const scores = activeQueens.map(q => ({
      id: q.id,
      score: (currentEpisode.challengeType.reduce((acc, t) => acc + q.stats[t], 0) / currentEpisode.challengeType.length) + (Math.random() * 3 - 1.5)
    })).sort((a, b) => b.score - a.score);

    const newPlacements: Record<string, Placement> = {};
    const count = activeQueens.length;

    scores.forEach((s, idx) => {
      let p: Placement = 'SAFE';
      if (idx === 0) p = 'WIN';
      else if (count > 6 && idx <= 2) p = 'HIGH';
      else if (count <= 6 && count > 4 && idx === 1) p = 'HIGH';
      else if (count === 4 && idx === 1) p = 'HIGH';
      if (idx >= count - 2) p = 'BTM2';
      else if (count > 5 && idx === count - 3) p = 'LOW';
      newPlacements[s.id] = p;
    });
    setPlacements(newPlacements);
  }, [activeQueens, currentEpisode]);

  const generateUntuckedDrama = useCallback(() => {
    if (activeQueens.length < 2) return;
    const drama: UntuckedEvent[] = [];
    const numEvents = Math.min(6, Math.max(4, Math.floor(activeQueens.length / 1.5)));
    for (let i = 0; i < numEvents; i++) {
      const q1 = activeQueens[Math.floor(Math.random() * activeQueens.length)];
      let q2 = activeQueens[Math.floor(Math.random() * activeQueens.length)];
      while (q1.id === q2.id) q2 = activeQueens[Math.floor(Math.random() * activeQueens.length)];

      const template = DRAMA_TEMPLATES[Math.floor(Math.random() * DRAMA_TEMPLATES.length)];
      const includesQ2 = template.includes('{Q2}');
      const quote = template.replace('{Q1}', q1.name).replace('{Q2}', q2.name);
      drama.push({
        id: `${q1.id}-${q2.id}-${i}-${Date.now()}-${Math.random()}`,
        quote,
        queensInvolved: includesQ2 ? [q1, q2] : [q1],
      });
    }
    setUntuckedDrama(drama);
  }, [activeQueens]);

  // --- Phase Transitions ---

  const nextPhase = () => {
    switch (phase) {
      case 'PROMO': setEpisodeIdx(0); setPhase('EPISODE_INTRO'); break;
      case 'EPISODE_INTRO': 
        setPhase('PERFORMING'); 
        setTimeout(() => { runSimulation(); setPhase('UNTUCKED'); generateUntuckedDrama(); }, 2500);
        break;
      case 'UNTUCKED': setPhase('PRODUCER_HUB'); break;
      case 'PRODUCER_HUB':
        const btm2 = activeQueens.filter(q => placements[q.id] === 'BTM2');
        setLipsyncers(btm2);
        if (btm2.length === 2) setPhase('LIPSYNC');
        else if (btm2.length === 0) handleNonElimination(); // Explicit non-elim rigged by user
        break;
      case 'LIPSYNC': /* Handled by interaction */ break;
      case 'RESULTS':
        if (activeQueens.length <= 3) setPhase('CROWNING');
        else if (episodeIdx < EPISODES.length - 1) { setEpisodeIdx(prev => prev + 1); setPhase('EPISODE_INTRO'); }
        else setPhase('CROWNING');
        break;
      case 'CROWNING': setPhase('SEASON_END'); break;
    }
  };

  const handleLipsyncDecision = (eliminatedId: string | null, doubleShantay: boolean = false) => {
    setDoubleShantayOccurred(doubleShantay);
    let elimQueen: Queen | null = null;

    setCast(prev => prev.map(q => {
      if (q.status !== 'active') return q;
      let p = placements[q.id] || 'SAFE';
      
      if (doubleShantay && placements[q.id] === 'BTM2') {
         p = 'DOUBLE SHANTAY';
      } else if (q.id === eliminatedId) {
         p = 'ELIM'; elimQueen = q; 
         return { ...q, status: 'eliminated', trackRecord: [...q.trackRecord, 'ELIM'], eliminatedEpisode: currentEpisode?.number };
      }
      return { ...q, trackRecord: [...q.trackRecord, p] };
    }));
    setEliminatedQueen(elimQueen);
    setPhase('RESULTS');
  };

  const handleNonElimination = () => {
    setCast(prev => prev.map(q => (q.status === 'active' ? { ...q, trackRecord: [...q.trackRecord, placements[q.id] || 'SAFE'] } : q)));
    setEliminatedQueen(null); setDoubleShantayOccurred(true); setPhase('RESULTS');
  };

  const handleCrowning = (winnerId: string) => {
    setCast(prev => prev.map(q => {
      if (q.status !== 'active') return q;
      return { ...q, status: q.id === winnerId ? 'winner' : 'runner-up', trackRecord: [...q.trackRecord, q.id === winnerId ? 'WINNER' : 'RUNNER-UP'] };
    }));
    nextPhase();
  };

  // --- Sub-Components ---

  const QueenCard = ({ queen, statusOverride, small }: { queen: Queen, statusOverride?: string, small?: boolean }) => (
    <div className={cn("relative overflow-hidden rounded-xl border-2 transition-all duration-300 group bg-zinc-900", 
      (statusOverride || queen.status) === 'eliminated' ? 'border-zinc-800 grayscale opacity-60' : 'border-fuchsia-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]',
      small ? 'h-32 w-24' : 'h-72 w-52'
    )}>
      <img src={queen.imageUrl} className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${queen.name}&background=222&color=fff`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className={cn("font-black uppercase italic leading-none text-white drop-shadow-md", small ? 'text-xs' : 'text-xl')}>{queen.name}</h3>
      </div>
      {(statusOverride || queen.status) === 'winner' && <Crown className="absolute top-2 right-2 text-yellow-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />}
    </div>
  );

  const TrackRecordMini = ({ record }: { record: Placement[] }) => (
    <div className="flex gap-0.5 mt-1">
      {record.map((p, i) => (
        <div key={i} className={cn("w-2 h-4 rounded-sm", getPlacementColor(p))} title={`Ep ${i + 1}: ${p}`} />
      ))}
    </div>
  );

  // --- Render --- //

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      {phase !== 'PROMO' && (
        <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 p-4 flex justify-between items-center sticky top-0 z-40">
          <div className="font-black italic text-2xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">DRAG SIM PRO</div>
          <div className="flex items-center gap-3">
            <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{phase === 'CROWNING' || phase === 'SEASON_END' ? 'SEASON FINALE' : `EPISODE ${currentEpisode?.number}`}</div>
            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border", phase === 'PRODUCER_HUB' ? 'bg-red-950 text-red-500 border-red-800 animate-pulse' : 'bg-zinc-800 border-zinc-700')}>
              {phase.replace('_', ' ')}
            </div>
          </div>
        </header>
      )}

      <main className="container mx-auto max-w-6xl p-4 flex flex-col min-h-[calc(100vh-80px)] justify-center">
        
        {/* PROMO */}
        {phase === 'PROMO' && (
          <div className="flex flex-col items-center text-center py-12">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="mb-12">
              <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-500 via-pink-500 to-red-500 drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]">
                SEASON 5<br />RUDUX
              </h1>
            </motion.div>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-16">
              {cast.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <QueenCard queen={q} small />
                </motion.div>
              ))}
            </div>
            <button onClick={nextPhase} className="group relative px-12 py-6 bg-fuchsia-600 font-black italic text-2xl uppercase tracking-widest rounded-sm overflow-hidden transition-transform active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-fuchsia-600 transition-opacity group-hover:opacity-80" />
              <span className="relative flex items-center gap-2">Start The Engines <Flame className="w-6 h-6 text-yellow-300 animate-pulse" /></span>
            </button>
          </div>
        )}

        {/* EPISODE INTRO */}
        {phase === 'EPISODE_INTRO' && currentEpisode && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-3xl mx-auto bg-zinc-900/50 p-12 rounded-3xl border border-zinc-800 backdrop-blur-sm">
            <Tv className="w-16 h-16 mx-auto text-fuchsia-500 mb-6" />
            <h2 className="text-5xl font-black italic uppercase mb-6">{currentEpisode.title}</h2>
            <p className="text-2xl text-zinc-400 mb-8 leading-relaxed">{currentEpisode.description}</p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {currentEpisode.challengeType.map(t => (
                <span key={t} className="px-4 py-2 bg-zinc-800 rounded-lg uppercase text-sm font-bold flex items-center gap-2 border border-zinc-700 text-fuchsia-300">
                  <StatIcon stat={t} /> {t} Challenge
                </span>
              ))}
            </div>
            <button onClick={nextPhase} className="bg-zinc-100 text-black font-black px-10 py-4 rounded-full text-xl hover:bg-fuchsia-300 transition-colors">BRING IT TO THE RUNWAY</button>
          </motion.div>
        )}

        {/* PERFORMING */}
        {phase === 'PERFORMING' && (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-32 h-32 text-fuchsia-500" />
            </motion.div>
            <h2 className="text-4xl font-black italic uppercase mt-8 text-zinc-300 animate-pulse">SLAYING THE CHALLENGE...</h2>
          </div>
        )}

        {/* UNTUCKED */}
        {phase === 'UNTUCKED' && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="bg-zinc-900 border-2 border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute -left-4 -top-4 text-zinc-800/30"><MessageCircle size={200} /></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-black italic uppercase text-zinc-300 mb-8 flex items-center gap-4"><HeartCrack className="text-pink-600" /> UNTUCKED LOUNGE</h2>
              <div className="space-y-6 mb-12">
                {untuckedDrama.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-zinc-950/60 p-5 rounded-2xl border border-pink-700/40 text-lg text-zinc-200 shadow-inner"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex -space-x-2">
                        {event.queensInvolved.map((queen) => (
                          <img
                            key={queen.id}
                            src={queen.imageUrl}
                            className="w-12 h-12 rounded-full border-2 border-pink-600 object-cover shadow-lg"
                            alt={queen.name}
                          />
                        ))}
                      </div>
                      <span className="uppercase text-xs tracking-[0.4em] text-pink-500 font-black">DRAMA REPORT</span>
                    </div>
                    <p className="italic leading-relaxed">"{event.quote}"</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={nextPhase} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-black px-8 py-4 rounded-xl uppercase flex items-center gap-2 ml-auto">Go to Judges <Gavel className="w-5 h-5" /></button>
            </div>
          </motion.div>
        )}

        {/* PRODUCER HUB */}
        {phase === 'PRODUCER_HUB' && (
          <div className="bg-red-950/20 border-2 border-red-900/50 p-6 rounded-3xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black italic uppercase text-red-500 flex items-center gap-3"><AlertTriangle /> PRODUCER MEDDLING</h2>
              <button 
                onClick={nextPhase} 
                disabled={activeQueens.filter(q => placements[q.id] === 'BTM2').length !== 2 && activeQueens.filter(q => placements[q.id] === 'BTM2').length !== 0}
                className="disabled:opacity-30 disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3 rounded-xl uppercase flex items-center gap-2 transition-all"
              >
                LOCK IN PLACEMENTS <Gavel className="w-4 h-4" />
              </button>
            </div>
            <div className="text-red-400 text-sm mb-4 font-bold uppercase tracking-wider">
              {activeQueens.filter(q => placements[q.id] === 'BTM2').length !== 2 
                ? "WARNING: MUST HAVE EXACTLY 2 BOTTOM QUEENS FOR A LIPSYNC (OR 0 FOR NON-ELIM)" 
                : "READY TO LIP SYNC"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {activeQueens.map(queen => (
                <div key={queen.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center gap-4 group hover:border-zinc-600 transition-colors">
                  <img src={queen.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700" />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold truncate">{queen.name}</h4>
                    <TrackRecordMini record={queen.trackRecord} />
                  </div>
                  <select 
                    value={placements[queen.id] || 'SAFE'}
                    onChange={(e) => setPlacements(prev => ({ ...prev, [queen.id]: e.target.value as Placement }))}
                    className={cn("bg-zinc-950 border-2 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none uppercase w-28 text-center", getPlacementColor(placements[queen.id] || 'SAFE'))}
                  >
                    {['WIN', 'HIGH', 'SAFE', 'LOW', 'BTM2'].map(p => <option key={p} value={p} className="bg-zinc-900 text-white">{p}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIPSYNC */}
        {phase === 'LIPSYNC' && lipsyncers.length === 2 && (
          <div className="flex flex-col items-center text-center">
            <motion.h2 animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-6xl font-black italic uppercase text-red-600 mb-2 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              LIP SYNC FOR YOUR LIFE
            </motion.h2>
            <p className="text-zinc-400 mb-12 uppercase tracking-widest">Who will live to slay another day?</p>
            
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20 mb-16">
              {lipsyncers.map((queen, idx) => (
                <div key={queen.id} className="flex flex-col items-center gap-6">
                  <motion.div initial={{ x: idx === 0 ? -100 : 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="scale-110">
                    <QueenCard queen={queen} />
                  </motion.div>
                  <div className="flex gap-2">
                    <button onClick={() => handleLipsyncDecision(lipsyncers[1-idx].id)} className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2 rounded-lg uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Shantay
                    </button>
                    <button onClick={() => handleLipsyncDecision(queen.id)} className="bg-red-900/50 hover:bg-red-900 text-red-300 font-bold px-6 py-2 rounded-lg uppercase flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Sashay
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => handleLipsyncDecision(null, true)} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm">DOUBLE SHANTAY!</button>
              <button onClick={() => { handleLipsyncDecision(lipsyncers[0].id); setTimeout(() => handleLipsyncDecision(lipsyncers[1].id), 100); }} className="bg-zinc-800 hover:bg-red-950 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm text-red-500">DOUBLE SASHAY (CHAOS)</button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {phase === 'RESULTS' && (
          <div className="flex flex-col items-center w-full">
            <AnimatePresence>
              {eliminatedQueen ? (
                 <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="bg-zinc-900 p-8 rounded-3xl border-2 border-zinc-800 text-center mb-8 max-w-md">
                   <Skull className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                   <h2 className="text-4xl font-black italic uppercase text-red-600 mb-2">SASHAY AWAY</h2>
                   <div className="flex justify-center my-6"><QueenCard queen={eliminatedQueen} statusOverride="eliminated" small /></div>
                   <p className="text-2xl font-bold uppercase">{eliminatedQueen.name}</p>
                 </motion.div>
              ) : doubleShantayOccurred ? (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-blue-900/30 border-2 border-blue-500 p-8 rounded-3xl text-center mb-8">
                  <h2 className="text-4xl font-black italic uppercase text-blue-400">SHANTAY YOU BOTH STAY!</h2>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="w-full overflow-x-auto bg-zinc-900/50 rounded-2xl border border-zinc-800 p-4 mb-8">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-zinc-500 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <th className="p-3">Queen</th>
                    {EPISODES.slice(0, episodeIdx + 1).map(e => <th key={e.number} className="p-3 text-center">Ep {e.number}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...cast].sort((a,b) => (a.status === 'active' ? -1 : 1) - (b.status === 'active' ? -1 : 1) || (b.eliminatedEpisode || 99) - (a.eliminatedEpisode || 99)).map(q => (
                    <tr key={q.id} className={cn("border-b border-zinc-800/50", q.status === 'eliminated' && "opacity-40 grayscale")}>
                      <td className="p-3 font-bold flex items-center gap-2">
                        <img src={q.imageUrl} className="w-6 h-6 rounded-full object-cover" /> {q.name}
                      </td>
                      {q.trackRecord.map((p, i) => (
                        <td key={i} className="p-1 text-center"><div className={cn("px-2 py-1 rounded text-[10px] font-black uppercase w-full", getPlacementColor(p))}>{p === 'DOUBLE SHANTAY' ? 'SAVE' : p}</div></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={nextPhase} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black px-12 py-4 rounded-full text-xl uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105">
              NEXT EPISODE <ChevronRight />
            </button>
          </div>
        )}

        {/* CROWNING */}
        {phase === 'CROWNING' && (
          <div className="text-center">
             <Crown className="w-24 h-24 mx-auto text-yellow-400 mb-6 animate-bounce" />
             <h2 className="text-6xl font-black italic uppercase mb-2">THE TIME HAS COME</h2>
             <p className="text-2xl text-zinc-400 mb-12">To crown our queen. The decision is yours.</p>
             <div className="flex flex-wrap justify-center gap-8">
               {activeQueens.map(queen => (
                 <motion.button 
                    key={queen.id} whileHover={{ scale: 1.05, y: -10 }} 
                    onClick={() => handleCrowning(queen.id)}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <QueenCard queen={queen} />
                    <div className="bg-zinc-800 group-hover:bg-yellow-500 group-hover:text-black transition-colors px-6 py-3 rounded-full font-black uppercase">CROWN {queen.name}</div>
                    <TrackRecordMini record={queen.trackRecord} />
                 </motion.button>
               ))}
             </div>
          </div>
        )}

        {/* SEASON END */}
        {phase === 'SEASON_END' && (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-fuchsia-500 blur-[100px] opacity-30 animate-pulse" />
                <QueenCard queen={cast.find(q => q.status === 'winner')!} statusOverride="winner" />
              </div>
              <h1 className="text-7xl font-black italic uppercase mt-12 text-fuchsia-500 drop-shadow-[0_0_20px_rgba(217,70,239,0.8)]">{cast.find(q => q.status === 'winner')?.name}</h1>
              <p className="text-3xl font-bold uppercase tracking-[0.5em] mt-4 text-zinc-300">AMERICA'S NEXT DRAG SUPERSTAR</p>
           </motion.div>
        )}

      </main>
    </div>
  );
}
