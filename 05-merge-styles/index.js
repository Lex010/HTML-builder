const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distFolderPath, 'bundle.css');

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
  const bundleContent = stylesArray.join('\n');
  //Запись объединенных стилей в файл bundle.css
  fs.writeFile(bundleFilePath, bundleContent, 'utf-8', (writeErr) => {
    if (writeErr) {
      console.error('Ошибка при записи файла bundle.css:', writeErr);
    } else {
      console.log('Файл bundle.css успешно создан в папке project-dist.');
    }
  });
});
