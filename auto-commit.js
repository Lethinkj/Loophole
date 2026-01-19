#!/usr/bin/env node
/**
 * Auto-commit script for daily automated commits
 * Adds a timestamp entry to commits.txt file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function setupGitConfig() {
  try {
    execSync('git config user.name "lethin"', { stdio: 'inherit' });
    execSync('git config user.email "lethin@auto-commit.local"', { stdio: 'inherit' });
    console.log('✓ Git configured');
  } catch (error) {
    console.error('❌ Git config failed:', error.message);
    throw error;
  }
}

function setupGitRemote() {
  try {
    // Check if origin exists
    try {
      execSync('git remote get-url origin', { stdio: 'pipe' });
      console.log('✓ Git remote already configured');
      return;
    } catch (e) {
      // Origin doesn't exist, add it
    }
    
    // Add GitHub token to remote URL
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable not set');
    }
    
    const remoteUrl = `https://${token}@github.com/Lethinkj/censored.git`;
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
    console.log('✓ Git remote configured');
  } catch (error) {
    // Remote might already exist, that's okay
    console.log('⚠️  Remote setup (non-critical):', error.message);
  }
}

function addCommitLine() {
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0] + ' ' + 
                    now.toTimeString().split(' ')[0];
  const line = `[${timestamp}] this is auto comited by lethin for any further assistance contact lethin\n`;
  
  const commitsFile = path.join(process.cwd(), 'commits.txt');
  
  // Ensure commits.txt exists
  if (!fs.existsSync(commitsFile)) {
    fs.writeFileSync(commitsFile, '');
  }
  
  // Append the line
  fs.appendFileSync(commitsFile, line);
  
  return line.trim();
}

function commitAndPush() {
  try {
    // Add the file
    execSync('git add commits.txt', { stdio: 'inherit' });
    
    // Commit with timestamp
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + 
                      now.toTimeString().split(' ')[0];
    const commitMsg = `Auto-commit by lethin - ${timestamp}`;
    
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
    
    // Try pushing to main, fallback to master
    try {
      execSync('git push -u origin main 2>&1', { stdio: 'inherit' });
    } catch (mainError) {
      try {
        execSync('git push -u origin master 2>&1', { stdio: 'inherit' });
      } catch (masterError) {
        // Try with force if needed
        execSync('git push -u origin HEAD:main --force 2>&1', { stdio: 'inherit' });
      }
    }
    
    console.log(`✅ Commit successful: ${commitMsg}`);
    return true;
  } catch (error) {
    console.error(`❌ Commit failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🤖 Starting auto-commit process...');
  
  try {
    // Setup git configuration
    setupGitConfig();
    
    // Setup git remote with GitHub token
    setupGitRemote();
    
    // Add commit line
    const line = addCommitLine();
    console.log(`✓ Added line: ${line}`);
    
    // Commit and push
    if (commitAndPush()) {
      console.log('✅ Auto-commit completed successfully!');
      process.exit(0);
    } else {
      console.log('❌ Auto-commit failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
