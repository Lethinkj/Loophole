const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.join(__dirname, 'loop');
const STATE_FILE = path.join(__dirname, 'commit-state.json');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Append to log file
    const logFile = path.join(__dirname, 'auto-commit.log');
    fs.appendFileSync(logFile, logMessage + '\n');
}

function getState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
            return state;
        }
    } catch (error) {
        log(`Error reading state file: ${error.message}`);
    }
    return { shouldAdd: true, commitCount: 0 };
}

function saveState(state) {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    } catch (error) {
        log(`Error saving state: ${error.message}`);
    }
}

function ensureTargetFileExists() {
    if (!fs.existsSync(TARGET_FILE)) {
        fs.writeFileSync(TARGET_FILE, 'Initial line\n');
        log('Created target file');
    }
}

function addLinesToFile() {
    const timestamp = new Date().toISOString();
    const linesToAdd = [
        `Line added at ${timestamp}`,
        `Random data: ${Math.random()}`,
        `Commit cycle: adding lines`,
        `Process ID: ${process.pid}`,
        `Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    ];
    
    const content = fs.readFileSync(TARGET_FILE, 'utf8');
    const newContent = content + linesToAdd.map(line => line + '\n').join('');
    fs.writeFileSync(TARGET_FILE, newContent);
    
    log(`Added 5 lines to ${path.basename(TARGET_FILE)}`);
}

function removeLinesFromFile() {
    const content = fs.readFileSync(TARGET_FILE, 'utf8');
    const lines = content.split('\n');
    
    if (lines.length > 5) { // Keep at least 1 line
        const linesToRemove = Math.min(4, lines.length - 1);
        const newLines = lines.slice(0, lines.length - linesToRemove);
        fs.writeFileSync(TARGET_FILE, newLines.join('\n'));
        log(`Removed ${linesToRemove} lines from ${path.basename(TARGET_FILE)}`);
    } else {
        log('Not enough lines to remove, skipping removal');
    }
}

function autoCommit() {
    try {
        const state = getState();
        
        // Ensure target file exists
        ensureTargetFileExists();
        
        // Perform the alternating action
        if (state.shouldAdd) {
            addLinesToFile();
        } else {
            removeLinesFromFile();
        }
        
        // Update timestamp file
        const timestampFile = path.join(__dirname, 'last-auto-commit.txt');
        const timestamp = new Date().toISOString();
        fs.writeFileSync(timestampFile, `Last auto commit: ${timestamp}\n`);
        
        // Add all changes
        execSync('git add .');
        log('Added all changes to staging');

        // Create commit message with action and timestamp
        const action = state.shouldAdd ? 'Added 5 lines' : 'Removed 4 lines';
        const commitMessage = `Auto commit - ${action} - ${new Date().toLocaleString()}`;
        
        execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf8' });
        log(`Committed with message: ${commitMessage}`);
        
        // Push to remote repository
        execSync('git push', { encoding: 'utf8' });
        log('Pushed changes to remote repository');
        
        // Update state for next run
        state.shouldAdd = !state.shouldAdd;
        state.commitCount++;
        saveState(state);
        
        log(`Auto commit completed successfully. Total commits: ${state.commitCount}`);
        
    } catch (error) {
        log(`Error during auto commit: ${error.message}`);
        // Don't exit, continue the loop
    }
}

function startAutoCommitLoop() {
    log('Starting auto-commit loop (every 5 minutes)');
    
    // Run immediately
    autoCommit();
    
    // Set up interval for every 5 minutes (300000 milliseconds)
    setInterval(() => {
        autoCommit();
    }, 5 * 60 * 1000);
}

// Start the continuous loop
startAutoCommitLoop();
