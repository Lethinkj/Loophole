/**
 * Google Cloud Function - Auto-commit handler
 * Deploy this to Google Cloud Functions
 * Trigger: Cloud Pub/Sub + Cloud Scheduler
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.autoCommit = async (req, res) => {
  try {
    console.log('🤖 Starting auto-commit on Google Cloud Functions...');
    
    // Ensure GitHub token is available
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN not set in environment variables');
    }
    
    // Set up git configuration
    try {
      execSync('git config user.name "lethin"');
      execSync('git config user.email "lethin@auto-commit.local"');
      console.log('✓ Git configured');
    } catch (error) {
      console.log('⚠️  Git config (non-critical):', error.message);
    }
    
    // Get timestamp
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + 
                      now.toTimeString().split(' ')[0];
    
    // Create commit line
    const line = `[${timestamp}] this is auto comited by lethin for any further assistance contact lethin\n`;
    
    console.log(`✓ Adding line: ${line.trim()}`);
    
    // Append to commits.txt
    const commitsFile = path.join('/tmp', 'commits.txt');
    if (fs.existsSync(commitsFile)) {
      fs.appendFileSync(commitsFile, line);
    } else {
      fs.writeFileSync(commitsFile, line);
    }
    
    // Stage file
    execSync('git add commits.txt', { stdio: 'inherit' });
    
    // Create commit
    const commitMsg = `Auto-commit by lethin - ${timestamp}`;
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
    console.log(`✓ Committed: ${commitMsg}`);
    
    // Push to GitHub
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      console.log('✓ Pushed to main');
    } catch (mainError) {
      try {
        execSync('git push origin master', { stdio: 'inherit' });
        console.log('✓ Pushed to master');
      } catch (masterError) {
        throw new Error('Failed to push to both main and master branches');
      }
    }
    
    // Success response
    console.log('✅ Auto-commit completed successfully!');
    res.status(200).json({
      success: true,
      status: 'Auto-commit completed',
      timestamp: timestamp,
      message: 'Commit by lethin'
    });
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error(error.stack);
    
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
