import React, { useEffect, useState } from "react";
import { Filter, Check, ChevronDown } from 'lucide-react';

const FilterSidebar = ({ jobs = [], onFilteredJobsChange }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Extract unique cities from jobs
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      const uniqueCities = [...new Set(jobs.map(job => job.city).filter(Boolean))];
      setCities(uniqueCities.sort());
    }
  }, [jobs]);

  // Apply City Filter
  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      onFilteredJobsChange([]);
      return;
    }

    const filteredJobs = jobs.filter(job => 
      !selectedCity || job.city === selectedCity
    );

    onFilteredJobsChange(filteredJobs);
  }, [selectedCity, jobs, onFilteredJobsChange]);

  return (
    <div className="w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="mr-2 w-5 h-5" /> Filters
      </h2>

      {/* City Dropdown */}
      <div className="mb-4 relative">
        <h3 className="text-sm font-medium mb-2">Preferred City</h3>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="border border-gray-300 rounded px-3 py-2 flex justify-between items-center cursor-pointer"
        >
          <span>{selectedCity || 'Select City'}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
            <div 
              onClick={() => {
                setSelectedCity('');
                setIsDropdownOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              All Cities
            </div>
            {cities.map(city => (
              <div 
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setIsDropdownOpen(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Salary Range (Static) */}
      <div className="mb-4 opacity-50 pointer-events-none">
        <h3 className="text-sm font-medium mb-2">Salary</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs">$300</span>
          <input 
            type="range" 
            min="300" 
            max="5000" 
            value="5000"
            disabled
            className="flex-grow"
          />
          <span className="text-xs">$5000k</span>
        </div>
      </div>

      {/* Availability (Static) */}
      <div className="mb-4 opacity-50 pointer-events-none">
        <h3 className="text-sm font-medium mb-2">Availability</h3>
        {['Urgent', 'Remote', 'Full-Time'].map(option => (
          <div key={option} className="flex items-center mb-1">
            <button 
              disabled
              className="w-4 h-4 mr-2 border border-gray-300 flex items-center justify-center"
            />
            <span className="text-sm">{option}</span>
          </div>
        ))}
      </div>

      {/* Experience (Static) */}
      <div className="opacity-50 pointer-events-none">
        <h3 className="text-sm font-medium mb-2">Experience</h3>
        {['Graphic Designer', 'UI Designer', 'UX Designer', 'Developer', 'UX Writer', 'Data Analyst', 'User Testing', 'Perception'].map(option => (
          <div key={option} className="flex items-center mb-1">
            <button 
              disabled
              className="w-4 h-4 mr-2 border border-gray-300 flex items-center justify-center"
            />
            <span className="text-sm">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;