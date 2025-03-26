import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import InterviewStatsChart from "./InterviewStatsChart"; // import the InterviewStatsChart

const ForecastChart = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [forecastData, setForecastData] = useState([]);

  // Fetch categories
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Fetch forecast data when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://127.0.0.1:5000/api/forecast/${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const formattedData = data.map((d) => ({
              date: new Date(d.date).getTime(), // Convert date to timestamp
              forecast: Number(d.forecast) || 0, // Ensure it's a valid number
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

  return (
    <div>
      <h2>Job Forecast</h2>

      {/* Dropdown */}
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Line Chart */}
      {forecastData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
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
            <Line type="monotone" dataKey="forecast" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        selectedCategory && <p>No forecast data available</p>
      )}

      {/* Interview Stats Chart (Pie chart) */}
      <InterviewStatsChart jobs={[]} /> {/* Pass job data if available */}
    </div>
  );
};

export default ForecastChart;
