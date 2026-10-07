import { Filter } from 'lucide-react';
import { CATEGORIES } from '../App';
import './CategoryFilter.css';

function CategoryFilter({ activeFilter, onFilterChange, habitCounts }) {
  const filters = [
    { key: 'ALL', name: 'All Habits', color: '#667eea' },
    { key: 'HEALTH', name: CATEGORIES.HEALTH.name, color: CATEGORIES.HEALTH.color },
    { key: 'WORK', name: CATEGORIES.WORK.name, color: CATEGORIES.WORK.color },
    { key: 'PERSONAL', name: CATEGORIES.PERSONAL.name, color: CATEGORIES.PERSONAL.color },
  ];

  return (
    <div className="category-filter">
      <div className="filter-header">
        <Filter size={20} />
        <span>Filter by Category</span>
      </div>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-button ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
            style={{
              '--filter-color': filter.color,
            }}
          >
            <span 
              className="filter-indicator" 
              style={{ backgroundColor: filter.color }}
            ></span>
            <span className="filter-name">{filter.name}</span>
            <span className="filter-count">{habitCounts[filter.key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;