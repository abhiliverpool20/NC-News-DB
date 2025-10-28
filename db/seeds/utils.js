const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookupObj = (array, keyStr, valueStr) => {
  if (array.length === 0) return {};
  const lookupObj = {};
  array.forEach((object) => {
    lookupObj[object[keyStr]] = object[valueStr];
  });
  return lookupObj;
};
