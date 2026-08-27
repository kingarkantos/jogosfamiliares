const SUPABASE_URL = 'https://fmpzzvznjgxxtbolqyds.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcHp6dnpuamd4eHRib2xxeWRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzkzNzk5NCwiZXhwIjoyMDk5NTEzOTk0fQ.o8L1dJKxWDRhzgu1mmRLJvNscRQSPV4KWt7fWdnxMdo';

async function testQuery() {
  try {
    const res = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ query: 'SELECT 1 as result;' })
    });
    console.log('Status /pg/query:', res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}

testQuery();
