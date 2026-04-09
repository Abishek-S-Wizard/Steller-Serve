import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cgogccqpucpppltsslvq.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnb2djY3FwdWNwcHBsdHNzbHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzcxMjcsImV4cCI6MjA3Mzg1MzEyN30.olT85rkOimFoNTEF52QCOMj67vn7fP8dPx7miSbRo2M"; // copy from Supabase Project → API settings

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


