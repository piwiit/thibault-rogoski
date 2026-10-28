import 'dotenv/config';

console.log('=== ENV CHECK ===');
console.log('DIRECT_DEV_URL:', process.env.DIRECT_DEV_URL);

// Now do the dynamic import
async function main() {
  console.log('=== Before import ===');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const { prisma } = await import('../lib/prisma');

  console.log('=== After import ===');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const count = await prisma.project.count();
  console.log('Project count:', count);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e.message || e);
  process.exit(1);
});
