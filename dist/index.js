"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/tables.ts
var import_fs = __toESM(require("fs"));
var import_path = require("path");

// src/migrate.ts
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
  migrate({ mainDict, dataTypesDict: dataTypesDict2, translateObj }) {
    const dataTypesDictLower = Object.entries(dataTypesDict2).reduce((acc2, entry) => {
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

// src/tables.ts
var Tables = class {
  constructor() {
    this._table = null;
    this._translateDict = null;
    this._handleDataTypes = new HandleDataTypes();
    this._dataTypes = null;
  }
  get table() {
    return this._table;
  }
  get translateDict() {
    return this._translateDict;
  }
  get dataTypes() {
    return this._dataTypes;
  }
  setOriginalData({ id, data }) {
    const dbDirectory = (0, import_path.resolve)(__dirname, "db", id);
    const dbPath = (0, import_path.resolve)(dbDirectory, "originalData.json");
    this.save({ dbDirectory, dbPath, data });
    this._table = data;
  }
  save({ dbDirectory, dbPath, data }) {
    const exists = import_fs.default.existsSync(dbDirectory);
    if (!exists) {
      import_fs.default.mkdirSync(dbDirectory, { recursive: true });
    }
    import_fs.default.writeFileSync(dbPath, JSON.stringify(data, null, 4));
  }
  getTable({ id }) {
    const jsonPth = (0, import_path.resolve)(__dirname, "db", id, "originalData.json");
    const exists = import_fs.default.existsSync(jsonPth);
    if (exists) {
      const json = import_fs.default.readFileSync(jsonPth, "utf-8");
      this._table = JSON.parse(json);
      return json;
    }
    return null;
  }
  translateWithKeyReplace({ data, tranlationDict }) {
    const replaceKey = Object.keys(data).reduce((acc, key) => {
      const newKey = tranlationDict[key];
      acc[newKey ?? key] = data[key];
      return acc;
    }, {});
    return replaceKey;
  }
  translateWithTranslationOnValue({ data, tranlationDict }) {
    const oldKeyAndNewKey = Object.keys(data).reduce((acc, key) => {
      acc[key] = tranlationDict[key];
      return acc;
    }, {});
    return oldKeyAndNewKey;
  }
  translate({ data, tranlationDict, dictId }) {
    const replaceKey = this.translateWithKeyReplace({ data, tranlationDict });
    const oldKeyAndNewKey = this.translateWithTranslationOnValue({ data, tranlationDict });
    const dbDirectory = (0, import_path.resolve)(__dirname, "db", dictId);
    const replaceKeyDirectory = (0, import_path.resolve)(dbDirectory, "replaceKey.json");
    const oldKeyAndNewKeyDirectory = (0, import_path.resolve)(dbDirectory, "oldKeyAndNewKey.json");
    this.save({ dbDirectory, dbPath: replaceKeyDirectory, data: replaceKey });
    this.save({ dbDirectory, dbPath: oldKeyAndNewKeyDirectory, data: oldKeyAndNewKey });
    this._translateDict = oldKeyAndNewKey;
    return { replaceKey, oldKeyAndNewKey };
  }
  getTranslateDict({ id }) {
    const jsonPth = (0, import_path.resolve)(__dirname, "db", id, "oldKeyAndNewKey.json");
    const exists = import_fs.default.existsSync(jsonPth);
    if (exists) {
      const json = import_fs.default.readFileSync(jsonPth, "utf-8");
      const data = JSON.parse(json);
      this._translateDict = data;
      return data;
    }
    return null;
  }
  handleDataTypes({ mainDict, dataTypesDict: dataTypesDict2, translateObj, dictId }) {
    const hd = this._handleDataTypes;
    const transformedData = hd.migrate({ mainDict, dataTypesDict: dataTypesDict2, translateObj });
    const translatedDict = this.getTranslateDict({ id: dictId });
    if (translatedDict) {
      const translated = this.translateWithKeyReplace({ data: transformedData, tranlationDict: translatedDict });
      const dbDirectory = (0, import_path.resolve)(__dirname, "db", dictId);
      const dbPath = (0, import_path.resolve)(dbDirectory, "dataTypes.json");
      this.save({ dbDirectory, dbPath, data: translated });
      this._dataTypes = translated;
    }
    ;
  }
  getDateTypes({ id }) {
    const jsonPth = (0, import_path.resolve)(__dirname, "db", id, "dataTypes.json");
    const exists = import_fs.default.existsSync(jsonPth);
    if (exists) {
      const json = import_fs.default.readFileSync(jsonPth, "utf-8");
      const data = JSON.parse(json);
      this._dataTypes = data;
      return data;
    }
    return null;
  }
  load({ id, data, tranlationDict, dataTypesDict: dataTypesDict2, translateObj }) {
    this.setOriginalData({ id, data });
    this.translate({ data, tranlationDict, dictId: id });
    this.handleDataTypes({ mainDict: data, dataTypesDict: dataTypesDict2, translateObj, dictId: id });
    console.log(`table -->  ${JSON.stringify(this.table, null, 4)}`);
    console.log(`translateDict -->  ${JSON.stringify(this.translateDict, null, 4)}`);
    console.log(`dataTypes -->  ${JSON.stringify(this.dataTypes, null, 4)}`);
  }
  delete({ id }) {
    const jsonPth = (0, import_path.resolve)(__dirname, "db", id);
    const exists = import_fs.default.existsSync(jsonPth);
    if (exists) {
      import_fs.default.rmSync(jsonPth, { recursive: true });
      console.log(`table ${id} deleted!`);
      return;
    }
    console.log(`table not found.`);
  }
};

// src/index.ts
var json1 = {
  param_1: "",
  param_2: "",
  param_3: "",
  param_4: "",
  param_5: "",
  param_6: "",
  param_7: "",
  param_8: "",
  param_9: "",
  param_10: "",
  param_11: "",
  param_12: "",
  param_13: ""
};
var translationJson1 = {
  param_1: "param_1",
  param_2: "param_2",
  param_3: "param_3",
  param_4: "param_4",
  param_5: "param_5",
  param_6: "param_6",
  param_7: "param_7",
  param_8: "param_8",
  param_9: "param_9",
  param_10: "param_10",
  param_11: "param_11",
  param_12: "param_12",
  param_13: "param_13"
};
var dataTypesDict = {
  "param_1": "NUMBER(10)",
  "param_2": "NUMBER(10)",
  "param_3": "NUMBER(10)",
  "param_4": "NUMBER(10)",
  "param_5": "CHAR(155BYTE)",
  "param_6": "CHAR(2CHAR)",
  "param_7": "CHAR(155BYTE)",
  "param_8": "VARCHAR()",
  "param_9": "DATE",
  "param_10": "NUMBER(10)",
  "param_11": "DATE",
  "param_12": "DATE",
  "param_13": "NUMBER(15,3)"
};
var table = new Tables();
table.load({ id: "json1", data: json1, tranlationDict: translationJson1, dataTypesDict });
