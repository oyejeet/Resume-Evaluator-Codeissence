import { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  useEffect(() => {
    console.log("Jobs Data in Chart:", jobData);
  }, [jobData]);

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

export default InterviewStatsChart;
