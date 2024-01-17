const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    //Проверка наличия папки 'files'
    await fs.access(folderPath);

    // создание 'files-copy' если это еще не выполнено
    await fs.mkdir(destinationPath, { recursive: true });

    // Чтение содержимого 'files' и 'files-copy'
    const files = await fs.readdir(folderPath);
    const destinationFiles = await fs.readdir(destinationPath);

    for (const file of files) {
      const sourceFilePath = path.join(folderPath, file);
      const destinationFilePath = path.join(destinationPath, file);

      // Копируем в 'files-copy'
      await fs.copyFile(sourceFilePath, destinationFilePath);
      console.log(`${file} Скопирован успешно.`);
    }
    // Удаление лишних файлов из 'files-copy'
    for (const file of destinationFiles) {
      if (!files.includes(file)) {
        const filePathToDelete = path.join(destinationPath, file);

        // Удаляем файл из 'files-copy'
        await fs.unlink(filePathToDelete);

        console.log(`${file} Удален из 'files-copy'.`);
      }
    }

    console.log('Копирование завершено.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Source directory '${folderPath}' does not exist.`);
    } else {
      console.error('Error copying directory:', error.message);
    }
  }
}

// Вызов функции
copyDir();
