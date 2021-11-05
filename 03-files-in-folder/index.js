const fs = require('fs');
const path = require('path');
const { stdout } = process;

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  if(err){
    stdout.write(err + '\n');
  }

  files.forEach(el => {
    if (el.isFile()) {
      fs.stat(path.join(pathToFolder, el.name), (err, stats) => {
        if (err) stdout.write(err + '\n');
        const fileData = path.parse(el.name);
        const fileName = fileData.name;
        const fileExt = fileData.ext;
        const fileKbytes = Math.ceil(stats.size / Math.pow(1024, 1));
        const fileBytes = stats.size / 1000;
        stdout.write(fileName + ' - ' + fileExt.slice(1) + ' : ' + fileKbytes + 'kb' + '  or  ' + fileBytes + 'b' + '\n'); 
      });
    }
  });
});