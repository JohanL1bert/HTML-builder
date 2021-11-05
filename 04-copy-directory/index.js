const fs = require('fs');
const path = require('path');
const { stdout } = process;
const { readdir, copyFile, rm } = require('fs/promises');

const defaultPath = path.join(__dirname, 'files');
const pathFolderToCopy = path.join(__dirname, 'files-copy');


fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) throw err;
});


const f = async() => {
  try {
    const files = await readdir(pathFolderToCopy);
    for (const key of files) {
      await rm(path.join(__dirname, 'files-copy', key), { recursive: true });
    } 
    const readF = await readdir(defaultPath);
    for (const key of readF) {
      const pathToCopyFile = path.join(defaultPath, key);
      const pathToNewDirectory = path.join(pathFolderToCopy, key);
      copyFile(pathToCopyFile, pathToNewDirectory);
    }
  } catch (err) {
    stdout.write(err + '\n');
  }
};

f();

