// Supabase Configuration
// Vervang deze waarden met jouw eigen Supabase credentials

const SUPABASE_URL = 'JOUW_SUPABASE_URL_HIER'; // bijv: https://abc123.supabase.co
const SUPABASE_ANON_KEY = 'JOUW_SUPABASE_ANON_KEY_HIER'; // lange string

// Supabase client initialiseren
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase configured');
