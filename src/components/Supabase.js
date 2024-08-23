import { createClient } from '@supabase/supabase-js';



const supabaseUrl = 'https://rwkppfrayrposprvoehq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3a3BwZnJheXJwb3NwcnZvZWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0MTAyNTQsImV4cCI6MjAzODk4NjI1NH0.n6vH4a03i-V3NbOlJxM2VWs4NwMGdF244N19tirdFTU';


export const supabase = createClient(supabaseUrl, supabaseKey); 