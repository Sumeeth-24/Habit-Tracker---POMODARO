import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../App';
import './AddHabitModal.css';

function AddHabitModal({ onAdd, onClose }) {
  const [habitName, setHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('PERSONAL');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAdd(habitName.trim(), selectedCategory);
      setHabitName('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Habit</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="habit-name">Habit Name</label>
            <input
              id="habit-name"
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g., Exercise, Read, Meditate"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-options">
              {Object.entries(CATEGORIES).map(([key, { name, color }]) => (
                <label 
                  key={key} 
                  className={`category-option ${selectedCategory === key ? 'selected' : ''}`}
                  style={{
                    '--category-color': color,
                  }}
                >
                  <input
                    type="radio"
                    name="category"
                    value={key}
                    checked={selectedCategory === key}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span className="category-indicator" style={{ backgroundColor: color }}></span>
                  <span className="category-name">{name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={!habitName.trim()}
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHabitModal;
