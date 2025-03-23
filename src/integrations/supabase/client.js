import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vkopufpkafrfvdkdmtgk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrb3B1ZnBrYWZyZnZka2RtdGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTIwMTUsImV4cCI6MjA1ODIyODAxNX0.6a-2FFKTSr6zZURKvxSuXdetKO6Tn15NxzLJSn5rEYo";

// Import the Supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
