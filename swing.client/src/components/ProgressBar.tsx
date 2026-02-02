import React from 'react';

interface ProgressBarProps {
  balance: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ balance }) => {
  const maxBalance = 16000;
  const percentage = Math.min(100, Math.max(0, (balance / maxBalance) * 100));

  const milestones = [
    { value: 0, label: "0$" },
    { value: 4000, label: "4000$" },
    { value: 8000, label: "8000$" },
    { value: 16000, label: "16000$" },
  ];

  return (
    <div className="progress-bar-container">
      <div className="progress-track">
        {/* Background Track */}
        <div className="track-line"></div>
        
        {/* Filled Progress */}
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>

        {/* Milestones */}
        {milestones.map((m) => {
          const mPercent = (m.value / maxBalance) * 100;
            const reached = balance >= m.value;
          return (
            <div 
              key={m.value} 
              className={`milestone ${reached ? 'milestone-reached' : ''}`}
              style={{ left: `${mPercent}%` }}
            >
              <div className="milestone-marker"></div>
              <span className="milestone-label">{m.label}</span>
            </div>
          );
        })}

        {/* Character */}
        <div 
          className="character-thumb"
          style={{ left: `${percentage}%` }}
        >
            <div className="character-wrapper">
                <img 
                    src="/images/character.png" 
                    alt="Character" 
                    className="character-img"
                    height={50}
                />
                <div className="character-glow"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
