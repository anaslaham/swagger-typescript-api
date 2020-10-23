const _ = require("lodash");
const { parseSchema } = require("./schema");
const { addToConfig } = require("./config");

/**
 *
 * @typedef TypeInfo
 * {
 *    typeName: "Foo",
 *    componentName: "schemas",
 *    rawTypeData: {...},
 *    typeData: {...} (result parseSchema())
 * }
 */

/**
 * @returns {{ "#/components/schemas/Foo": TypeInfo, ... }}
 */
const createComponentsMap = (components) => {
  const componentsMap = _.reduce(
    components, //the objects
    //res  value         key
    (map, component, componentName) => {
      //the object     value        key
      _.each(component, (rawTypeData, typeName) => {
        // only map data for now
        map[`#/components/${componentName}/${typeName}`] = {
          typeName,
          rawTypeData,
          componentName,
          typeData: null,
        };
      });
      //creating an array
      return map;
    },
    {},
  );
  addToConfig({ componentsMap });
  return componentsMap;
};

/**
 * @returns {TypeInfo[]}
 */
const filterComponentsMap = (componentsMap, componentName) =>
  _.filter(componentsMap, (v, ref) => _.startsWith(ref, `#/components/${componentName}`));

/** @returns {{ type, typeIdentifier, name, description, content }} */
const getTypeData = (typeInfo) => {
  if (!typeInfo.typeData) {
    typeInfo.typeData = parseSchema(typeInfo.rawTypeData, typeInfo.typeName);
  }

  return typeInfo.typeData;
};

module.exports = {
  getTypeData,
  createComponentsMap,
  filterComponentsMap,
};
