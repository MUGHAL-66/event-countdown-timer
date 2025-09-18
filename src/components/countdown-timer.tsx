import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

export function CountdownTimer({ 
  targetDate, 
  onComplete, 
  size = 'large', 
  showProgress = true 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        onComplete?.();
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total: distance });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl lg:text-8xl'
  };

  const containerClasses = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6 lg:gap-8'
  };

  const progress = showProgress ? Math.max(0, Math.min(100, (timeLeft.total / (7 * 24 * 60 * 60 * 1000)) * 100)) : 0;

  return (
    <div className="flex flex-col items-center space-y-6">
      {showProgress && size === 'large' && (
        <div className="relative w-64 h-64 lg:w-80 lg:h-80">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(245, 166, 35, 0.1)"
              strokeWidth="2"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="drop-shadow-lg"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5A623" />
                <stop offset="100%" stopColor="#FFC857" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Timer in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`font-orbitron font-black ${sizeClasses[size]} text-white glow`}>
              {timeLeft.days > 0 ? timeLeft.days : timeLeft.hours.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      )}
      
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: timeLeft.total < 60000 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1, repeat: timeLeft.total < 60000 ? Infinity : 0 }}
        >
          <div className={`font-orbitron font-black ${sizeClasses[size]} text-white glow`}>
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-primary text-sm uppercase tracking-wider">Days</div>
        </motion.div>
        
        <div className={`text-primary ${sizeClasses[size]} font-orbitron font-black`}>:</div>
        
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: timeLeft.total < 3600000 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1, repeat: timeLeft.total < 3600000 ? Infinity : 0 }}
        >
          <div className={`font-orbitron font-black ${sizeClasses[size]} text-white glow`}>
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-primary text-sm uppercase tracking-wider">Hours</div>
        </motion.div>
        
        <div className={`text-primary ${sizeClasses[size]} font-orbitron font-black`}>:</div>
        
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: timeLeft.total < 300000 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1, repeat: timeLeft.total < 300000 ? Infinity : 0 }}
        >
          <div className={`font-orbitron font-black ${sizeClasses[size]} text-white glow`}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-primary text-sm uppercase tracking-wider">Minutes</div>
        </motion.div>
        
        <div className={`text-primary ${sizeClasses[size]} font-orbitron font-black`}>:</div>
        
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className={`font-orbitron font-black ${sizeClasses[size]} text-white glow`}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-primary text-sm uppercase tracking-wider">Seconds</div>
        </motion.div>
      </div>
    </div>
  );
}