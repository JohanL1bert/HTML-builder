const fs = require('fs');
const path = require('path');
const { stdout } = process;

const pathToFile = path.join(__dirname, '/text.txt');
const stream = fs.createReadStream(pathToFile, 'utf-8');
stream.on('data', chunk => stdout.write(chunk));
stream.on('error', err => stdout.write(err.message));
