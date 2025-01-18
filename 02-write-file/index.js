const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Привет напиши свой текст, или нажми- "exit" для выхода.');

rl.on('line', (input) => {
    if (input.toLowerCase() === 'exit') {
        farewell();
    } else {
        writeStream.write(input + '\n');
    }
});

process.on('SIGINT', farewell);

function farewell() {
    console.log('Пока , хорошего нового года и Рождества!!.');
    writeStream.end();
    process.exit(0);
}