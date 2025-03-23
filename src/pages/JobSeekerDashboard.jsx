import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components for doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: "Software Engineer", company: "TechCorp", location: "Remote", status: "Pending" },
    { id: 2, title: "Frontend Developer", company: "WebWorks", location: "New York", status: "Interviewed" },
    { id: 3, title: "Backend Developer", company: "DevStudio", location: "San Francisco", status: "Rejected" },
    { id: 4, title: "UI/UX Designer", company: "DesignCo", location: "Remote", status: "Accepted" },
  ]);

  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", status: "Pending" });
  const [pklData, setPklData] = useState(null);

  // Load Pyodide when the component mounts
  useEffect(() => {
    const loadPyodide = async () => {
      const pyodide = await window.loadPyodide();
      window.pyodide = pyodide; // Store it globally for later use
    };
    loadPyodide();
  }, []);

  const addJob = () => {
    if (newJob.title && newJob.company && newJob.location) {
      setJobs([...jobs, { id: jobs.length + 1, ...newJob }]);
      setNewJob({ title: "", company: "", location: "", status: "Pending" });
    }
  };

  const removeJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  // Handle file input for .pkl file
  const handlePklFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const pklBuffer = reader.result;

      // Use Pyodide to load the .pkl file
      const pyodide = window.pyodide;
      const pythonCode = `
import pickle
import io

# Load the .pkl data from the FileReader result
data = pickle.load(io.BytesIO(${JSON.stringify(pklBuffer)}))
data
      `;
      const result = await pyodide.runPython(pythonCode);
      setPklData(result); // Update state with the deserialized data
    };

    reader.readAsArrayBuffer(file);
  };

  // Doughnut chart data
  const jobStatusCount = jobs.reduce((acc, job) => {
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
        backgroundColor: ["#FFCE56", "#4BC0C0", "#36A2EB", "#FF6384"], // Color for each segment
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Seeker Dashboard</h1>
      
      <div className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Company"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Location"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
        />
        <Button onClick={addJob} className="bg-blue-500 text-white px-4">Add</Button>
      </div>

      {/* White Box for Doughnut chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Job Status Distribution</h2>
        <div className="h-80">
          <Doughnut data={data} />
        </div>
      </div>

      {/* Input for .pkl file */}
      <div className="mb-6">
        <input
          type="file"
          accept=".pkl"
          onChange={handlePklFileChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Display .pkl file data */}
      {pklData && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">PKL File Data</h2>
          <pre className="text-sm">{JSON.stringify(pklData, null, 2)}</pre>
        </div>
      )}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="flex justify-between items-center p-4 border rounded-lg">
            <CardContent>
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>
            </CardContent>
            <Button onClick={() => removeJob(job.id)} variant="destructive">
              <X className="w-5 h-5" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
