import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import axios from 'axios';
import { Search } from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend);

// JobCard Component
const JobCard = ({ job }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3">
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-1">{job.job_title}</h3>
        <p className="text-xs text-gray-500 mb-2">{job.company_name}</p>
        <p className="text-xs text-gray-600 line-clamp-2">{job.job_description}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-[10px]">
            {job.city}
          </span>
          <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px]">
            {job.post_date}
          </span>
        </div>
      </div>
    </div>
  );
};

// Interview Stats Chart Component
const InterviewStatsChart = ({ jobs }) => {
  const staticJobs = [
    { id: 1, title: "Software Engineer", company: "TechCorp", status: "Pending" },
    { id: 2, title: "Designer", company: "XYZ", status: "Accepted" },
    { id: 3, title: "Data Analyst", company: "ABC", status: "Interviewed" },
    { id: 4, title: "Backend Developer", company: "DEF", status: "Rejected" },
    { id: 5, title: "DevOps Engineer", company: "GHI", status: "Accepted" },
    { id: 6, title: "Product Manager", company: "JKL", status: "Interviewed" },
  ];

  const jobData = jobs && jobs.length > 0 ? jobs : staticJobs;

  const jobStatusCount = jobData.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: ["Pending", "Accepted", "Interviewed", "Rejected"],
    datasets: [
      {
        data: [
          jobStatusCount["Pending"] || 0,
          jobStatusCount["Accepted"] || 0,
          jobStatusCount["Interviewed"] || 0,
          jobStatusCount["Rejected"] || 0,
        ],
        backgroundColor: ["#FFCE56", "#4BC0C0", "#36A2EB", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 w-full max-w-xs mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Interview Status</h2>
      <div className="w-64 h-64 mx-auto">
        <Doughnut data={data} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

// Main Component
const CategoryForecast = () => {
  // Categories State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Forecast Data State
  const [forecastData, setForecastData] = useState([]);
  
  // Jobs State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/categories');
        const sortedCategories = (response.data.categories || []).sort((a, b) => a.localeCompare(b));
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Forecast Data
  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://127.0.0.1:5000/api/forecast/${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const formattedData = data.map((d) => ({
              date: new Date(d.date).getTime(),
              forecast: Number(d.forecast) || 0,
            }));
            setForecastData(formattedData);
          } else {
            console.error("Invalid data format:", data);
            setForecastData([]);
          }
        })
        .catch((error) => console.error("Error fetching forecast:", error));
    }
  }, [selectedCategory]);

  // Fetch Jobs
  const fetchJobs = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/data/${category}`);
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs', error);
      setLoading(false);
    }
  };

  // Handle Category Selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchJobs(category);
  };

  // Filter Jobs
  const filteredJobs = jobs.filter(job => 
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex">
        {/* Sidebar Filter */}
        <div className="w-64 mr-6">
          <div className="w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Search className="mr-2 w-5 h-5" /> Filters
            </h2>

            {/* City Dropdown */}
            <div className="mb-4 relative">
              <h3 className="text-sm font-medium mb-2">Preferred City</h3>
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled
              >
                <option>Select City</option>
              </select>
            </div>

            {/* Salary Range */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Salary</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs">$300</span>
                <input 
                  type="range" 
                  min="300" 
                  max="5000" 
                  value="5000" 
                  disabled
                  className="flex-grow opacity-50 cursor-not-allowed"
                />
                <span className="text-xs">$5000k</span>
              </div>
            </div>

            {/* Filters */}
            <div>
              <h3 className="text-sm font-medium mb-2">Job Filters</h3>
              {['Remote', 'Full-Time', 'Entry Level'].map(filter => (
                <div key={filter} className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    disabled 
                    className="mr-2 opacity-50 cursor-not-allowed"
                  />
                  <span>{filter}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-6">Job Market Insights</h1>

          {/* Category Selector */}
          <div className="mb-6 flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Search Input */}
            {selectedCategory && (
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Forecast and Interview Stats */}
          {selectedCategory && (
            <div className="flex space-x-4">
              {/* Interview Stats Donut Chart */}
              <div className="w-1/3">
                <InterviewStatsChart jobs={jobs} />
              </div>

              {/* Forecast Chart */}
              <div className="w-2/3">
                {forecastData.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4">{selectedCategory} Job Market Forecast</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          type="number"
                          scale="time"
                          domain={["dataMin", "dataMax"]}
                          tickFormatter={(tick) => new Date(tick).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        />
                        <YAxis />
                        <Tooltip labelFormatter={(label) => new Date(label).toDateString()} />
                        <Line 
                          type="monotone" 
                          dataKey="forecast" 
                          stroke="#8884d8" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Listings */}
          {selectedCategory && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">{selectedCategory} Jobs ({filteredJobs.length})</h2>
              {loading ? (
                <p>Loading jobs...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredJobs.map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))}
                </div>
              )}

              {!loading && filteredJobs.length === 0 && (
                <p className="text-center text-gray-500">No jobs found in this category.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryForecast;