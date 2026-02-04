'use client';

import { motion } from 'framer-motion';

interface PromotionModalProps {
  isOpen: boolean;
  onSelect: (piece: string) => void;
  color: 'w' | 'b';
}

export function PromotionModal({ isOpen, onSelect, color }: PromotionModalProps) {
  if (!isOpen) return null;

  const pieces = ['q', 'r', 'b', 'n'];
  const symbols = color === 'w' ? ['♕', '♖', '♗', '♘'] : ['♛', '♜', '♝', '♞'];

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-chess-dark border-2 border-chess-gold rounded-2xl p-6 max-w-sm w-full"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-chess-gold text-center mb-2">
          🎉 Pawn Promotion!
        </h3>
        <p className="text-gray-400 text-center mb-6">
          Choose your destiny:
        </p>

        <div className="grid grid-cols-4 gap-3">
          {pieces.map((piece, idx) => (
            <motion.button
              key={piece}
              onClick={() => onSelect(piece)}
              className="aspect-square bg-white/5 border-2 border-chess-gold/30 rounded-xl flex items-center justify-center text-4xl hover:bg-chess-gold/20 hover:border-chess-gold transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {symbols[idx]}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}