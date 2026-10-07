import { TrendingUp } from 'lucide-react';
import './WeeklyProgress.css';

function WeeklyProgress({ progress }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="weekly-progress">
      <div className="progress-content">
        <div className="progress-ring-container">
          <svg className="progress-ring" width="180" height="180">
            <circle
              className="progress-ring-circle-bg"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="12"
              fill="transparent"
              r={radius}
              cx="90"
              cy="90"
            />
            <circle
              className="progress-ring-circle"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="90"
              cy="90"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>
          <div className="progress-text">
            <div className="progress-value">{progress}%</div>
            <div className="progress-label">Complete</div>
          </div>
        </div>

        <div className="progress-info">
          <div className="progress-header">
            <TrendingUp size={24} />
            <h2>Weekly Progress</h2>
          </div>
          <p className="progress-description">
            {progress === 0
              ? "Start checking in to track your progress!"
              : progress < 50
              ? "Keep going! You're building momentum."
              : progress < 80
              ? "Great work! You're more than halfway there."
              : progress < 100
              ? "Almost perfect! Just a few more check-ins."
              : "Perfect week! All habits completed! 🎉"}
          </p>
          <div className="progress-stats">
            <div className="stat-item">
              <div className="stat-number">{progress}%</div>
              <div className="stat-text">This Week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyProgress;