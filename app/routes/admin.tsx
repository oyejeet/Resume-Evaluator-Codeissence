import {useEffect, useState} from "react";
import type { Route } from "./+types/admin";
import Navbar from "~/components/Navbar";
import {supabase} from "~/lib/supabase";

type Job = {
    id: string;
    title: string;
    company: string;
    location?: string;
    description: string;
    createdAt: number;
};

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Admin • Jobs" },
        { name: "description", content: "Create and manage job postings." },
    ];
}

export default function AdminJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);

    const loadJobs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to load jobs', error);
            setJobs([]);
        } else {
            const parsed: Job[] = (data || []).map((row: any) => ({
                id: row.id,
                title: row.title,
                company: row.company,
                location: row.location || undefined,
                description: row.description,
                createdAt: row.created_at ? Date.parse(row.created_at) : 0,
            }));
            setJobs(parsed);
        }
        setLoading(false);
    }

    useEffect(()=>{ loadJobs() }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const id = crypto.randomUUID();
        const payload = {
            id,
            title: String(data.get('title')||''),
            company: String(data.get('company')||''),
            location: String(data.get('location')||''),
            description: String(data.get('description')||''),
        };
        const { error } = await supabase.from('jobs').insert(payload);
        if (error) {
            // eslint-disable-next-line no-console
            console.error('Create job failed', error);
        }
        e.currentTarget.reset();
        await loadJobs();
    }

    const handleDelete = async (id: string) => {
        // Optimistic update
        setJobs(prev => prev.filter(j => j.id !== id));
        try {
            const { error } = await supabase.from('jobs').delete().eq('id', id);
            if (error) throw error;
        } catch (_) {
            await loadJobs();
        }
    }

    const clearAllJobs = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.from('jobs').delete().neq('id', '');
            if (error) throw error;
        } finally {
            await loadJobs();
        }
    }

    const seedDemoJobs = async () => {
        setLoading(true);
        try {
            const demo: Array<Omit<Job, 'createdAt'> & { createdAt?: number }> = [
                {
                    id: crypto.randomUUID(),
                    title: 'Frontend Engineer (React + TypeScript)',
                    company: 'Arcadia Labs',
                    location: 'Remote',
                    description: 'Own features across our React + Vite stack. Strong CSS skills and accessibility focus required. Experience with charts or visualization is a plus.',
                    createdAt: Date.now(),
                },
                {
                    id: crypto.randomUUID(),
                    title: 'Platform Engineer (Node.js)',
                    company: 'Nimbus Cloud',
                    location: 'NYC · Hybrid',
                    description: 'Design resilient APIs, CI/CD pipelines, and observability. Node.js, Postgres, Redis, and Kubernetes exposure helpful.',
                    createdAt: Date.now() - 1000,
                },
                {
                    id: crypto.randomUUID(),
                    title: 'Mobile Engineer (React Native)',
                    company: 'GoMobile',
                    location: 'SF · Onsite',
                    description: 'Deliver polished mobile experiences. Familiarity with native modules, OTA updates, and analytics required.',
                    createdAt: Date.now() - 2000,
                },
                {
                    id: crypto.randomUUID(),
                    title: 'Data Engineer',
                    company: 'DataForge',
                    location: 'Remote',
                    description: 'Build pipelines, model data, and enable analytics. Python, SQL, dbt, and modern warehousing preferred.',
                    createdAt: Date.now() - 3000,
                },
            ];
            // wipe existing
            await supabase.from('jobs').delete().neq('id', '');
            // seed
            await supabase.from('jobs').insert(demo.map(j => ({
                id: j.id,
                title: j.title,
                company: j.company,
                location: j.location || null,
                description: j.description,
                // let DB set created_at default; we ignore createdAt here
            })));
        } finally {
            await loadJobs();
        }
    }

    return (
        <main>
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Manage Jobs</h1>
                    <h2>Create and manage job postings</h2>
                </div>

                <div className="w-full max-w-5xl flex flex-wrap gap-3">
                    <button type="button" className="back-button" onClick={clearAllJobs}>
                        Clear All Jobs
                    </button>
                    <button type="button" className="primary-button w-fit" onClick={seedDemoJobs}>
                        Reset & Seed Demo Jobs
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-3xl gradient-border mt-4">
                    <div className="form-div">
                        <label htmlFor="title">Job Title</label>
                        <input id="title" name="title" placeholder="e.g. Frontend Engineer" required />
                    </div>
                    <div className="form-div">
                        <label htmlFor="company">Company</label>
                        <input id="company" name="company" placeholder="e.g. Resumind Inc." required />
                    </div>
                    <div className="form-div">
                        <label htmlFor="location">Location</label>
                        <input id="location" name="location" placeholder="e.g. Remote / NYC" />
                    </div>
                    <div className="form-div">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" rows={6} placeholder="Role description and requirements" required />
                    </div>
                    <button className="primary-button" type="submit">Create Job</button>
                </form>

                <div className="w-full max-w-5xl flex flex-col gap-4 mt-8">
                    <h2>Existing Jobs</h2>
                    {loading && <p>Loading...</p>}
                    {!loading && jobs.length === 0 && <p>No jobs yet.</p>}
                    {!loading && jobs.length > 0 && (
                        <ul className="flex flex-col gap-3">
                            {jobs.map(job => (
                                <li key={job.id} className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xl font-semibold">{job.title} • {job.company}</p>
                                            {job.location && <p className="text-dark-200">{job.location}</p>}
                                        </div>
                                        <button onClick={()=>handleDelete(job.id)} className="back-button">Delete</button>
                                    </div>
                                    <p className="text-dark-200">{job.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    )
}


