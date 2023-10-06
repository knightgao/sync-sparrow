import { log } from 'console';
import { Socket } from 'socket.io';

declare type MiddlewareArgs = Array<any>;

declare type MiddlewareNext = () => void;

/**
 * 开始玩游戏
 */
const game = (socket: Socket) => {
    return async ([event,param , cb]: MiddlewareArgs, next: MiddlewareNext) => {
        if(event.startsWith("game-room")){
            socket.join(`${event}`);
            socket.to(`${event}`).emit(`${event}-listen`,param)
        }
        next()
    };
}

export default game;