'use client';

import { motion } from 'framer-motion';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string) => void;
}

export function ChessBoard({ game, onMove }: ChessBoardProps) {
  const board = game.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const handleSquareClick = (square: string) => {
    // Simple move handler - you'll expand this
    console.log('Clicked:', square);
  };

  return (
    <motion.div 
      className="chess-board"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {board.map((row, rankIndex) =>
        row.map((piece, fileIndex) => {
          const isDark = (rankIndex + fileIndex) % 2 === 1;
          const square = `${files[fileIndex]}${ranks[rankIndex]}`;
          const pieceSymbol = piece ? getPieceSymbol(piece.type, piece.color) : null;

          return (
            <motion.div
              key={square}
              className={`square ${isDark ? 'dark' : 'light'}`}
              onClick={() => handleSquareClick(square)}
              whileHover={{ scale: piece ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {pieceSymbol && (
                <motion.span
                  className="piece"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {pieceSymbol}
                </motion.span>
              )}
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}

function getPieceSymbol(type: string, color: 'w' | 'b'): string {
  const symbols: Record<string, Record<string, string>> = {
    w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
    b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
  };
  return symbols[color][type] || '';
}