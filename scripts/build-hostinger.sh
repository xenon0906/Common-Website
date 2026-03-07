#!/bin/bash
set -e

echo "=== Building Snapgo for Hostinger ==="

# Clean previous build
rm -rf .next
rm -f snapgo-deploy.zip

# Build with standalone output
echo "Building Next.js (standalone mode)..."
npm run build

# --- PATCH STANDALONE FOR LINUX/HOSTINGER ---

STANDALONE=".next/standalone"

echo "Patching server.js (fixing Windows paths)..."
# Replace Windows absolute paths with "." in the nextConfig JSON
# This handles outputFileTracingRoot and turbopack.root
node -e "
const fs = require('fs');
let content = fs.readFileSync('$STANDALONE/server.js', 'utf8');
// Replace all occurrences of the Windows build path with '.'
const winPath = content.match(/C:\\\\\\\\Users\\\\\\\\[^\"]+/g) || [];
const uniquePaths = [...new Set(winPath)];
uniquePaths.forEach(p => {
  content = content.split(p).join('.');
});
// Also handle forward-slash variants
const winPathFwd = content.match(/C:\/Users\/[^\"]+/g) || [];
const uniquePathsFwd = [...new Set(winPathFwd)];
uniquePathsFwd.forEach(p => {
  content = content.split(p).join('.');
});
fs.writeFileSync('$STANDALONE/server.js', content);
console.log('  Fixed', uniquePaths.length + uniquePathsFwd.length, 'path references');
"

echo "Patching required-server-files.json..."
node -e "
const fs = require('fs');
const filePath = '$STANDALONE/.next/required-server-files.json';
let content = fs.readFileSync(filePath, 'utf8');
// Replace Windows absolute paths
const winPath = content.match(/C:\\\\\\\\Users\\\\\\\\[^\"]+/g) || [];
const uniquePaths = [...new Set(winPath)];
uniquePaths.forEach(p => {
  content = content.split(p).join('.');
});
const winPathFwd = content.match(/C:\/Users\/[^\"]+/g) || [];
const uniquePathsFwd = [...new Set(winPathFwd)];
uniquePathsFwd.forEach(p => {
  content = content.split(p).join('.');
});
// Replace backslash paths in files array with forward slashes
content = content.replace(/\\\\\\\\.next\\\\\\\\/g, '.next/');
fs.writeFileSync(filePath, content);
console.log('  Fixed', uniquePaths.length + uniquePathsFwd.length, 'path references');
"

echo "Writing Hostinger-compatible package.json..."
cat > "$STANDALONE/package.json" << 'PKGJSON'
{
  "name": "snapgo",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "start": "node server.js"
  }
}
PKGJSON

echo "Creating app.js (Passenger compatibility)..."
cat > "$STANDALONE/app.js" << 'APPJS'
// Phusion Passenger entry point for Hostinger hPanel
require('./server.js');
APPJS

# --- ASSEMBLE ASSETS ---

echo "Copying static assets..."
cp -r .next/static "$STANDALONE/.next/static"

echo "Copying public assets..."
cp -r public "$STANDALONE/public"

# --- CREATE ZIP ---

echo "Creating deployment zip..."
cd "$STANDALONE"
if command -v zip &> /dev/null; then
  zip -r ../../snapgo-deploy.zip .
elif command -v powershell &> /dev/null; then
  powershell -Command "Compress-Archive -Path './*' -DestinationPath '../../snapgo-deploy.zip' -Force"
else
  echo "ERROR: No zip tool found."
  exit 1
fi
cd ../..

echo ""
echo "=== Build complete! ==="
echo "File: snapgo-deploy.zip"
echo ""
echo "Upload to Hostinger hPanel, extract, set Node.js startup file to server.js, and start."
