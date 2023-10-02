import { Socket } from 'socket.io';

declare type MiddlewareArgs = Array<any>;

declare type MiddlewareNext = () => void;

/**
 * 开始玩游戏
 */
export default function game(socket: Socket) {
    return async ([event,param , cb]: MiddlewareArgs, next: MiddlewareNext) => {
        if(event.startsWith("game-room")){
            console.log("send",param)
            socket.to(`${event}`).emit(`${event}-listen`,param)
        }
        next()
    };
}