import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import HabitCard from './components/HabitCard';
import AddHabitModal from './components/AddHabitModal';
import WeeklyProgress from './components/WeeklyProgress';
import CategoryFilter from './components/CategoryFilter';
import './App.css';

// Category constants with color mappings
export const CATEGORIES = {
  HEALTH: { name: 'Health', color: '#10b981' }, // green
  WORK: { name: 'Work', color: '#3b82f6' }, // blue
  PERSONAL: { name: 'Personal', color: '#a855f7' }, // purple
};

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

function App() {
  const [habits, setHabits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const loadedHabits = JSON.parse(savedHabits);
      // Migrate old habits without category to have default category
      const migratedHabits = loadedHabits.map(habit => ({
        ...habit,
        category: habit.category || 'PERSONAL'
      }));
      setHabits(migratedHabits);
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = (habitName, category) => {
    const newHabit = {
      id: Date.now(),
      name: habitName,
      category: category,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
    setShowAddModal(false);
  };

  const toggleHabitToday = (habitId) => {
    const today = getTodayString();
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = [...habit.completedDates];
        const todayIndex = completedDates.indexOf(today);
        
        if (todayIndex > -1) {
          completedDates.splice(todayIndex, 1);
        } else {
          completedDates.push(today);
        }
        
        return { ...habit, completedDates };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const exportToJSON = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      habits: habits,
      totalHabits: habits.length,
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-export-${getTodayString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter habits based on active category
  const filteredHabits = activeFilter === 'ALL' 
    ? habits 
    : habits.filter(habit => habit.category === activeFilter);

  const calculateWeeklyProgress = () => {
    // Calculate progress based on filtered habits
    const habitsToCount = filteredHabits;
    if (habitsToCount.length === 0) return 0;
    
    const weekDates = [];
    
    for (let i = 6; i >= 0; i--) {
      weekDates.push(getDateString(-i));
    }
    
    let totalPossible = habitsToCount.length * 7;
    let totalCompleted = 0;
    
    habitsToCount.forEach(habit => {
      weekDates.forEach(date => {
        if (habit.completedDates.includes(date)) {
          totalCompleted++;
        }
      });
    });
    
    return Math.round((totalCompleted / totalPossible) * 100);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Habit Tracker</h1>
            <p className="subtitle">Build better habits, one day at a time</p>
          </div>
          <button 
            className="export-button" 
            onClick={exportToJSON}
            title="Export habits to JSON"
          >
            <Download size={20} />
            Export Data
          </button>
        </div>
      </header>

      <main className="main">
        <WeeklyProgress progress={calculateWeeklyProgress()} />

        <CategoryFilter 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          habitCounts={{
            ALL: habits.length,
            HEALTH: habits.filter(h => h.category === 'HEALTH').length,
            WORK: habits.filter(h => h.category === 'WORK').length,
            PERSONAL: habits.filter(h => h.category === 'PERSONAL').length,
          }}
        />

        <div className="habits-section">
          <div className="section-header">
            <h2>My Habits</h2>
            <button className="add-button" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Add Habit
            </button>
          </div>

          {filteredHabits.length === 0 ? (
            <div className="empty-state">
              <p>
                {habits.length === 0 
                  ? "No habits yet. Start by adding your first habit!"
                  : `No ${CATEGORIES[activeFilter]?.name.toLowerCase()} habits yet.`
                }
              </p>
            </div>
          ) : (
            <div className="habits-grid">
              {filteredHabits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabitToday}
                  onDelete={deleteHabit}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showAddModal && (
        <AddHabitModal
          onAdd={addHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default App;
