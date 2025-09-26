import { useEffect, useState } from "react";
import type { Route } from "./+types/applied";
import Navbar from "~/components/Navbar";
import { supabase } from "~/lib/supabase"; // ✅ use supabase client

// ✅ Updated Job type to match new schema
type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  jobType?: string;
  salary?: string;
  createdAt: number;
  updatedAt: number;
  contactEmail?: string;
  skills?: string[];
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Applied Jobs" },
    { name: "description", content: "Jobs you've applied to." },
  ];
}

export default function AppliedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // ✅ Step 1: Fetch all applied job IDs from job_actions
      const { data: actions, error: actionsError } = await supabase
        .from("job_actions")
        .select("job_id, applied")
        .eq("applied", true);

      if (actionsError) {
        console.error(actionsError);
        setLoading(false);
        return;
      }

      const appliedIds = (actions || []).map((a) => a.job_id);

      if (appliedIds.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // ✅ Step 2: Fetch job details for those IDs
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .in("id", appliedIds);

      if (jobsError) {
        console.error(jobsError);
        setLoading(false);
        return;
      }

      // ✅ Step 3: Map to Job type
      const parsed: Job[] = (jobsData || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        company: row.company,
        description: row.description,
        location: row.location || undefined,
        jobType: row.job_type || undefined,
        salary: row.salary || undefined,
        createdAt: row.created_at ? Date.parse(row.created_at) : 0,
        updatedAt: row.updated_at ? Date.parse(row.updated_at) : 0,
        contactEmail: row.contact_email || undefined,
        skills: row.skills || [],
      }));

      setJobs(parsed.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    };

    load();
  }, []);

  return (
    <main>
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Applied Jobs</h1>
          <h2>All roles you've applied to</h2>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && jobs.length === 0 && <p>No applied jobs yet.</p>}
        {!loading && jobs.length > 0 && (
          <ul className="w-full max-w-4xl flex flex-col gap-3">
            {jobs.map((j) => (
              <li
                key={j.id}
                className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">{j.title}</p>
                  <span className="text-dark-200">
                    {j.company}
                    {j.location ? ` • ${j.location}` : ""}
                  </span>
                </div>
                {j.jobType && (
                  <p className="text-sm text-gray-500">Type: {j.jobType}</p>
                )}
                {j.salary && (
                  <p className="text-sm text-gray-500">Salary: {j.salary}</p>
                )}
                {j.skills && j.skills.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Skills: {j.skills.join(", ")}
                  </p>
                )}
                <p className="text-dark-200 line-clamp-4">{j.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
