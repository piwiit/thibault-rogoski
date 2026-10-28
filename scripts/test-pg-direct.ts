import 'dotenv/config';

const url = (process.env.DIRECT_DEV_URL || '').replace(/^"|"$/g, '');
console.log('URL:', url);

// Parse to verify
try {
  const parsed = new URL(url);
  console.log('User:', parsed.username);
  console.log('Pass:', parsed.password);
  console.log('Host:', parsed.hostname);
  console.log('Port:', parsed.port);
} catch(e: any) {
  console.log('Parse error:', e.message);
}

// Try raw pg
import pg from 'pg';
const client = new pg.Client({ connectionString: url });

client.connect()
  .then(() => {
    console.log('SUCCESS: Connected!');
    return client.query('SELECT current_user, current_database()');
  })
  .then((res) => {
    console.log('User:', res.rows[0].current_user);
    console.log('DB:', res.rows[0].current_database);
    return client.end();
  })
  .catch((err) => {
    console.error('FAILED:', err.message);
    process.exit(1);
  });
