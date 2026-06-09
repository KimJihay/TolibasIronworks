
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aiwpvzumbkzvgybdnpdr.supabase.co';
const supabaseKey = 'sb_publishable_buGl88AVElVQIl_tspdrrQ_y75ga9uP';

export const supabase = createClient(supabaseUrl, supabaseKey);