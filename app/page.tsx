'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Chess } from 'chess.js';
import { MagisterEngine, MagisterCommentary, Expression } from '@/lib/magister';
import { ChessAI, difficultyLevels } from '@/lib/ai';
import { MagisterAvatar } from '@/components/MagisterAvatar';
import { CommentaryBubble } from '@/components/CommentaryBubble';
import { ChessBoard } from '@/components/ChessBoard';
import { MoveHistory } from '@/components/MoveHistory';
import { CapturedPieces } from '@/components/CapturedPieces';
import { SettingsPanel } from '@/components/SettingsPanel';
import { PromotionModal } from '@/components/PromotionModal';
import { GameOverModal } from '@/components/GameOverModal';
import { RotateCcw, Flag, Settings, Trophy, Volume2, VolumeX } from 'lucide-react';

export default function Home() {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [state, setState] = useState<'playing' | 'check' | 'checkmate' | 'draw'>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  
  const [magister] = useState(() => new MagisterEngine());
  const [chessAI] = useState(() => new ChessAI(3));
  const [commentary, setCommentary] = useState<MagisterCommentary | null>(null);
  const [expression, setExpression] = useState<Expression>('neutral');
  const [isThinking, setIsThinking] = useState(false);
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<keyof typeof difficultyLevels>('intermediate');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playerName, setPlayerName] = useState('Guest');

  useEffect(() => {
    const opening = magister.getOpeningComment();
    setCommentary(opening);
    setExpression(opening.expression);
    magister.incrementSessionGames();
  }, []);

  const handleMove = useCallback((from: string, to: string, promotion?: string) => {
    try {
      const move = game.move({ from, to, promotion: promotion || 'q' });
      if (move) {
        const newGame = new Chess(game.fen());
        setGame(newGame);
        setFen(newGame.fen());
        setTurn(newGame.turn());
        setMoveHistory(prev => [...prev, move.san]);
        
        if (newGame.isCheckmate()) setState('checkmate');
        else if (newGame.isCheck()) setState('check');
        else if (newGame.isDraw()) setState('draw');
        else setState('playing');
        
        const response = magister.analyzeMove(move.san, 0, 0, 5, !!move.captured, move.san.includes('+'));
        setCommentary(response);
        setExpression(response.expression);
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } catch (e) {
      console.error('Invalid move');
    }
  }, [game, magister]);

  useEffect(() => {
    if (turn === 'b' && state === 'playing') {
      setIsThinking(true);
      setCommentary(magister.getThinkingComment());
      
      setTimeout(() => {
        const bestMove = chessAI.getBestMove(game);
        if (bestMove) {
          handleMove(bestMove.from, bestMove.to, bestMove.promotion);
        }
        setIsThinking(false);
      }, 1500);
    }
  }, [turn, state, game, chessAI, magister, handleMove]);

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setTurn('w');
    setState('playing');
    setMoveHistory([]);
    setSelectedSquare(null);
    setValidMoves([]);
    magister.resetGame();
    const opening = magister.getOpeningComment();
    setCommentary(opening);
    setExpression(opening.expression);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <motion.header className="text-center mb-6" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-6xl font-bold text-chess-gold mb-2" style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.5)' }}>
          ♔ Chess Renaissance ♚
        </h1>
        <p className="text-gray-400 text-lg">Where Every Game Becomes a Conversation</p>
      </motion.header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center">
        <motion.div className="flex flex-col items-center gap-6 lg:w-80" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="text-center">
            <div className="text-chess-gold font-bold mb-2">🤖 The Magister</div>
            <div className="text-sm text-gray-400">{difficultyLevels[difficulty].label}</div>
          </div>
          <MagisterAvatar expression={expression} isThinking={isThinking} />
          <CommentaryBubble commentary={commentary} />
          <div className="game-status w-full">
            {state === 'check' && '⚠️ Check!'}
            {state === 'checkmate' && (turn === 'b' ? '🎉 Checkmate! You Win!' : '💀 Checkmate!')}
            {state === 'draw' && '🤝 Draw!'}
            {state === 'playing' && (turn === 'w' ? 'Your Move' : 'The Magister Contemplates...')}
          </div>
          <div className="flex gap-2 w-full">
            <button onClick={resetGame} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <RotateCcw size={18} /> New Game
            </button>
            <button onClick={() => setSettingsOpen(true)} className="btn-secondary">
              <Settings size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div className="flex flex-col items-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <ChessBoard game={game} onMove={handleMove} />
        </motion.div>

        <motion.div className="lg:w-80 w-full" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <MoveHistory moves={moveHistory} />
        </motion.div>
      </div>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} difficulty={difficulty} onDifficultyChange={setDifficulty} soundEnabled={soundEnabled} onSoundToggle={() => setSoundEnabled(!soundEnabled)} playerName={playerName} onPlayerNameChange={setPlayerName} />
    </main>
  );
}