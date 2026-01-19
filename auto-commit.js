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
  } catch (error) {
    console.error('❌ Git config failed:', error.message);
    throw error;
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
      execSync('git push origin main', { stdio: 'inherit' });
    } catch (error) {
      execSync('git push origin master', { stdio: 'inherit' });
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
    console.log('✓ Git configured');
    
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
