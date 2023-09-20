const rlp = require('readline');

const rl = rlp.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askDir() {
  return new Promise(resolve => {
    rl.question('Enter photo folder: ', input => resolve(input));
  });
}

const copyPath = 'Photos'
const fs = require('fs/promises');
const fsSync = require('fs');

const getFiles = async (dir) => {
  return await fs.readdir(dir)
}

const parsePath = (path) => {
  return {
    type: path.slice(0,3),
    year: path.slice(4,8),
    month: path.slice(8,10),
    date: path.slice(10,12),
    time: path.slice(13,19)
  }
}

const makeDir = async (fileObj) => {
  let path = copyPath
  const dirOrder = ['year', 'month', 'date']

  dirOrder.forEach(async (item) => {
    path += '/' + fileObj[item]
    try {
      const isExisting = fsSync.existsSync(path)
      if (!isExisting) {
        fs.mkdir(path);
      }
    } catch (err) {
      console.error(err);
    }
  })

  return path
}

const copyFiles = async (dir) => {
  const folderPath = await askDir()
  rl.close()

  !fsSync.existsSync(copyPath) && await fs.mkdir(copyPath);

  const files = await getFiles(folderPath)

  files.forEach(async (path) => {
    const fileObj = parsePath(path)
    const copyPath = await makeDir(fileObj)
    await fs.copyFile(`${folderPath}/${path}`, `${copyPath}/${path}`)
  })
}
copyFiles()