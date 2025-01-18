const fs = require('fs');
const path = require('path');
const { mkdir, readFile, writeFile, readdir, copyFile, rm } = require('fs/promises');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');


async function createProjectDist() {
    await mkdir(projectDist, { recursive: true });
}


async function buildHtml() {
    let template = await readFile(templateFile, 'utf-8');
    const tags = template.match(/{{\s*[\w]+\s*}}/g) || [];

    for (const tag of tags) {
        const componentName = tag.replace(/{{\s*|\s*}}/g, '');
        const componentPath = path.join(componentsDir, `${componentName}.html`);
        try {
            const componentContent = await readFile(componentPath, 'utf-8');
            template = template.replace(new RegExp(tag, 'g'), componentContent);
        } catch {
            console.warn(`Component "${componentName}" not found in ${componentsDir}.`);
        }
    }

    await writeFile(outputHtml, template);
    console.log(`HTML built: ${outputHtml}`);
}


async function buildStyles() {
    const files = await readdir(stylesDir, { withFileTypes: true });
    const styles = await Promise.all(
        files
            .filter(file => file.isFile() && path.extname(file.name) === '.css')
            .map(file => readFile(path.join(stylesDir, file.name), 'utf-8'))
    );

    await writeFile(outputCss, styles.join('\n'));
    console.log(`Styles merged: ${outputCss}`);
}


async function copyAssets(src, dest) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyAssets(srcPath, destPath);
        } else {
            await copyFile(srcPath, destPath);
        }
    }
    console.log(`Assets copied: ${src} -> ${dest}`);
}

async function buildPage() {
    try {

        await rm(projectDist, { recursive: true, force: true });


        await createProjectDist();


        await buildHtml();

        await buildStyles();


        await copyAssets(assetsDir, outputAssets);

        console.log('Page built successfully!');
    } catch (error) {
        console.error(`Error building page: ${error.message}`);
    }
}

buildPage();