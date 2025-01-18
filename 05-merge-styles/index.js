const fs = require('fs');
const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

async function mergeStyles() {
    try {
        const stylesDir = path.join(__dirname, 'styles');
        const outputDir = path.join(__dirname, 'project-dist');
        const outputFile = path.join(outputDir, 'bundle.css');


        await fs.promises.mkdir(outputDir, { recursive: true });


        const files = await readdir(stylesDir, { withFileTypes: true });

        const styles = await Promise.all(
            files
                .filter(file => file.isFile() && path.extname(file.name) === '.css')
                .map(async file => {
                    const filePath = path.join(stylesDir, file.name);
                    return readFile(filePath, 'utf-8');
                })
        );


        await writeFile(outputFile, styles.join('\n'));

        console.log(`Styles have been successfully merged into ${outputFile}`);
    } catch (error) {
        console.error(`Error during styles merging: ${error.message}`);
    }
}

mergeStyles();