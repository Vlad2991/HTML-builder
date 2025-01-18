const fs = require('fs');
const path = require('path');
const { readdir, stat } = require('fs/promises');
const folderPath = path.join(__dirname, 'secret-folder');
async function listFiles() {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(folderPath, file.name);
            const fileStat = await stat(filePath);
            const fileSize = (fileStat.size / 1024).toFixed(3); 
            const fileExt = path.extname(file.name).slice(1); 
            const fileName = path.basename(file.name, path.extname(file.name));
            console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
        }
    }
}
listFiles().catch(console.error);