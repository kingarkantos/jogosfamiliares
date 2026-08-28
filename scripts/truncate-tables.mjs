import postgres from 'postgres';

async function main() {
  const sql = postgres(`postgres://postgres:${encodeURIComponent('@Mnhbjb246580')}@db.fmpzzvznjgxxtbolqyds.supabase.co:5432/postgres`, {
    ssl: 'require'
  });

  try {
    console.log('Truncating tables in Supabase...');
    await sql`TRUNCATE TABLE public.game_family_matches CASCADE;`;
    await sql`TRUNCATE TABLE public.game_family_tournaments CASCADE;`;
    await sql`TRUNCATE TABLE public.game_family_players CASCADE;`;
    await sql`TRUNCATE TABLE public.game_family_games CASCADE;`;
    console.log('✅ Supabase cleaned 100% (matches, tournaments, players, games deleted)');
  } catch (e) {
    console.error('Error truncating tables:', e);
  } finally {
    await sql.end();
  }
}

main();
