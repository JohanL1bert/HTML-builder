const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readLineText = require('readline').createInterface({
  input: stdin,
  output: stdout,
});


readLineText.on('SIGINT', () => {
  stdout.write('\n');
  stdout.write('You press CTR + C. Nothing was written to the file. GoodBye');
  process.exit();
});

const writeFileAnswer = (data) => {
  fs.appendFile(`${pathToFolder}`, `${data + '\n'}`, (err) => {
    if(err) throw err;
  });
};

const pathToFolder = path.join(__dirname, 'newFile.txt'); 
fs.open(pathToFolder, 'w', (err) => {
  if (err) throw err;
  const createQuestion = () => {
    readLineText.question('Type Something: ', answer => {
      if (answer.toLowerCase() === 'exit') {
        stdout.write('GoodBye');
        readLineText.close();
      } else {
        writeFileAnswer(answer);
        createQuestion();
      }
    });
  };
  createQuestion();
});
