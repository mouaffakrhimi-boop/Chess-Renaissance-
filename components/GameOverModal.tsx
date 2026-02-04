'use client';

import { motion } from 'framer-motion';
import { Trophy, Skull, Handshake, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  onNewGame: () => void;
  onRematch: () => void;
}

export function GameOverModal({ isOpen, result, onNewGame, onRematch }: GameOverModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (result) {
      case 'win': return <Trophy size={64} className="text-yellow-400" />;
      case 'loss': return <Skull size={64} className="text-red-400" />;
      default: return <Handshake size={64} className="text-blue-400" />;
    }
  };

  const getTitle = () => {
    switch (result) {
      case 'win': return 'Victory!';
      case 'loss': return 'Defeat...';
      default: return 'Draw!';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gradient-to-b from-chess-dark to-chess-light border-2 border-chess-gold rounded-3xl p-8 max-w-md w-full text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div className="flex justify-center mb-6">
          {getIcon()}
        </motion.div>

        <motion.h2 className={`text-4xl font-bold mb-4 ${
          result === 'win' ? 'text-yellow-400' : 
          result === 'loss' ? 'text-red-400' : 'text-blue-400'
        }`}>
          {getTitle()}
        </motion.h2>

        <motion.button
          onClick={onRematch}
          className="w-full bg-chess-gold text-chess-dark font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Rematch
        </motion.button>

        <motion.button
          onClick={onNewGame}
          className="w-full mt-3 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
        >
          New Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
}