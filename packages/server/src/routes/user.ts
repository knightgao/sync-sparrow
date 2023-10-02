import { Context } from 'koa';
export async function userHandler(ctx: Context,next: () => Promise<void>): Promise<void> {
  ctx.body = 'Home Page';
  next();
}