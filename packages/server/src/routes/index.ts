import Router from "@koa/router";
import type {RouterContext} from "@koa/router";

// 导入所有路由处理器
import { userHandler } from './user';

// 定义路由映射
const routes = [
  { method: 'GET', path: '/', handler: userHandler },
  // 添加更多路由...
];

// 批量注册路由
export function registerRoutes(router:Router): void {
    routes.forEach(route => {
        const { method, path, handler } = route;
        (router as any )[method.toLowerCase()](path, handler);
      });
}