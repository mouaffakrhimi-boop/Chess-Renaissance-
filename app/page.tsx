'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js';
import { 
  RotateCcw, 
  Settings, 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight,
  Volume2,
  VolumeX,
  Crown,
  Swords
} from 'lucide-react';

// Piece SVGs - Premium looking, consistent across all browsers
const pieces: Record<string, Record<string, string>> = {
  w: {
    k: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png',
    q: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png',
    r: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png',
    b: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png',
    n: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png',
    p: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png',
  },
  b: {
    k: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png',
    q: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png',
    r: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png',
    b: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png',
    n: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png',
    p: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png',
  }
};

export default function ChessRenaissance() {
  const [game, setGame] = useState<Chess | null>(null);
  const [fen, setFen] = useState('start');
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{w: string[], b: string[]}>({w: [], b: []});
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [gameState, setGameState] = useState<'playing' | 'check' | 'checkmate' | 'draw'>('playing');
  const [commentary, setCommentary] = useState("Welcome to Chess Renaissance. I am The Magister. Make your first move.");
  const [isThinking, setIsThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playerTime, setPlayerTime] = useState(600); // 10 minutes
  const [aiTime, setAiTime] = useState(600);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game on client only
  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameState !== 'playing') return;
    
    const interval = setInterval(() => {
      if (turn === 'w') {
        setPlayerTime(t => Math.max(0, t - 1));
      } else {
        setAiTime(t => Math.max(0, t - 1));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [turn, gameStarted, gameState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSquareColor = (square: string) => {
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    return (file + rank) % 2 === 0 ? 'bg-[#ebecd0]' : 'bg-[#779556]';
  };

  const getPiece = (square: string) => {
    if (!game) return null;
    const piece = game.get(square as any);
    if (!piece) return null;
    return pieces[piece.color][piece.type];
  };

  const handleSquareClick = useCallback((square: string) => {
    if (!game || isThinking || gameState !== 'playing') return;

    // If clicking a piece of current turn, select it
    const piece = game.get(square as any);
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as any, verbose: true });
      setLegalMoves(moves.map(m => m.to));
      return;
    }

    // If a square is selected, try to move
    if (selectedSquare && legalMoves.includes(square)) {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });

        if (move) {
          // Update captured pieces
          if (move.captured) {
            setCapturedPieces(prev => ({
              ...prev,
              [move.color === 'w' ? 'b' : 'w']: [...prev[move.color === 'w' ? 'b' : 'w'], move.captured]
            }));
          }

          setGame(new Chess(game.fen()));
          setFen(game.fen());
          setMoveHistory(prev => [...prev, move.san]);
          setLastMove({from: selectedSquare, to: square});
          setSelectedSquare(null);
          setLegalMoves([]);
          setTurn(game.turn());
          setGameStarted(true);

          // Update commentary based on move quality
          updateCommentary(move, game);

          // Check game state
          if (game.isCheckmate()) {
            setGameState('checkmate');
            setCommentary(turn === 'w' ? "Magnificent! You have defeated me." : "Checkmate. Victory is mine.");
          } else if (game.isDraw()) {
            setGameState('draw');
            setCommentary("A draw. Well fought.");
          } else if (game.isCheck()) {
            setGameState('check');
            setCommentary("Check!");
          } else {
            setGameState('playing');
          }

          // AI Move
          if (!game.isGameOver()) {
            setIsThinking(true);
            setTimeout(() => makeAIMove(), 1000);
          }
        }
      } catch (e) {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [game, selectedSquare, legalMoves, turn, isThinking, gameState]);

  const makeAIMove = () => {
    if (!game) return;
    
    // Simple AI: random legal move
    const moves = game.moves({ verbose: true });
    if (moves.length > 0) {
      // Pick a decent move (capture if possible, or random)
      const captureMoves = moves.filter(m => m.captured);
      const move = captureMoves.length > 0 
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : moves[Math.floor(Math.random() * moves.length)];

      game.move(move);
      setGame(new Chess(game.fen()));
      setFen(game.fen());
      setMoveHistory(prev => [...prev, move.san]);
      setLastMove({from: move.from, to: move.to});
      setTurn(game.turn());
      
      setCommentary(getRandomCommentary(move));
    }
    setIsThinking(false);
  };

  const updateCommentary = (move: any, game: Chess) => {
    if (move.captured) {
      setCommentary(`You captured my ${move.captured}. Bold.`);
    } else if (move.san.includes('+')) {
      setCommentary("Check! The pressure builds.");
    } else if (move.san.includes('O-O')) {
      setCommentary("Castling. Securing the king.");
    } else {
      const openings = ["An interesting choice.", "I see your strategy.", "The plot thickens.", "Your move intrigues me."];
      setCommentary(openings[Math.floor(Math.random() * openings.length)]);
    }
  };

  const getRandomCommentary = (move: any) => {
    const responses = [
      "My turn.",
      "I respond.",
      "Your move challenges me.",
      "I see what you're doing.",
      "An interesting development."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setCapturedPieces({w: [], b: []});
    setTurn('w');
    setGameState('playing');
    setSelectedSquare(null);
    setLegalMoves([]);
    setPlayerTime(600);
    setAiTime(600);
    setLastMove(null);
    setGameStarted(false);
    setCommentary("A new game begins. Show me your best.");
    setIsThinking(false);
  };

  const resign = () => {
    setGameState('checkmate');
    setCommentary("You resign. A wise choice.");
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-[#312e2b] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#81b64c] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="min-h-screen bg-[#312e2b] text-white font-sans">
      {/* Header */}
      <header className="bg-[#272522] border-b border-[#3d3a37] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-[#81b64c]" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Chess Renaissance</h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Where Every Game Becomes Art</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-[#3d3a37] rounded-lg transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-[#3d3a37] rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Panel - Player Info */}
          <div className="w-full lg:w-80 space-y-4">
            {/* AI Info */}
            <div className="bg-[#272522] rounded-xl p-4 border border-[#3d3a37]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#81b64c] to-[#5f8e3a] rounded-full flex items-center justify-center">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">The Magister</h3>
                  <span className="text-sm text-[#81b64c]">AI Opponent</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-[#312e2b] rounded-lg px-4 py-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className={`text-2xl font-mono font-bold ${aiTime < 60 ? 'text-red-500' : 'text-white'}`}>
                  {formatTime(aiTime)}
                </span>
              </div>
              {/* Captured by AI */}
              <div className="mt-3 flex flex-wrap gap-1 min-h-[30px]">
                {capturedPieces.b.map((piece, i) => (
                  <img key={i} src={pieces.w[piece as keyof typeof pieces.w]} alt="" className="w-6 h-6 opacity-80" />
                ))}
              </div>
            </div>

            {/* Commentary Box */}
            <motion.div 
              key={commentary}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#272522] rounded-xl p-4 border border-[#3d3a37] min-h-[100px]"
            >
              <p className="text-gray-300 italic leading-relaxed">"{commentary}"</p>
              {isThinking && (
                <div className="flex items-center gap-2 mt-2 text-[#81b64c]">
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex gap-1"
                  >
                    <span className="w-2 h-2 bg-current rounded-full" />
                    <span className="w-2 h-2 bg-current rounded-full" />
                    <span className="w-2 h-2 bg-current rounded-full" />
                  </motion.div>
                  <span className="text-sm">The Magister is thinking...</span>
                </div>
              )}
            </motion.div>

            {/* Game Status */}
            {gameState !== 'playing' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`rounded-xl p-4 text-center font-bold text-lg ${
                  gameState === 'checkmate' && turn === 'b' ? 'bg-green-600' : 
                  gameState === 'checkmate' ? 'bg-red-600' : 'bg-yellow-600'
                }`}
              >
                {gameState === 'checkmate' && turn === 'b' ? '🎉 Victory!' : 
                 gameState === 'checkmate' ? '💀 Checkmate' : 
                 '🤝 Draw'}
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex gap-2">
              <button 
                onClick={resetGame}
                className="flex-1 bg-[#81b64c] hover:bg-[#6a9a3f] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                New Game
              </button>
              <button 
                onClick={resign}
                disabled={gameState !== 'playing'}
                className="bg-[#3d3a37] hover:bg-[#4a4744] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center - Chess Board */}
          <div className="flex flex-col items-center">
            {/* Coordinates Top */}
            <div className="flex w-[480px] mb-1">
              {files.map(f => (
                <div key={f} className="flex-1 text-center text-xs text-gray-500 font-mono">{f}</div>
              ))}
            </div>
            
            <div className="flex">
              {/* Coordinates Left */}
              <div className="flex flex-col justify-around mr-1">
                {ranks.map(r => (
                  <div key={r} className="text-xs text-gray-500 font-mono h-[60px] flex items-center">{r}</div>
                ))}
              </div>

              {/* Board */}
              <div className="grid grid-cols-8 gap-0 border-4 border-[#272522] rounded-sm overflow-hidden shadow-2xl">
                {ranks.map(rank => (
                  files.map(file => {
                    const square = file + rank;
                    const piece = getPiece(square);
                    const isSelected = selectedSquare === square;
                    const isLegalMove = legalMoves.includes(square);
                    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
                    const isCheck = gameState === 'check' && game.get(square as any)?.type === 'k' && game.get(square as any)?.color === turn;

                    return (
                      <motion.div
                        key={square}
                        onClick={() => handleSquareClick(square)}
                        className={`
                          w-[60px] h-[60px] relative cursor-pointer flex items-center justify-center
                          ${getSquareColor(square)}
                          ${isSelected ? 'ring-4 ring-[#f0c14b] ring-inset z-10' : ''}
                          ${isLastMove ? 'after:absolute after:inset-0 after:bg-[#f7ec5e] after:opacity-40' : ''}
                          ${isCheck ? 'bg-red-600/50' : ''}
                        `}
                        whileHover={{ scale: piece ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {piece && (
                          <motion.img 
                            src={piece} 
                            alt="" 
                            className="w-[50px] h-[50px] select-none drop-shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                        )}
                        {isLegalMove && !piece && (
                          <div className="w-4 h-4 bg-[#000000]/20 rounded-full" />
                        )}
                        {isLegalMove && piece && (
                          <div className="absolute inset-0 bg-[#ff0000]/30 rounded-full m-2" />
                        )}
                      </motion.div>
                    );
                  })
                ))}
              </div>
            </div>

            {/* Coordinates Bottom */}
            <div className="flex w-[480px] mt-1">
              {files.map(f => (
                <div key={f} className="flex-1 text-center text-xs text-gray-500 font-mono">{f}</div>
              ))}
            </div>
          </div>

          {/* Right Panel - Move History & Player */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Player Info */}
            <div className="bg-[#272522] rounded-xl p-4 border border-[#3d3a37]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#3d3a37] rounded-full flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">You</h3>
                  <span className="text-sm text-gray-400">White pieces</span>
                </div>
                {turn === 'w' && <div className="w-3 h-3 bg-[#81b64c] rounded-full animate-pulse" />}
              </div>
              <div className="flex items-center justify-between bg-[#312e2b] rounded-lg px-4 py-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className={`text-2xl font-mono font-bold ${playerTime < 60 ? 'text-red-500' : 'text-white'}`}>
                  {formatTime(playerTime)}
                </span>
              </div>
              {/* Captured by Player */}
              <div className="mt-3 flex flex-wrap gap-1 min-h-[30px]">
                {capturedPieces.w.map((piece, i) => (
                  <img key={i} src={pieces.b[piece as keyof typeof pieces.b]} alt="" className="w-6 h-6 opacity-80" />
                ))}
              </div>
            </div>

            {/* Move History */}
            <div className="bg-[#272522] rounded-xl border border-[#3d3a37] overflow-hidden">
              <div className="bg-[#1e1c1a] px-4 py-2 border-b border-[#3d3a37]">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Move History</h3>
              </div>
              <div className="h-[300px] overflow-y-auto p-4">
                {moveHistory.length === 0 ? (
                  <p className="text-gray-500 text-center text-sm italic">No moves yet</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-mono">
                    {moveHistory.map((move, i) => (
                      <div key={i} className={i % 2 === 0 ? 'text-white' : 'text-gray-300'}>
                        {i % 2 === 0 && <span className="text-gray-500 mr-2">{Math.floor(i/2) + 1}.</span>}
                        {move}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#272522] rounded-xl p-6 w-full max-w-md border border-[#3d3a37]"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Sound Effects</span>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-[#81b64c]' : 'bg-[#3d3a37]'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Show Legal Moves</span>
                  <div className="w-12 h-6 rounded-full bg-[#81b64c]">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="mt-6 w-full bg-[#3d3a37] hover:bg-[#4a4744] py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
