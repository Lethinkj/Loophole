const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Append to log file
    const logFile = path.join(__dirname, 'auto-commit.log');
    fs.appendFileSync(logFile, logMessage + '\n');
}

function autoCommit() {
    try {
        // Update timestamp in a dummy file to ensure there's always something to commit
        const timestampFile = path.join(__dirname, 'last-auto-commit.txt');
        const timestamp = new Date().toISOString();
        fs.writeFileSync(timestampFile, `Last auto commit: ${timestamp}\n`);
        
        // Check if there are any changes
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        
        if (status.trim() === '') {
            log('No changes to commit');
            return;
        }

        // Add all changes
        execSync('git add .');
        log('Added all changes to staging');

        // Create commit message with timestamp
        const commitMessage = `Auto commit - ${new Date().toLocaleString()}`;
        
        execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf8' });
        log(`Committed with message: ${commitMessage}`);
        
        // Push to remote repository
        execSync('git push', { encoding: 'utf8' });
        log('Pushed changes to remote repository');
        
        log('Auto commit completed successfully');
        
    } catch (error) {
        log(`Error during auto commit: ${error.message}`);
        process.exit(1);
    }
}

// Run the auto commit
autoCommit();
