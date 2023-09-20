import Koa from 'koa';
import http from 'http';
import { Server } from "socket.io";
import Router from '@koa/router';

const app = new Koa();
const server = http.createServer(app.callback());
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const router = new Router();

// 将路由中间件绑定到Koa应用程序
app.use(router.routes()).use(router.allowedMethods());

// 路由定义
router.get('/', async (ctx) => {
    ctx.body = 'Hello, World!';
});



io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('game-room', (data) => {
        console.log(`Received message: ${data}`);
        // 在这里处理从客户端接收到的消息，并发送回客户端等操作

    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});