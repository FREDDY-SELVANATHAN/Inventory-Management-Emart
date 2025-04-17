const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../prisma/migrations/0001_init/migration.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await prisma.$executeRawUnsafe(sql);
    console.log('✅ Migration applied successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 