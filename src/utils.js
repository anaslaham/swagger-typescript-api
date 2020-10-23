const _ = require("lodash");

// its filter and reduce together :)
const collect = (objectOrArray, cb) =>
  _.reduce(
    objectOrArray,
    (acc, part, key) => {
      const result = cb(part, key);

      return _.isArray(objectOrArray)
        ? result
          ? [...acc, result]
          : acc
        : result
        ? { ...acc, [key]: result }
        : acc;
    },
    _.isArray(objectOrArray) ? [] : {},
  );

const getEndPoints = (pathsArr) => {
  let lastPathCategory = "";
  let categoryindex = -1;
  let endData = [];
  pathsArr.forEach((path, index) => {
    const pointsArr = path.split("/");
    if (lastPathCategory !== pointsArr[pointsArr.length - 2]) {
      endData.push({
        baseRoute: pointsArr[pointsArr.length - 2],
        endPoints: [
          {
            endRoute: pointsArr[pointsArr.length - 1],
          },
        ],
      });
      categoryindex++;
    } else {
      endData[categoryindex].endPoints.push({
        endRoute: pointsArr[pointsArr.length - 1],
      });
    }
    lastPathCategory = pointsArr[pointsArr.length - 2];
  });
  return endData;
};

module.exports = {
  collect,
  getEndPoints,
};
