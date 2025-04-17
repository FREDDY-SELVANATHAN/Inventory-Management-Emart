# Stop any running Node.js processes
taskkill /F /IM node.exe 2>$null

# Remove Prisma generated files
Remove-Item -Force -Recurse -ErrorAction SilentlyContinue node_modules\.prisma
Remove-Item -Force -Recurse -ErrorAction SilentlyContinue node_modules\@prisma

# Reinstall dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database changes
npx prisma db push --accept-data-loss

# Start the development server
npm run dev 