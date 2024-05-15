"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/migrate.ts
var migrate_exports = {};
__export(migrate_exports, {
  default: () => HandleDataTypes
});
module.exports = __toCommonJS(migrate_exports);
var HandleDataTypes = class {
  transformDataType(data, translateObj) {
    const translateObject = {
      "date": "timestamp"
    };
    const obj = { ...translateObject, ...translateObj ?? {} };
    const isString = /char/i.test(data);
    const hasNumber = /number/i.test(data);
    const hasComma = /,/i.test(data);
    const isInteger = hasNumber && !hasComma;
    const isDecimal = hasNumber && hasComma;
    return isString ? translateObj?.string ?? "string" : isInteger ? translateObj?.int ?? "int" : isDecimal ? { type: "decimal", precision: data.split("(")[1].split(",")[0], scale: data.split("(")[1].split(",")[1].split(")")[0] } : obj[data];
  }
  migrate({ mainDict, dataTypesDict, translateObj }) {
    const dataTypesDictLower = Object.entries(dataTypesDict).reduce((acc2, entry) => {
      acc2[entry[0].toLowerCase()] = entry[1];
      return acc2;
    }, {});
    const migrated = Object.keys(mainDict).reduce((acc, key) => {
      const keyLower = key.toLowerCase();
      if (!!dataTypesDictLower[keyLower]) {
        acc[key] = this.transformDataType(dataTypesDictLower[keyLower], translateObj);
      }
      return acc;
    }, {});
    return migrated;
  }
};
