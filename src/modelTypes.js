const _ = require("lodash");
const { formatters } = require("./typeFormatters");
const { checkAndRenameModelName } = require("./modelNames");
const { formatDescription } = require("./common");
const { config } = require("./config");
const { getTypeData } = require("./components");
const util = require("util");

const CONTENT_KEYWORD = "__CONTENT__";

const contentWrapersByTypeIdentifier = {
  enum: `{\r\n${CONTENT_KEYWORD} \r\n }`,
  interface: `{\r\n${CONTENT_KEYWORD}}`,
  type: `= ${CONTENT_KEYWORD}`,
};
let createdFiles = [];
const getModelType = (typeInfo) => {
  let { typeIdentifier, name: originalName, content, type, description } = getTypeData(typeInfo);

  if (config.generateUnionEnums && typeIdentifier === "enum") {
    typeIdentifier = "type";
  }

  if (!contentWrapersByTypeIdentifier[typeIdentifier]) {
    throw new Error(`${typeIdentifier} - type identifier is unknown for this utility`);
  }

  const resultContent = formatters[type] ? formatters[type](content) : content;
  const name = checkAndRenameModelName(originalName);
  const endContent = _.replace(
    contentWrapersByTypeIdentifier[typeIdentifier],
    CONTENT_KEYWORD,
    resultContent,
  );
  //console.log("input arr : ", resultContent.split("\n"));
  let arr = resultContent.split("\n").filter((word) => word.includes("Dto"));
  arr.forEach((word, index) => {
    if (word.includes(")")) {
      arr[index] = _.filter(_.split(_.replace(word, "(", ")"), ")"), (w) => w.includes("Dto"))[0];
    } else {
      arr[index] = _.filter(_.split(_.replace(word, ";", " "), " "), (w) => w.includes("Dto"))[0];
    }
  });
  const dep = arr[0];
  return {
    typeIdentifier,
    name,
    rawContent: resultContent,
    description: formatDescription(description),
    content: endContent,
    dependences: arr,
  };
};

module.exports = {
  getModelType,
  checkAndRenameModelName,
};
