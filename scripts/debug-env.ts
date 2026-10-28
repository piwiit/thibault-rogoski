import 'dotenv/config';

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DIRECT_DEV_URL:', process.env.DIRECT_DEV_URL);
console.log('DATABASE_DEV_URL:', process.env.DATABASE_DEV_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Simulate getDatabaseUrl
const env = process.env.NODE_ENV ?? 'development';
let rawUrl = '';
if (env === 'production') {
  rawUrl = process.env.DATABASE_URL_PROD ?? process.env.DATABASE_URL ?? '';
} else {
  rawUrl = process.env.DIRECT_DEV_URL ?? process.env.DATABASE_DEV_URL ?? '';
}
const resolved = rawUrl.replace(/^"|"$/g, '');
console.log('\nResolved URL:', resolved);

// Try parsing with URL
try {
  const url = new URL(resolved);
  console.log('Host:', url.hostname);
  console.log('Port:', url.port);
  console.log('User:', url.username);
  console.log('Password:', url.password);
  console.log('Database:', url.pathname);
} catch (e: any) {
  console.log('URL parse error:', e.message);
}
