import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomDropdown.css';

export default function CustomDropdown({ options, value, onChange, label, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div 
      className="custom-dropdown-container" 
      ref={dropdownRef}
      style={{ zIndex: isOpen ? 2100 : 1 }}
    >
      {label && <label className="dropdown-label">{label}</label>}
      <div 
        className={`dropdown-selection ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? 'placeholder' : ''}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && (
        <div className="dropdown-list">
          {options.map((option) => (
            <div 
              key={option} 
              className={`dropdown-item ${value === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
              {value === option && <Check size={14} className="check-icon" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
