import express from 'express';
import { Server } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

interface Message {
  name: string;
  message: string;
}

// クライアント接続時の処理
wss.on('connection', (ws) => {
  console.log('New client connected');

  // クライアントからメッセージを受け取ったとき
  ws.on('message', (data) => {
    const parsedData: Message = JSON.parse(data.toString());

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
app.use(express.static('public'));

// サーバー起動
server.listen(3500, () => {
  console.log('Server is listening on port 3500');
});