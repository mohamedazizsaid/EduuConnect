"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongo_1 = require("./utils/mongo");
const http_1 = require("http");
const websocket_1 = require("./utils/websocket");
const PORT = process.env.PORT || 3000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongo_1.connectDB)();
            // Create HTTP server and integrate WebSocket
            const httpServer = (0, http_1.createServer)(app_1.default);
            (0, websocket_1.initializeWebSocket)(httpServer);
            httpServer.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
                console.log(`WebSocket ready at ws://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    });
}
main();
