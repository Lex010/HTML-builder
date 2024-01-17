const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const outputStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Добро пожаловать! Введите текст (введите "exit", чтобы выйти):');

function handleInput(input) {
  if (input.toLowerCase() === 'exit') {
    console.log('До свидания! Выход.');
    outputStream.end();
    process.exit(0);
  }

  outputStream.write(input + '\n');
  rl.question('', handleInput);
}

rl.question('', handleInput);

// При выходе через Ctrl + C
rl.on('close', () => {
  console.log('Выход.');
  outputStream.end();
  process.exit(0);
});
