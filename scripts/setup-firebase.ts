#!/usr/bin/env tsx
/**
 * Firebase Setup - Deploy all security rules from codebase
 * Run: npm run setup:firebase
 */

import { execFile } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execFileAsync = promisify(execFile)

console.log('🔥 Firebase Setup Script\n')

async function runCommand(command: string, args: string[]): Promise<string> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args)
    if (stderr) console.warn(stderr)
    return stdout
  } catch (error: any) {
    throw new Error(`Command failed: ${error.message}`)
  }
}

async function main() {
  // 1. Check Firebase CLI installed
  try {
    const version = await runCommand('firebase', ['--version'])
    console.log(`✓ Firebase CLI installed: ${version.trim()}`)
  } catch (error) {
    console.error('\n❌ Firebase CLI not installed\n')
    console.error('Install: npm install -g firebase-tools\n')
    process.exit(1)
  }

  // 2. Check logged in
  try {
    await runCommand('firebase', ['projects:list'])
    console.log('✓ Logged in to Firebase')
  } catch (error) {
    console.error('\n❌ Not logged in to Firebase\n')
    console.error('Run: firebase login\n')
    process.exit(1)
  }

  // 3. Check project initialized
  const firebaseRc = path.join(process.cwd(), '.firebaserc')
  if (!fs.existsSync(firebaseRc)) {
    console.error('\n❌ Firebase project not initialized\n')
    console.error('Run: firebase init')
    console.error('Select: Firestore, Storage')
    console.error('Project: snapgo-admin\n')
    process.exit(1)
  }
  console.log('✓ Project initialized\n')

  // 4. Deploy all rules
  console.log('📤 Deploying rules to Firebase...\n')

  try {
    // Deploy Firestore rules
    console.log('→ Deploying Firestore rules...')
    await runCommand('firebase', ['deploy', '--only', 'firestore:rules'])
    console.log('  ✓ Firestore rules deployed\n')

    // Deploy Storage rules
    console.log('→ Deploying Storage rules...')
    await runCommand('firebase', ['deploy', '--only', 'storage:rules'])
    console.log('  ✓ Storage rules deployed\n')

    console.log('✅ All rules deployed successfully!\n')
    console.log('📝 Next steps:')
    console.log('   1. Test: npm run dev')
    console.log('   2. Upload blog image at /admin/blogs/create')
    console.log('   3. Verify image displays at /blog\n')

  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message)
    console.error('Check Firebase permissions for snapgo-admin project\n')
    process.exit(1)
  }
}

main().catch(console.error)
