import {useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion, useMotionValue, useTransform} from "framer-motion";
import type { Route } from "./+types/jobs";
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
        { title: "Jobs • Swipe" },
        { name: "description", content: "Swipe to apply or pass on jobs." },
    ];
}

export default function JobsSwipe() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
    const applyOpacity = useTransform(x, [0, 140], [0, 1]);
    const passOpacity = useTransform(x, [0, -140], [0, 1]);

    useEffect(()=>{
        const load = async () => {
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
        };
        load();
    }, [])

    useEffect(()=>{
        const channel = supabase
            .channel('jobs-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
                // Refresh list on any job change
                (async () => {
                    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
                    const parsed: Job[] = (data || []).map((row: any) => ({
                        id: row.id,
                        title: row.title,
                        company: row.company,
                        location: row.location || undefined,
                        description: row.description,
                        createdAt: row.created_at ? Date.parse(row.created_at) : 0,
                    }));
                    setJobs(parsed);
                })();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [])

    const job = jobs[index];

    const seedDemoJobs = async () => {
        const demo = [
            { id: crypto.randomUUID(), title: 'Frontend Engineer', company: 'Resumind Inc.', location: 'Remote', description: 'Build delightful UIs in React, focus on performance and accessibility. Experience with TypeScript and Vite is a plus.' },
            { id: crypto.randomUUID(), title: 'Backend Developer', company: 'DataCloud', location: 'NYC, Hybrid', description: 'Design APIs, work with Node.js and PostgreSQL, implement observability and caching best practices.' },
            { id: crypto.randomUUID(), title: 'Mobile Engineer (React Native)', company: 'GoMobile', location: 'Remote', description: 'Ship high-quality features on iOS/Android using React Native. Familiar with native modules and app store releases.' },
        ];
        await supabase.from('jobs').insert(demo.map(d => ({
            id: d.id,
            title: d.title,
            company: d.company,
            location: d.location,
            description: d.description,
        })));
        const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        const parsed: Job[] = (data || []).map((row: any) => ({
            id: row.id,
            title: row.title,
            company: row.company,
            location: row.location || undefined,
            description: row.description,
            createdAt: row.created_at ? Date.parse(row.created_at) : 0,
        }));
        setJobs(parsed);
        setIndex(0);
    }

    const onSwipe = async (direction: 'left' | 'right') => {
        if (!job) return;
        const applied = direction === 'right';
        setStatus(applied ? 'Applied' : 'Rejected');
        try {
            await supabase.from('job_actions').insert({
                id: crypto.randomUUID(),
                job_id: job.id,
                applied,
            });
        } finally {
            setTimeout(()=>{
                setStatus(null);
                x.set(0); y.set(0);
                setIndex((i)=> i + 1);
            }, 250);
        }
    }
    
    const handleDragEnd = (_: any, info: { velocity: { x: number, y: number }, offset: { x: number, y: number } }) => {
        const threshold = 140;
        const velocityThreshold = 700; // px/s
        const dx = info.offset.x;
        const vx = info.velocity.x;
        let decided: 'left' | 'right' | null = null;
        if (dx > threshold || vx > velocityThreshold) decided = 'right';
        if (dx < -threshold || vx < -velocityThreshold) decided = 'left';
        setIsDragging(false);
        if (decided) {
            onSwipe(decided);
        }
    }

    return (
        <main>
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Find Your Next Role</h1>
                    <h2>Swipe right to apply, left to pass</h2>
                </div>

                {loading && <p>Loading...</p>}
                {!loading && jobs.length === 0 && <p>No jobs available.</p>}

                {!loading && job && (
                    <div className="relative w-full max-w-md h-[520px]">
                        <AnimatePresence initial={false}>
                            {[0,1,2].map((offset)=>{
                                const j = jobs[index + offset];
                                if (!j) return null;
                                const isTop = offset === 0;
                                const scale = isTop ? 1 : 1 - offset*0.04;
                                const yOffset = offset*14;
                                return (
                                    <motion.div
                                        key={j.id}
                                        className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 select-none cursor-grab"
                                        style={isTop ? { x, y, rotate, zIndex: 100, touchAction: 'none' } : { y: yOffset, scale, zIndex: 100 - offset, pointerEvents: 'none' }}
                                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                                        animate={{ opacity: 1, y: yOffset, scale, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
                                        exit={{ opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.2 } }}
                                        drag={isTop ? 'x' : false}
                                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        dragElastic={0.2}
                                        whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                                        onDragStart={()=> setIsDragging(true)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-2xl font-semibold">{j.title}</p>
                                            <span className="text-dark-200">{j.company}{j.location ? ` • ${j.location}`: ''}</span>
                                        </div>
                                        <div className="h-[360px] overflow-auto pr-2">
                                            <p className="text-dark-200 whitespace-pre-wrap leading-relaxed">{j.description}</p>
                                        </div>

                                        {/* Overlays */}
                                        {isTop && (
                                            <>
                                                <motion.div
                                                    className="pointer-events-none absolute top-6 left-6 px-3 py-1 rounded-full border-2 text-green-600"
                                                    style={{ opacity: applyOpacity, borderColor: '#16a34a' }}
                                                >APPLY</motion.div>
                                                <motion.div
                                                    className="pointer-events-none absolute top-6 right-6 px-3 py-1 rounded-full border-2 text-red-600"
                                                    style={{ opacity: passOpacity, borderColor: '#dc2626' }}
                                                >PASS</motion.div>
                                            </>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {status && <p className="text-center mt-3">{status}</p>}
                        <p className="text-center text-dark-200 mt-4">{index+1} / {jobs.length}</p>
                    </div>
                )}

                {!loading && !job && jobs.length > 0 && (
                    <div className="text-center">
                        <h2>You're all caught up!</h2>
                    </div>
                )}

                {!loading && jobs.length === 0 && (
                    <div className="flex flex-col items-center gap-4">
                        <p>No jobs available. Ask an admin to add some at <span className="font-semibold">/admin</span>.</p>
                        <button className="primary-button w-fit" onClick={seedDemoJobs}>Load Demo Jobs</button>
                    </div>
                )}
            </section>
        </main>
    )
}


