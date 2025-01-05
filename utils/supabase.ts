// app/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Adjust these environment variables to your actual keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Typed supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
