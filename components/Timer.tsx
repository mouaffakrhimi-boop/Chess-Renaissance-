'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  isActive: boolean;
  initialTime?: number;
}

export function Timer({ isActive, initialTime = 600 }: TimerProps) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLow = time < 60;

  return (
    <motion.div
      className={`px-4 py-2 rounded-lg font-mono text-xl font-bold ${
        isLow 
          ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
          : 'bg-white/5 text-gray-300'
      }`}
      animate={isLow && isActive ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      {formatTime(time)}
    </motion.div>
  );
}