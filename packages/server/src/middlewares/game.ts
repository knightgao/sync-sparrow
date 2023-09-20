import { Socket } from 'socket.io';

declare type MiddlewareArgs = Array<any>;

declare type MiddlewareNext = () => void;

/**
 * 开始玩游戏
 */
export default function game(socket: Socket) {
    return async ([event, , cb]: MiddlewareArgs, next: MiddlewareNext) => {
        console.log("event", event)
        console.log("cb", cb)
        next()
    };
}