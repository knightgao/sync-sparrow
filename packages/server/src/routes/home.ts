import { Context } from 'koa';

export async function homeHandler(ctx: Context): Promise<void> {
  ctx.body = 'Home Page';
}