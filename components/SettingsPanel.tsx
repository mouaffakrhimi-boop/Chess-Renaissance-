'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: string;
  onDifficultyChange: (level: any) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  difficulty,
  onDifficultyChange,
  soundEnabled,
  onSoundToggle,
  playerName,
  onPlayerNameChange
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-chess-dark border-l border-chess-gold/30 z-50 p-6"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-chess-gold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              className="w-full bg-white/5 border border-chess-gold/30 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your name..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Difficulty
            </label>
            <div className="space-y-2">
              {['beginner', 'intermediate', 'advanced', 'expert', 'master'].map((level) => (
                <button
                  key={level}
                  onClick={() => onDifficultyChange(level)}
                  className={`w-full text-left px-4 py-3 rounded-lg border ${
                    difficulty === level
                      ? 'border-chess-gold bg-chess-gold/10 text-chess-gold'
                      : 'border-white/10 text-gray-300'
                  }`}
                >
                  <span className="font-bold capitalize">{level}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}