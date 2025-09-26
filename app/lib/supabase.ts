import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://sckyfycbjlpsoqgcedob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNja3lmeWNiamxwc29xZ2NlZG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MzgyMDksImV4cCI6MjA3MzUxNDIwOX0.ZwumZxaBygpfYBDq5YN_sWL6Mvu2DFvKyKg6Op1HfHM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
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
  created_at: string;
  updated_at: string;          // UPDATED
  job_type?: string | null;    // UPDATED
  salary?: string | null;      // UPDATED
  contact_email?: string | null; // UPDATED
  skills?: string[] | null;    // UPDATED
};

export type DbJobAction = {
  id: string;
  job_id: string;
  applied: boolean;
  created_at: string;
};
