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

// src/translate.ts
var translate_exports = {};
__export(translate_exports, {
  tranlationDict: () => tranlationDict,
  translate: () => translate
});
module.exports = __toCommonJS(translate_exports);
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
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
var tranlationDict = Object.keys(json1).reduce((acc, key) => {
  acc[key] = shuffleArray(key.split("")).join("");
  return acc;
}, {});
function translate(json, tranlationDict2) {
  const parsed = JSON.parse(json);
  const resp = Object.keys(parsed).reduce((acc, key) => {
    const newKey = tranlationDict2[key];
    acc[newKey ?? key] = parsed[key];
    return acc;
  }, {});
  return resp;
}
var translated = translate(JSON.stringify(json1), tranlationDict);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tranlationDict,
  translate
});
