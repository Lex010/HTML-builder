const fs = require('fs');
const path = require('path');

// Шаг 1: Создание папки project-dist
const distFolderPath = path.join(__dirname, 'project-dist');
fs.mkdirSync(distFolderPath, { recursive: true });

// Шаг 2: Чтение и сохранение содержимого файла template.html
const templateFilePath = path.join(__dirname, 'template.html');
const templateContent = fs.readFileSync(templateFilePath, 'utf-8');

// Шаг 3: Поиск всех имен тегов в файле template.html
const componentTags = templateContent.match(/{{(.*?)}}/g) || [];

// Шаг 4: Замена тегов в шаблоне на содержимое файлов компонентов
const replacedContent = componentTags.reduce((acc, tag) => {
  const componentName = tag.slice(2, -2).trim();
  const componentFilePath = path.join(
    __dirname,
    'components',
    `${componentName}.html`,
  );

  if (
    fs.existsSync(componentFilePath) &&
    path.extname(componentFilePath) === '.html'
  ) {
    const componentContent = fs.readFileSync(componentFilePath, 'utf-8');
    return acc.replace(tag, componentContent);
  } else {
    console.error(`Ошибка: Файл компонента не найден для тега '${tag}'.`);
    return acc;
  }
}, templateContent);

// Шаг 5: Запись измененного шаблона в index.html в папке project-dist
const indexPath = path.join(distFolderPath, 'index.html');
fs.writeFileSync(indexPath, replacedContent, 'utf-8');
console.log('Файл index.html успешно создан в папке project-dist.');

// Шаг 6: Выполнение скрипта из задачи 05-merge-styles для создания style.css
const stylesFolderPath = path.join(__dirname, 'styles');
// const distFolderPath = path.join(__dirname, 'project-dist'); Уже создана ранее
const styleFilePath = path.join(distFolderPath, 'style.css');

//Читаем содержимое папки
fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    console.error('Ошибка при чтении папки со стилями:', err);
    return;
  }
  // Поиск файлов с расширением .css
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  //Чтение содержимого каждого файла CSS
  const stylesArray = cssFiles.map((cssFile) => {
    const filePath = path.join(stylesFolderPath, cssFile);
    return fs.readFileSync(filePath, 'utf-8');
  });
  //Объединение стилей в одну строку
  const styleContent = stylesArray.join('\n');
  //Запись объединенных стилей в файл style.css
  fs.writeFile(styleFilePath, styleContent, 'utf-8', (writeErr) => {
    if (writeErr) {
      console.error('Ошибка при записи файла style.css:', writeErr);
    } else {
      console.log('Файл style.css успешно создан в папке project-dist.');
    }
  });
});

// Шаг 7: Выполнение скрипта из задачи 04-copy-directory для перемещения папки assets
const fsProm = require('fs/promises');

const folderPath = path.join(__dirname, 'assets');
const destinationPath = path.join(__dirname, 'project-dist', 'assets');

async function copyDirRecursive(source, destination) {
  try {
    // Проверка наличия исходной директории
    const sourceStat = await fsProm.stat(source);
    if (!sourceStat.isDirectory()) {
      throw new Error(`${source} is not a directory.`);
    }

    // Создание целевой директории, если она еще не создана
    await fsProm.mkdir(destination, { recursive: true });

    // Чтение содержимого исходной директории
    const files = await fsProm.readdir(source);

    // Рекурсивное копирование файлов и поддиректорий
    for (const file of files) {
      const sourceFilePath = path.join(source, file);
      const destinationFilePath = path.join(destination, file);

      const fileStat = await fsProm.stat(sourceFilePath);

      if (fileStat.isDirectory()) {
        await copyDirRecursive(sourceFilePath, destinationFilePath);
      } else {
        await fsProm.copyFile(sourceFilePath, destinationFilePath);
        console.log(`${file} Скопирован успешно.`);
      }
    }

    console.log(`Директория ${source} скопирована в ${destination}.`);
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
  }
}
// Использование функции
copyDirRecursive(folderPath, destinationPath);
