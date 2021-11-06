const fs = require('fs');
const path = require('path');
const { stdout } = process;
const { readdir, appendFile, readFile} = require('fs/promises');



const pathBundleFolder = path.join(__dirname, 'project-dist', 'bundle.css');
const styleFolder = path.join(__dirname, 'styles');


const readFiles = async(createPathFile) => {
  try {
    const data1 = await readFile(createPathFile, 'utf-8');
    return data1;
  } catch(err) {
    stdout.write(err);
  }
};

const writeFileAnswer = async(data) => {
  try {
    await appendFile(pathBundleFolder, data);
  } catch(err) {
    stdout.write(err);
  }
};

const f = async() => {
  fs.open(pathBundleFolder, 'w', (err) => {
    if (err) throw err;
  });
  try {
    const files = await readdir(styleFolder, {withFileTypes: true});
    files.map(fileName => {
      fs.stat(path.join(styleFolder, fileName.name), (err) => {
        if (err) throw err;
        const fileData = path.parse(fileName.name);
        const fileExt = fileData.ext;
        if (fileExt.slice(1) === 'css') {
          const createPathFile = path.join(__dirname, 'styles', fileName.name);
          const getData = readFiles(createPathFile);
          getData.then((result) => {
            writeFileAnswer(result);
          });
        }
      });
    });
  } catch (err) {
    stdout.write(err);
  }
};

f();
