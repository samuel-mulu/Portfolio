// API Configuration - Controls whether to use mock or real APIs
const USE_MOCK_API_ENV = import.meta.env.VITE_USE_MOCK_API === "true";

// Check if Supabase env vars are available
const hasSupabaseConfig =
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

// Auto-enable mock mode if explicitly set OR if required env vars are missing
export const USE_MOCK_API =
  USE_MOCK_API_ENV || !hasSupabaseConfig;

// Log current mode (helpful for debugging)
if (USE_MOCK_API) {
  if (!hasSupabaseConfig && !USE_MOCK_API_ENV) {
    console.log(
      "🔧 Mock API mode auto-enabled - Supabase env vars not found. Set VITE_USE_MOCK_API=false to disable."
    );
  } else {
    console.log("🔧 Mock API mode enabled - Using mock data");
  }
} else {
  console.log("🌐 Real API mode enabled - Using backend services");
}

export default USE_MOCK_API;

