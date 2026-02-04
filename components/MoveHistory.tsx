'use client';

import { motion } from 'framer-motion';

interface MoveHistoryProps {
  moves: string[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const formatMoves = () => {
    const pairs: { number: number; white: string; black?: string }[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      pairs.push({
        number: Math.floor(i / 2) + 1,
        white: moves[i],
        black: moves[i + 1]
      });
    }
    return pairs;
  };

  const movePairs = formatMoves();

  return (
    <div className="move-history">
      <h3 className="text-chess-gold font-bold mb-3 text-sm uppercase">
        📜 Chronicle of Battle
      </h3>
      <div className="space-y-1">
        {movePairs.length === 0 ? (
          <p className="text-gray-500 text-sm italic">The story begins...</p>
        ) : (
          movePairs.map((move, idx) => (
            <motion.div
              key={idx}
              className="flex justify-between py-1 border-b border-white/10 font-mono text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <span className="text-gray-500">{move.number}.</span>
              <div className="flex gap-4">
                <span className="text-chess-gold">{move.white}</span>
                {move.black && <span className="text-gray-300">{move.black}</span>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}