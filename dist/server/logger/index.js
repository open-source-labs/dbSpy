"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates colored alert via log.info()
 **/
const pino_1 = __importDefault(require("pino"));
const dayjs_1 = __importDefault(require("dayjs"));
const transport = pino_1.default.transport({
    target: 'pino-pretty',
    options: { colorize: true },
});
const log = (0, pino_1.default)({
    base: { pid: false },
    timestamp: () => `,"time":"${(0, dayjs_1.default)().format()}"`,
}, transport);
exports.default = log;
//# sourceMappingURL=index.js.map