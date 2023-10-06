import { log } from 'console';
import { Socket } from 'socket.io';

declare type MiddlewareArgs = Array<any>;

declare type MiddlewareNext = () => void;

/**
 * 限制加入房间
 */
const limit = (socket: Socket) => {
    return async ([event,param , cb]: MiddlewareArgs, next: MiddlewareNext) => {
        if(event === "want-join-room"){
            if(param){
                socket.join(`${param}`);
            }
        }
        next()
    };
}

export default limit;