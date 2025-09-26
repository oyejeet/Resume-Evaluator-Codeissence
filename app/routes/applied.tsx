import {useEffect, useState} from "react";
import type { Route } from "./+types/applied";
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";

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
        { title: "Applied Jobs" },
        { name: "description", content: "Jobs you've applied to." },
    ];
}

export default function AppliedJobs() {
    const { kv } = usePuterStore();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const load = async () => {
            setLoading(true);
            const actions = (await kv.list('job-action:*', true)) as KVItem[] | undefined;
            const appliedIds = new Set<string>();
            (actions||[]).forEach(a => {
                try {
                    const v = JSON.parse(a.value) as { id: string; applied: boolean };
                    if (v.applied) appliedIds.add(v.id);
                } catch {}
            });
            const allJobs = (await kv.list('job:*', true)) as KVItem[] | undefined;
            const parsed = (allJobs||[]).map(i=>JSON.parse(i.value) as Job).filter(j=> appliedIds.has(j.id));
            setJobs(parsed.sort((a,b)=> b.createdAt - a.createdAt));
            setLoading(false);
        };
        load();
    }, [])

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
                        {jobs.map(j => (
                            <li key={j.id} className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-semibold">{j.title}</p>
                                    <span className="text-dark-200">{j.company}{j.location ? ` • ${j.location}`: ''}</span>
                                </div>
                                <p className="text-dark-200 line-clamp-4">{j.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}


