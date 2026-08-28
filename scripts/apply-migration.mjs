import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const postgres = (await import('postgres')).default;
  const sqlContent = fs.readFileSync(path.join(__dirname, '..', 'supabase_migration_game_family.sql'), 'utf-8');

  const connectionOptions = [
    // 1. Direct host
    'postgres://postgres:@Mnhbjb246580@db.fmpzzvznjgxxtbolqyds.supabase.co:5432/postgres',
    // 2. Encoded password
    `postgres://postgres:${encodeURIComponent('@Mnhbjb246580')}@db.fmpzzvznjgxxtbolqyds.supabase.co:5432/postgres`,
    // 3. Pooler sa-east-1
    `postgres://postgres.fmpzzvznjgxxtbolqyds:${encodeURIComponent('@Mnhbjb246580')}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
    // 4. Pooler us-east-1
    `postgres://postgres.fmpzzvznjgxxtbolqyds:${encodeURIComponent('@Mnhbjb246580')}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    // 5. Pooler us-west-1
    `postgres://postgres.fmpzzvznjgxxtbolqyds:${encodeURIComponent('@Mnhbjb246580')}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
  ];

  let connectedSql = null;
  for (const connStr of connectionOptions) {
    try {
      console.log('Tentando conectar em:', connStr.replace(/:[^:@]+@/, ':****@'));
      const sql = postgres(connStr, { connect_timeout: 5, ssl: 'require' });
      const result = await sql`SELECT 1 as connected;`;
      if (result && result.length > 0) {
        console.log('Conexão estabelecida com sucesso!');
        connectedSql = sql;
        break;
      }
    } catch (err) {
      console.log('Falha na tentativa:', err.message);
    }
  }

  if (!connectedSql) {
    console.error('Não foi possível conectar ao banco de dados com as opções fornecidas.');
    process.exit(1);
  }

  try {
    console.log('Executando migração do script SQL...');
    await connectedSql.unsafe(sqlContent);
    console.log('✅ Migração executada com SUCESSO!');
  } catch (err) {
    console.error('Erro ao executar SQL:', err);
  } finally {
    await connectedSql.end();
  }
}

run();
