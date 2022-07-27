const fs = require("fs");

const checkFolder = (username) => {
  const dirPath = `./public/user/${username}`;
  const isFolderExist = fs.existsSync(dirPath);
  if (!isFolderExist) {
    fs.mkdirSync(dirPath);
  }
};

const moveFile = (username, oldPath, newPath) => {
  checkFolder(username);
  fs.rename(oldPath, newPath);
};

const deleteFile = (filePath) => {
  fs.unlinkSync(filePath);
};

module.exports = { checkFolder, moveFile, deleteFile };
