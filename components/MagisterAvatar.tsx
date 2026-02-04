'use client';

import { motion } from 'framer-motion';

interface MagisterAvatarProps {
  expression: 'neutral' | 'surprised' | 'disappointed' | 'angry' | 'joyful' | 'focused' | 'thinking';
  isThinking?: boolean;
}

export function MagisterAvatar({ expression, isThinking }: MagisterAvatarProps) {
  return (
    <motion.div 
      className="magister-avatar"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="magister-face">
        <motion.div 
          className="magister-crown"
          animate={{ rotate: isThinking ? [0, -10, 10, 0] : 0 }}
          transition={{ duration: 0.5, repeat: isThinking ? Infinity : 0 }}
        >
          👑
        </motion.div>
        
        <div className="magister-eyes">
          <motion.div 
            className="magister-eye"
            animate={{
              scaleY: expression === 'surprised' ? 1.3 : 1,
              scaleX: expression === 'focused' ? 1.2 : 1
            }}
          />
          <motion.div 
            className="magister-eye"
            animate={{
              scaleY: expression === 'surprised' ? 1.3 : 1,
              scaleX: expression === 'focused' ? 1.2 : 1
            }}
          />
        </div>
        
        <motion.div 
          className="magister-mouth"
          animate={{
            scaleX: expression === 'joyful' ? 1.2 : 1,
            scaleY: expression === 'surprised' ? 1.3 : 1
          }}
        />
      </div>
    </motion.div>
  );
}