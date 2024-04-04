"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MiddlewareAbstract_1 = __importDefault(require("../struct/express/MiddlewareAbstract"));
class ParseBodies extends MiddlewareAbstract_1.default {
    execution(req, res, next) {
        express_1.default.json({
            verify: (req, res, buf) => {
                try {
                    req.body = JSON.parse(buf.toString());
                }
                catch (e) {
                    res.json({ status: 400, message: "Bad Request" });
                }
            }
        });
    }
}
exports.default = ParseBodies;
