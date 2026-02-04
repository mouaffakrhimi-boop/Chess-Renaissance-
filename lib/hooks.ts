'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useGameSounds() {
  const playSound = useCallback((type: 'move' | 'capture' | 'check' | 'checkmate') => {
    // Placeholder for sound effects
    console.log('Playing sound:', type);
  }, []);

  return { playSound };
}

export function useConfetti() {
  const triggerConfetti = useCallback(() => {
    const colors = ['#d4af37', '#00d4ff', '#ff6b6b', '#ffd93d'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
      `;
      
      document.body.appendChild(confetti);
      
      confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => confetti.remove();
    }
  }, []);

  return { triggerConfetti };
}