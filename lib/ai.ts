import { Chess } from 'chess.js';

const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
};

export class ChessAI {
  private depth: number;

  constructor(depth: number = 3) {
    this.depth = depth;
  }

  setDepth(depth: number) {
    this.depth = depth;
  }

  getBestMove(game: Chess): { from: string; to: string; promotion?: string } | null {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return null;

    let bestMove = moves[0];
    let bestValue = -Infinity;

    for (const move of moves) {
      const testGame = new Chess(game.fen());
      testGame.move(move);
      const value = this.minimax(testGame, this.depth - 1, -Infinity, Infinity, false);
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return {
      from: bestMove.from,
      to: bestMove.to,
      promotion: bestMove.promotion
    };
  }

  private minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    if (depth === 0 || game.isGameOver()) {
      return this.evaluatePosition(game);
    }

    const moves = game.moves({ verbose: true });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const testGame = new Chess(game.fen());
        testGame.move(move);
        const eval_ = this.minimax(testGame, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const testGame = new Chess(game.fen());
        testGame.move(move);
        const eval_ = this.minimax(testGame, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  evaluatePosition(game: Chess): number {
    if (game.isCheckmate()) {
      return game.turn() === 'w' ? -Infinity : Infinity;
    }
    if (game.isDraw()) return 0;

    let score = 0;
    const board = game.board();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          const value = PIECE_VALUES[piece.type];
          if (piece.color === 'w') {
            score += value;
          } else {
            score -= value;
          }
        }
      }
    }

    return score;
  }
}

export const difficultyLevels = {
  beginner: { depth: 1, label: 'Novice' },
  intermediate: { depth: 2, label: 'Student' },
  advanced: { depth: 3, label: 'Scholar' },
  expert: { depth: 4, label: 'Master' },
  master: { depth: 5, label: 'Grandmaster' }
};