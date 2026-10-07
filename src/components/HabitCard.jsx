import { useState } from 'react';
import { Check, Flame, Trash2, Calendar } from 'lucide-react';
import { CATEGORIES } from '../App';
import './HabitCard.css';

// Helper function to get today's date in YYYY-MM-DD format (timezone-safe)
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get date string for a specific offset (timezone-safe)
const getDateString = (daysOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function HabitCard({ habit, onToggle, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCompletedToday = () => {
    const today = getTodayString();
    return habit.completedDates.includes(today);
  };

  const calculateStreak = () => {
    if (habit.completedDates.length === 0) return 0;

    const sortedDates = [...habit.completedDates].sort().reverse();
    let streak = 0;
    const today = getTodayString();

    // Check if today or yesterday is completed (to allow for ongoing streaks)
    const yesterday = getDateString(-1);
    const hasRecentCompletion = sortedDates.includes(today) || sortedDates.includes(yesterday);
    
    if (!hasRecentCompletion) return 0;

    // Count consecutive days backwards from today
    for (let i = 0; i < 365; i++) { // Max 365 days to prevent infinite loop
      const checkDate = getDateString(-i);
      if (sortedDates.includes(checkDate)) {
        streak++;
      } else if (i > 0) {
        // If we miss a day (and it's not today), break the streak
        break;
      }
    }

    return streak;
  };

  const getWeekData = () => {
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = getDateString(-i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      weekData.push({
        day: dayName,
        completed: habit.completedDates.includes(dateString),
        isToday: i === 0,
      });
    }

    return weekData;
  };

  const streak = calculateStreak();
  const weekData = getWeekData();
  const completedToday = isCompletedToday();
  const category = CATEGORIES[habit.category] || CATEGORIES.PERSONAL;

  return (
    <div className="habit-card">
      <div className="habit-header">
        <div className="habit-title-row">
          <h3 className="habit-name">{habit.name}</h3>
          <span 
            className="category-badge" 
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        </div>
        <button
          className="delete-icon"
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete habit"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="habit-stats">
        <div className="stat">
          <Flame className="stat-icon flame" size={20} />
          <div>
            <div className="stat-value">{streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat">
          <Calendar className="stat-icon" size={20} />
          <div>
            <div className="stat-value">{habit.completedDates.length}</div>
            <div className="stat-label">Total Days</div>
          </div>
        </div>
      </div>

      <div className="week-view">
        {weekData.map((day, index) => (
          <div key={index} className="day-item">
            <div className="day-label">{day.day}</div>
            <div className={`day-circle ${
              day.completed ? 'completed' : ''
            } ${
              day.isToday ? 'today' : ''
            }`}>
              {day.completed && <Check size={14} />}
            </div>
          </div>
        ))}
      </div>

      <button
        className={`check-in-button ${completedToday ? 'completed' : ''}`}
        onClick={() => onToggle(habit.id)}
      >
        {completedToday ? (
          <>
            <Check size={20} />
            Completed Today
          </>
        ) : (
          'Check In Today'
        )}
      </button>

      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Habit?</h3>
            <p>Are you sure you want to delete "{habit.name}"? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-button"
                onClick={() => {
                  onDelete(habit.id);
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitCard;
