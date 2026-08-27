import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fmpzzvznjgxxtbolqyds.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcHp6dnpuamd4eHRib2xxeWRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzkzNzk5NCwiZXhwIjoyMDk5NTEzOTk0fQ.o8L1dJKxWDRhzgu1mmRLJvNscRQSPV4KWt7fWdnxMdo';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function checkTables() {
  const { data, error } = await supabase.from('game_family_players').select('*').limit(1);
  console.log('game_family_players check:', { data, error });
}

checkTables();
