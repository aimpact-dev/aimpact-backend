"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const main_1 = require("./main");
let cachedServer;
async function handler(req, res) {
    if (!cachedServer) {
        cachedServer = await (0, main_1.createApp)();
    }
    return cachedServer(req, res);
}
//# sourceMappingURL=vercel-entrypoint.js.map