/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, 
  Lock, 
  Unlock, 
  ChevronRight, 
  RefreshCcw, 
  Trophy, 
  Brain, 
  Zap, 
  Sun, 
  Shield, 
  DoorOpen, 
  Hammer, 
  Database, 
  Waves,
  Microscope,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { RoomId, GameState, ORGANELLES, Organelle } from './types';
import { SORT_BANK, DECODE_BANK, DRAG_BANK, SortItem, DecodeSequence, DragFeature } from './constants';

const ICON_MAP: Record<string, any> = {
  Brain, Zap, Sun, Shield, DoorOpen, Hammer, Database, Waves
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: 'intro',
    completedRooms: [],
    inventory: [],
    startTime: null,
    endTime: null
  });

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: null }), 3000);
  };

  const nextRoom = (roomId: RoomId) => {
    setGameState(prev => ({
      ...prev,
      currentRoom: roomId,
      completedRooms: [...prev.completedRooms, prev.currentRoom]
    }));
  };

  const startGame = () => {
    setGameState({
      currentRoom: 'organelle-match',
      completedRooms: [],
      inventory: [],
      startTime: Date.now(),
      endTime: null
    });
  };

  const resetGame = () => {
    setGameState({
      currentRoom: 'intro',
      completedRooms: [],
      inventory: [],
      startTime: null,
      endTime: null
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Microscope className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase">Cellular Breach</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Protocol: System Override v2.0</p>
            </div>
          </div>
          
          {gameState.startTime && !gameState.endTime && (
            <div className="text-right font-mono">
              <p className="text-[10px] text-zinc-500 uppercase">Time Remaining</p>
              <Timer 
                startTime={gameState.startTime} 
                onTimeUp={() => setGameState(prev => ({ ...prev, currentRoom: 'game-over', endTime: Date.now() }))} 
              />
            </div>
          )}
        </header>

        {/* Game Content */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {gameState.currentRoom === 'intro' && (
              <IntroRoom key="intro" onStart={startGame} />
            )}
            {gameState.currentRoom === 'organelle-match' && (
              <OrganelleMatchRoom key="match" onComplete={() => nextRoom('cell-sort')} showFeedback={showFeedback} />
            )}
            {gameState.currentRoom === 'cell-sort' && (
              <CellSortRoom key="sort" onComplete={() => nextRoom('nucleus-decode')} showFeedback={showFeedback} />
            )}
            {gameState.currentRoom === 'nucleus-decode' && (
              <NucleusDecodeRoom key="decode" onComplete={() => nextRoom('membrane-drag')} showFeedback={showFeedback} />
            )}
            {gameState.currentRoom === 'membrane-drag' && (
              <MembraneDragRoom key="drag" onComplete={() => {
                setGameState(prev => ({ ...prev, currentRoom: 'victory', endTime: Date.now() }));
              }} showFeedback={showFeedback} />
            )}
            {gameState.currentRoom === 'victory' && (
              <VictoryRoom key="victory" gameState={gameState} onReset={resetGame} />
            )}
            {gameState.currentRoom === 'game-over' && (
              <GameOverRoom key="game-over" onReset={resetGame} />
            )}
          </AnimatePresence>
        </div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback.type && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full border flex items-center gap-3 shadow-2xl backdrop-blur-md ${
                feedback.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-medium">{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        {gameState.currentRoom !== 'intro' && gameState.currentRoom !== 'victory' && gameState.currentRoom !== 'game-over' && (
          <footer className="mt-12">
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase mb-2 font-mono">
              <span>Containment Status</span>
              <span>Sector {gameState.completedRooms.length + 1} / 4</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(gameState.completedRooms.length / 4) * 100}%` }}
              />
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}

function Timer({ startTime, onTimeUp }: { startTime: number; onTimeUp: () => void }) {
  const TOTAL_TIME = 20 * 60; // 20 minutes in seconds
  const [remaining, setRemaining] = useState(TOTAL_TIME);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const timeLeft = Math.max(0, TOTAL_TIME - elapsed);
      setRemaining(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <span className={`tabular-nums ${remaining < 60 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
      {formatTime(remaining)}
    </span>
  );
}

function IntroRoom({ onStart }: { onStart: () => void; key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="text-center relative"
    >
      {/* Emergency Alert Border Effect */}
      <div className="absolute -inset-8 border-2 border-rose-500/20 rounded-3xl animate-pulse pointer-events-none" />
      
      <div className="inline-block p-6 bg-rose-500/10 rounded-full mb-8 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
        <AlertCircle className="w-16 h-16 text-rose-500 animate-bounce" />
      </div>

      <h2 className="text-6xl font-black mb-6 tracking-tighter uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        Cellular Breach
      </h2>

      <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-2xl mb-10 max-w-xl mx-auto backdrop-blur-sm">
        <p className="text-rose-500 font-black tracking-[0.2em] uppercase mb-4 animate-pulse">
          CRITICAL ALERT: CONTAINMENT FAILURE
        </p>
        <p className="text-zinc-300 leading-relaxed text-lg">
          <span className="text-rose-600 font-black">WARNING:</span> Biological containment has been compromised. 
          The automated defense grid is in total lockdown. You have exactly 
          <span className="text-white font-bold"> 20 minutes </span> to override the system by verifying your 
          cellular biology credentials.
        </p>
      </div>

      <div className="space-y-6">
        <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">
          Unauthorized access will result in permanent lockout
        </p>
        
        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-rose-600 text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all hover:bg-rose-500 hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_40px_rgba(225,29,72,0.4)]"
        >
          <span className="relative z-10 flex items-center gap-3">
            Initialize Override <ChevronRight className="w-6 h-6" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
}

function OrganelleMatchRoom({ onComplete, showFeedback }: { onComplete: () => void; showFeedback: (m: string, t: 'success' | 'error') => void; key?: string }) {
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  
  const targets = useMemo(() => {
    // Pick 5 random organelles from the 8 available for replayability
    return [...ORGANELLES].sort(() => Math.random() - 0.5).slice(0, 5);
  }, []);

  const handleMatch = (functionText: string) => {
    if (!selectedOrganelle) return;

    if (selectedOrganelle.function === functionText) {
      setMatches(prev => ({ ...prev, [selectedOrganelle.id]: functionText }));
      setSelectedOrganelle(null);
      showFeedback("Correct! Function identified.", "success");
    } else {
      showFeedback("Incorrect function mapping.", "error");
    }
  };

  useEffect(() => {
    if (Object.keys(matches).length === targets.length) {
      setTimeout(onComplete, 1500);
    }
  }, [matches, targets, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Sector 01: Functional Analysis</h3>
        <p className="text-zinc-500 text-sm">Map organelles to their biological functions to unlock the next sector.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-[10px] text-zinc-500 uppercase font-mono mb-2">Organelles</p>
          {targets.map(org => {
            const Icon = ICON_MAP[org.icon];
            const isMatched = matches[org.id];
            return (
              <button
                key={org.id}
                disabled={!!isMatched}
                onClick={() => setSelectedOrganelle(org)}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${
                  isMatched 
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 opacity-50' 
                    : selectedOrganelle?.id === org.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedOrganelle?.id === org.id ? 'bg-emerald-500 text-emerald-950' : 'bg-zinc-800'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold uppercase tracking-wide text-sm">{org.name}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-zinc-500 uppercase font-mono mb-2">Functions</p>
          {targets.map(org => org.function).sort().map((func, idx) => {
            const isMatched = Object.values(matches).includes(func);
            return (
              <button
                key={idx}
                disabled={isMatched}
                onClick={() => handleMatch(func)}
                className={`w-full p-4 rounded-xl border text-sm leading-snug transition-all text-left ${
                  isMatched
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 opacity-50'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                {func}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}


function CellSortRoom({ onComplete, showFeedback }: { onComplete: () => void; showFeedback: (m: string, t: 'success' | 'error') => void; key?: string }) {
  const items = useMemo(() => {
    // Pick 8 random items from the sort bank for replayability
    return [...SORT_BANK].sort(() => Math.random() - 0.5).slice(0, 8);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSort = (type: 'plant' | 'animal' | 'both') => {
    if (items[currentIndex].type === type) {
      showFeedback("Correct classification.", "success");
    } else {
      showFeedback("Incorrect. Re-evaluating data.", "error");
    }

    if (currentIndex < items.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setTimeout(onComplete, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-12">
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Sector 02: Structural Classification</h3>
        <p className="text-zinc-500 text-sm">Classify the structure or characteristic as Plant, Animal, or Both.</p>
      </div>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-3xl mb-12 shadow-2xl"
          >
            <p className="text-[10px] text-zinc-500 uppercase font-mono mb-4">Analyzing Data...</p>
            <h4 className="text-3xl font-black uppercase tracking-tighter text-emerald-400">{items[currentIndex].name}</h4>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => handleSort('animal')}
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all uppercase font-bold tracking-widest text-xs"
          >
            Animal
          </button>
          <button 
            onClick={() => handleSort('both')}
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all uppercase font-bold tracking-widest text-xs"
          >
            Both
          </button>
          <button 
            onClick={() => handleSort('plant')}
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all uppercase font-bold tracking-widest text-xs"
          >
            Plant
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NucleusDecodeRoom({ onComplete, showFeedback }: { onComplete: () => void; showFeedback: (m: string, t: 'success' | 'error') => void; key?: string }) {
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  const sequences = useMemo(() => {
    // Pick 3 random sequences from the decode bank for replayability
    return [...DECODE_BANK].sort(() => Math.random() - 0.5).slice(0, 3);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase() === sequences[currentStep].answer) {
      showFeedback("Sequence decrypted.", "success");
      setInput('');
      if (currentStep < sequences.length - 1) {
        setCurrentStep(s => s + 1);
      } else {
        setTimeout(onComplete, 1000);
      }
    } else {
      showFeedback("Invalid sequence key.", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-md mx-auto text-center"
    >
      <div className="mb-12">
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Sector 03: Genetic Core Access</h3>
        <p className="text-zinc-500 text-sm">Sequence {currentStep + 1} of {sequences.length}. Decrypt the genetic keys.</p>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl mb-8 font-mono text-left">
        <p className="text-emerald-500/50 text-[10px] mb-4 uppercase tracking-widest">Encrypted Hint:</p>
        <p className="text-xl text-emerald-400 leading-relaxed min-h-[80px]">
          "{sequences[currentStep].hint}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER CODE"
          className="w-full bg-black border-2 border-zinc-800 rounded-xl p-4 text-center text-2xl font-black tracking-widest focus:border-emerald-500 outline-none transition-all placeholder:text-zinc-800"
          autoFocus
        />
        <button 
          type="submit"
          className="w-full py-4 bg-emerald-500 text-emerald-950 font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all"
        >
          Decrypt Sequence
        </button>
      </form>
    </motion.div>
  );
}

function MembraneDragRoom({ onComplete, showFeedback }: { onComplete: () => void; showFeedback: (m: string, t: 'success' | 'error') => void; key?: string }) {
  const items = useMemo(() => {
    // Pick 6 random features from the drag bank for replayability
    return [...DRAG_BANK].sort(() => Math.random() - 0.5).slice(0, 6);
  }, []);

  const [placed, setPlaced] = useState<Record<string, 'plant' | 'animal'>>({});

  const handlePlace = (itemId: string, bucket: 'plant' | 'animal') => {
    const item = items.find(i => i.id === itemId);
    if (item?.target === bucket) {
      setPlaced(prev => ({ ...prev, [itemId]: bucket }));
      showFeedback("Correct placement.", "success");
    } else {
      showFeedback("Incorrect sector for this feature.", "error");
    }
  };

  useEffect(() => {
    if (Object.keys(placed).length === items.length) {
      setTimeout(onComplete, 1500);
    }
  }, [placed, items.length, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Sector 04: Membrane Integrity</h3>
        <p className="text-zinc-500 text-sm">Drag features to their correct cellular classification.</p>
      </div>

      <div className="grid grid-cols-2 gap-8 h-64">
        <div 
          className="bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-3xl flex flex-col items-center justify-center p-4 relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const id = e.dataTransfer.getData('text');
            handlePlace(id, 'plant');
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Plant Cell</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(placed).filter(([_, b]) => b === 'plant').map(([id]) => (
              <div key={id} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] uppercase font-bold">
                {items.find(i => i.id === id)?.name}
              </div>
            ))}
          </div>
        </div>

        <div 
          className="bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-3xl flex flex-col items-center justify-center p-4 relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const id = e.dataTransfer.getData('text');
            handlePlace(id, 'animal');
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">Animal Cell</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(placed).filter(([_, b]) => b === 'animal').map(([id]) => (
              <div key={id} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] uppercase font-bold">
                {items.find(i => i.id === id)?.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center pt-8">
        {items.filter(i => !placed[i.id]).map(item => (
          <motion.div
            key={item.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text', item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab active:cursor-grabbing text-sm font-bold uppercase tracking-wider text-zinc-300 hover:border-zinc-600"
          >
            {item.name}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function GameOverRoom({ onReset }: { onReset: () => void; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="inline-block p-6 bg-rose-500/10 rounded-full mb-8 border border-rose-500/20">
        <AlertCircle className="w-16 h-16 text-rose-400" />
      </div>
      <h2 className="text-6xl font-black mb-4 tracking-tighter uppercase italic text-rose-400">Containment Failed</h2>
      <p className="text-zinc-400 mb-12 max-w-md mx-auto">
        Time has expired. The biological breach is total. System must be re-initialized.
      </p>

      <button 
        onClick={onReset}
        className="flex items-center gap-2 mx-auto px-8 py-4 border border-zinc-800 rounded-xl text-zinc-400 font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
      >
        <RefreshCcw className="w-5 h-5" /> RE-INITIALIZE PROTOCOL
      </button>
    </motion.div>
  );
}

function VictoryRoom({ gameState, onReset }: { gameState: GameState; onReset: () => void; key?: string }) {
  const timeTaken = gameState.endTime && gameState.startTime 
    ? Math.floor((gameState.endTime - gameState.startTime) / 1000) 
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="inline-block p-6 bg-emerald-500/10 rounded-full mb-8 border border-emerald-500/20">
        <Trophy className="w-16 h-16 text-emerald-400" />
      </div>
      <h2 className="text-6xl font-black mb-4 tracking-tighter uppercase italic text-emerald-400">Containment Re-established</h2>
      <p className="text-zinc-400 mb-12 max-w-md mx-auto">
        Congratulations, Researcher. You have successfully navigated the lab and proven your expertise in cellular biology.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-12">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Time Elapsed</p>
          <p className="text-2xl font-bold text-white">{formatTime(timeTaken)}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Status</p>
          <p className="text-2xl font-bold text-white uppercase tracking-widest">Secure</p>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="flex items-center gap-2 mx-auto px-8 py-4 border border-zinc-800 rounded-xl text-zinc-400 font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
      >
        <RefreshCcw className="w-5 h-5" /> RE-INITIALIZE PROTOCOL
      </button>
    </motion.div>
  );
}
