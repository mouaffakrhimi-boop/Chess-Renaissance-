export type Expression = 'neutral' | 'surprised' | 'disappointed' | 'angry' | 'joyful' | 'focused' | 'thinking';

export interface MagisterCommentary {
  text: string;
  expression: Expression;
  tone: 'encouraging' | 'critical' | 'playful' | 'dramatic' | 'respectful';
}

export class MagisterEngine {
  private sessionGames: number = 0;

  constructor() {
    this.sessionGames = parseInt(localStorage.getItem('magister_session_games') || '0');
  }

  getOpeningComment(): MagisterCommentary {
    return {
      text: "We begin our dance. I am The Magister. Show me your soul through your moves.",
      expression: 'neutral',
      tone: 'encouraging'
    };
  }

  getThinkingComment(): MagisterCommentary {
    return {
      text: "Hmm... let me calculate...",
      expression: 'thinking',
      tone: 'playful'
    };
  }

  analyzeMove(
    move: string,
    evaluation: number,
    previousEval: number,
    moveTime: number,
    isCapture: boolean,
    isCheck: boolean
  ): MagisterCommentary {
    // Simple analysis - returns random response for now
    const responses = [
      { text: "Interesting choice...", expression: 'thinking' as Expression, tone: 'playful' as const },
      { text: "I see what you're doing.", expression: 'focused' as Expression, tone: 'respectful' as const },
      { text: "Bold!", expression: 'surprised' as Expression, tone: 'dramatic' as const }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getGameOverComment(isPlayerWin: boolean, isCheckmate: boolean): MagisterCommentary {
    if (isPlayerWin) {
      return {
        text: "Magnificent! You have bested me. A game worthy of the books!",
        expression: 'surprised',
        tone: 'respectful'
      };
    }
    return {
      text: "The student becomes the master... in time.",
      expression: 'focused',
      tone: 'encouraging'
    };
  }

  incrementSessionGames() {
    this.sessionGames++;
    localStorage.setItem('magister_session_games', this.sessionGames.toString());
  }

  resetGame() {
    // Reset game-specific state
  }
}