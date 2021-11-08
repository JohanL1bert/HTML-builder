const fs = require('fs');
const path = require('path');
const { stdout } = process;
const { readdir, appendFile, readFile} = require('fs/promises');



const pathBundleFolder = path.join(__dirname, 'project-dist', 'bundle.css');
const styleFolder = path.join(__dirname, 'styles');

const f = async() => {
  fs.open(pathBundleFolder, 'w', (err) => {
    if (err) throw err;
  });
  try {
    const files = await readdir(styleFolder, {withFileTypes: true});
    for (const fileName of files) {
      const fileData = path.parse(fileName.name);
      const fileExt = fileData.ext;
      if (fileExt.slice(1) === 'css') {
        const createPathFile = path.join(__dirname, 'styles', fileName.name);
        const getData = await readFile(createPathFile, 'utf-8');
        await appendFile(pathBundleFolder, getData);
      }
    }
  } catch (err) {
    stdout.write(err);
  }
};

f();
