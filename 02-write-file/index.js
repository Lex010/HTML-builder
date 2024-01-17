const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const outputStream = fs.createWriteStream(filePath, { flags: 'a' }); // Флаг 'a' открывает файл в режиме добавления

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Приветственное сообщение
console.log('Добро пожаловать! Введите текст (введите "exit", чтобы выйти):');

// Функция для обработки ввода пользователя
function handleInput(i) {
  if (i.toLowerCase() === 'exit') {
    // Прощальное сообщение
    console.log('До свидания! Выход...');
    // Закрыть поток записи и завершить выполнение
    outputStream.end();
    process.exit(0);
  }

  // Записать введенный текст в файл
  outputStream.write(i + '\n');

  // Продолжить ожидание ввода пользователя
  rl.question('', handleInput);
}

// Начать ожидание ввода пользователя
rl.question('', handleInput);
