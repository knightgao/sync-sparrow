import Router from "@koa/router";
import type {RouterContext} from "@koa/router";

// 导入所有路由处理器
import { homeHandler } from './home';

// 定义路由映射
const routes: { method: string, path: string, handler: (ctx: RouterContext) => Promise<any> }[] = [
  { method: 'GET', path: '/11', handler: homeHandler },
  // 添加更多路由...
];

// 批量注册路由
export function registerRoutes(router:Router): void {
    routes.forEach(route => {
        const { method, path, handler } = route;
        (router as any )[method.toLowerCase()](path, handler);
      });
}