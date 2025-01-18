const fs = require('fs');
const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

async function copyDir(src, dest) {
  try {
    // Проверяем, существует ли исходная папка
    if (!fs.existsSync(src)) {
      throw new Error(`Source folder "${src}" does not exist.`);
    }

    // Удаляем папку назначения, если она существует
    await rm(dest, { recursive: true, force: true });

    // Создаем папку назначения
    await mkdir(dest, { recursive: true });

    // Читаем содержимое исходной папки
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Рекурсивно копируем подкаталоги
        await copyDir(srcPath, destPath);
      } else {
        // Копируем файлы
        await copyFile(srcPath, destPath);
      }
    }

    console.log(`Folder "${src}" successfully copied to "${dest}".`);
  } catch (error) {
    console.error(`Error copying folder: ${error.message}`);
  }
}

const srcFolder = path.join(__dirname, 'files'); // Исходная папка
const destFolder = path.join(__dirname, 'files-copy'); // Папка назначения

copyDir(srcFolder, destFolder);