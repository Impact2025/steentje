// Supabase Configuration
console.log('🔧 Loading supabase-config.js...');

const SUPABASE_URL = 'https://ulrmvrinqjtkcdmqfoei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscm12cmlucWp0a2NkbXFmb2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjE2OTYsImV4cCI6MjA3NDg5NzY5Nn0.RD9bNOg4j1-gIV00bUILb8dhviQqPPoxRutGpDrHXko';

// Check if supabase library is loaded
if (typeof supabase === 'undefined') {
    console.error('❌ FATAL: supabase library not loaded! Make sure the CDN script loads before this file.');
    alert('Supabase library niet geladen. Check de browser console.');
} else {
    console.log('✅ Supabase library found');

    // Supabase client initialiseren
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log('✅ Supabase client created:', supabaseClient);

    // Make it globally available
    window.supabaseClient = supabaseClient;
}
