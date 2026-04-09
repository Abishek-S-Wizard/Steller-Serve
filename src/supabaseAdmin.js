// src/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cgogccqpucpppltsslvq.supabase.co";
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnb2djY3FwdWNwcHBsdHNzbHZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI3NzEyNywiZXhwIjoyMDczODUzMTI3fQ.ypkfiTCS07mFRMsKGV3XIVZI4AyIRyY4jKG6dZBUrow"; // 👈 use service_role key here

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
