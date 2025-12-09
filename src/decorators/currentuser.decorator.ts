import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the authenticated user from the request
 * Usage: @CurrentUser() user: User - gets the complete object
 * Usage: @CurrentUser('id') userId: string - gets only one property
 * The user is injected by JwtStrategy after validating the token
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // User injected by passport-jwt

    if (!user) {
      return null;
    }

    // If a property (data) is specified, return only that property
    return data ? user?.[data] : user;
  },
);
