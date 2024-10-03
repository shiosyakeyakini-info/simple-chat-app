"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.Server({ server });
// クライアント接続時の処理
wss.on('connection', (ws) => {
    console.log('New client connected');
    // クライアントからメッセージを受け取ったとき
    ws.on('message', (data) => {
        const parsedData = JSON.parse(data.toString());
        // 受け取ったメッセージを全クライアントに送信
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(parsedData));
            }
        });
    });
    // クライアントが切断したとき
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
// 静的ファイルを提供（クライアントのHTMLファイル）
app.use(express_1.default.static('public'));
// サーバー起動
server.listen(3500, () => {
    console.log('Server is listening on port 3500');
});
