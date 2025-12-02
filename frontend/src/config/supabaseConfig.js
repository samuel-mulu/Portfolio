import { createClient } from "@supabase/supabase-js";
import { USE_MOCK_API } from "./apiConfig";
import { mockSupabase } from "../mocks/mockSupabase";

// Check if Supabase env vars are available
const hasSupabaseConfig =
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use mock Supabase client if mock mode is enabled OR if env vars are missing
const shouldUseMock = USE_MOCK_API || !hasSupabaseConfig;

if (shouldUseMock) {
  console.log("✅ Using Mock Supabase Client");
} else {
  console.log("✅ Using Real Supabase Client");
}

export const supabase = shouldUseMock
  ? mockSupabase
  : createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
