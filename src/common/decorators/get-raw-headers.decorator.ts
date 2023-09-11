import { createParamDecorator } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator((data: string, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const headers = request.rawHeaders;

  return !data ? headers : headers[data];
});
