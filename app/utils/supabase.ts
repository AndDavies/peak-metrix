import { createClient } from "@supabase/supabase-js";

/**
 * The environment variables must be set:
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * This client is for client-side usage (in Next.js "use client" components).
 * If you need server-side usage, you might do createRouteHandlerClient 
 * in your server-based code, or create a separate file. 
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

