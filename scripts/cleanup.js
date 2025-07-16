const fs = require('fs');
const path = require('path');

// Clean up files older than 1 hour
const MAX_AGE = 60 * 60 * 1000; // 1 hour in milliseconds

function cleanupOldFiles() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('Uploads directory does not exist');
    return;
  }

  const now = Date.now();
  const dirs = fs.readdirSync(uploadsDir);

  dirs.forEach(dir => {
    if (dir === 'DEMO_SAMPLE_ID') return; // Don't delete demo files
    
    const dirPath = path.join(uploadsDir, dir);
    const stats = fs.statSync(dirPath);
    const age = now - stats.mtime.getTime();

    if (age > MAX_AGE) {
      try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Cleaned up old directory: ${dir}`);
      } catch (error) {
        console.error(`Error cleaning up ${dir}:`, error);
      }
    }
  });
}

cleanupOldFiles(); 