import Koa from 'koa';
import http from 'http';
import { Server } from "socket.io";
import Router from '@koa/router';
import game from './middlewares/game';
import limit from './middlewares/limit';
import { registerRoutes } from './routes';

const app = new Koa();
const server = http.createServer(app.callback());
const io = new Server(server, {
    cors: {
        origin: "*"
    },
    pingTimeout: 10000,
    pingInterval: 5000,
});
const router = new Router();

// 将路由中间件绑定到Koa应用程序
app.use(router.routes()).use(router.allowedMethods());

// 执行批量注册路由
registerRoutes(router);



io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.use(limit(socket));
    socket.use(game(socket));

});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});