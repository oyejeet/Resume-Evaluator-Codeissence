import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);

export type DbJob = {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  description: string;
  created_at: string; // ISO timestamp from Supabase
};

export type DbJobAction = {
  id: string;
  job_id: string;
  applied: boolean;
  created_at: string;
};


