const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFileInfo() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    //Проход по каждому элементу
    for (const file of files) {
      // Проверка, является ли элемент файлом
      if (file.isFile()) {
        // Получение полного пути к файлу
        const filePath = path.join(folderPath, file.name);

        // Получение информации о файле
        const fileStats = await fs.stat(filePath);
        //Получение расширения файла
        const fileExtension = path.extname(file.name).slice(1);
        // Форматирование и вывод информации о файле в консоль
        console.log(
          `${path.parse(file.name).name} - ${fileExtension} - ${
            fileStats.size
          } bytes`,
        );
      } else {
        // Обработка ошибки, если элемент является директорией
        console.error(`Error: ${file.name} Это папка, а не файл`);
      }
    }
  } catch (error) {
    console.error(`Error reading folder: ${error.message}`);
  }
}
// Вызов функции для отображения информации о файлах
displayFileInfo();
