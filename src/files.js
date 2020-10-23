const _ = require("lodash");
const fs = require("fs");
const { resolve } = require("path");

const getFileContent = (path) => fs.readFileSync(path, { encoding: "UTF-8" });

const pathIsExist = (path) => path && fs.existsSync(path);

const createFile = (pathTo, fileName, content) =>
  fs.promises
    .mkdir(`${pathTo}`, { recursive: true })
    .then(
      fs.writeFile(`${pathTo}` + fileName, content, (err) => {
        if (err) {
          console.log(`❌ ${err}`);
        } else {
          console.log(`✔️  your typescript api file created in ${pathTo + fileName}`);
        }
      }),
    )
    .catch(console.error);

module.exports = {
  createFile,
  pathIsExist,
  getFileContent,
};
