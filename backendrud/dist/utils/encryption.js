"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const SECRET_KEY = 'Suresh_Singh';
const encrypt = (data) => {
    return crypto_js_1.default.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};
exports.encrypt = encrypt;
const decrypt = (ciphertext) => {
    const bytes = crypto_js_1.default.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(crypto_js_1.default.enc.Utf8);
    return JSON.parse(decryptedData);
};
exports.decrypt = decrypt;
