import { Context } from 'koa';

export async function logHandler(ctx: Context,next: () => Promise<void>): Promise<void> {
    const start = Date.now();
  
    await next(); // 转移控制权给下一个中间件或路由处理程序
    
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}