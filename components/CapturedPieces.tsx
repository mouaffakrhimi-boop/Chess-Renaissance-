interface CapturedPiecesProps {
  pieces: string[];
  color: 'w' | 'b';
}

export function CapturedPieces({ pieces, color }: CapturedPiecesProps) {
  const getPieceSymbol = (type: string, color: 'w' | 'b'): string => {
    const symbols: Record<string, Record<string, string>> = {
      w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
      b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };
    return symbols[color][type] || '';
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">
          {color === 'w' ? "Magister's captures" : "Your captures"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-black/20 rounded-lg text-2xl">
        {pieces.length === 0 ? (
          <span className="text-gray-600 text-sm">None yet</span>
        ) : (
          pieces.map((piece, idx) => (
            <span key={idx} className="opacity-80">
              {getPieceSymbol(piece, color === 'w' ? 'b' : 'w')}
            </span>
          ))
        )}
      </div>
    </div>
  );
}