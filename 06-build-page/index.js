const fs = require('fs');
const path = require('path');
const { stdout } = process;
const { readdir, appendFile, readFile, stat, copyFile } = require('fs/promises');

const pathDist = path.join(__dirname, 'project-dist');
const styleFolder = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const components = path.join(__dirname, 'components');
const readTemplate = path.join(__dirname, 'template.html');
const newAssetsFolder = path.join(pathDist, 'assets');

fs.mkdir((pathDist), { recursive: true }, (err) => {
  if (err) throw err;
});

fs.mkdir((newAssetsFolder), { recursive: true }, (err) => {
  if (err) throw err;
});


const createFile = () => {
  fs.open(path.join(pathDist, 'style.css'), 'w', (err) => {
    if (err) throw err;
  });

  fs.open(path.join(pathDist, 'index.html'), 'w', (err) => {
    if (err) throw err;
  });
};

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
    const pathStyle = path.join(pathDist, 'style.css');
    await appendFile(pathStyle, data);
  } catch(err) {
    stdout.write(err);
  }
};

const clearFileExt = async(data) => {
  try {
    const cleanedArray = [];
    await data.map(async(dataFile) => {
      const file = path.parse(dataFile);
      const fileExt = file.ext;
      if (fileExt.slice(1) === 'html') {
        cleanedArray.push(dataFile);
      }
    });
    return cleanedArray;
  } catch (err) {
    stdout.write(err);
  }


};

const styleCollector = async() => {
  try {
    const files = await readdir(styleFolder, { withFileTypes: true });
    files.map(fileName => {
      fs.stat(path.join(styleFolder, fileName.name), (err) => {
        if (err) throw err;
        const fileData = path.parse(fileName.name);
        const fileExt = fileData.ext;
        if (fileExt.slice(1) === 'css') {
          createFile();
          const createPathFile = path.join(__dirname, 'styles', fileName.name);
          const getData = readFiles(createPathFile);
          getData.then((fileBundle) => {
            writeFileAnswer(fileBundle);
          });
        }
      });
    });
  } catch (err) {
    stdout.write(err);
  }
};

const htmlBunde = async() => {
  try {
    let readHTML = await readFile(readTemplate, 'utf-8');
    /*const createRegex = readHTML.match(/{{\w+}}/g); */
    const readAllTemplates = await readdir(components);
    const cleanArray = await clearFileExt(readAllTemplates);
    const lenOfTemp = cleanArray.length - 1;
    cleanArray.map(async(data, index) => {
      let getTemplate;
      const createPath = path.join(components, data);
      const sliceVariable = new RegExp(`{{${data.slice(0, -5)}}}`);
      const createRegex = readHTML.match(sliceVariable);
      if (createRegex[0].includes(data.slice(0, -5))) {
        getTemplate = await readFile(createPath, 'utf-8');
        readHTML = readHTML.replace(createRegex[0], getTemplate);
      } 
      if (index == lenOfTemp) {
        const pathHTML = path.join(pathDist, 'index.html');
        appendFile(pathHTML, readHTML);
      }     
    });
    
  } catch(err) {
    stdout.write(err);
  }
};

const createFileByCopy = async(data) => {
  try {
    fs.mkdir((data), { recursive: true }, (err) => {
      if (err) throw err;
    });    
  } catch(err) {
    stdout.write(err);
  }
};

const assetsCopy = async() => {
  try {
    const f = async(assets, newAssetsFolder) => {
      const folderDir = await readdir(assets, { withFileTypes: true });
      folderDir.map(async(folder) => {
        const pathTo = path.join(assets, folder.name);
        const getStat = await stat(pathTo);
        if (getStat.isDirectory()) {
          const oldPath = path.join(assets, folder.name);
          const newPath = path.join(newAssetsFolder, folder.name);
          f(oldPath, newPath);
        } else {
          createFileByCopy(newAssetsFolder);
          copyFile(path.join(assets, folder.name), path.join(newAssetsFolder, folder.name));
        }
      });
    };
    f(assets, newAssetsFolder);
  } catch(err) {
    stdout.write(err);
  }
};


styleCollector();
htmlBunde();
assetsCopy();
