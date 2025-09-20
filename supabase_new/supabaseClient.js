import { createClient } from '@supabase/supabase-js';



const supabaseUrl = 'https://dhvrfgqgdnfxcfmgyoyi.supabase.co'; // <- Project URL
const supabaseKey = '';                  // <- anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
