import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock Supabase client if credentials are missing
const createMockClient = () => {
  console.warn("Using mock Supabase client. Authentication features will not work.")

  // Return a mock client with empty methods
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: new Error("Supabase credentials not configured") }),
      signUp: async () => ({ error: new Error("Supabase credentials not configured") }),
      signOut: async () => {},
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: async () => ({ error: null }),
    }),
  } as any
}

// Create and export the Supabase client
export const supabase =
  !supabaseUrl || !supabaseAnonKey
    ? createMockClient()
    : createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })

