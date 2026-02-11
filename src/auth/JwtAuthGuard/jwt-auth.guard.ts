// src/common/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | any {
    // ✅ Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ✅ If public, skip authentication
    if (isPublic) {
      return true;
    }

    // ✅ Otherwise, use JWT authentication
    return super.canActivate(context);
  }

  // ✅ Override handleRequest to handle public routes
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // ✅ Check if route is public using context parameter
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ✅ For public routes, allow access even without user
    if (isPublic && !user) {
      return null; // No user, but that's okay for public routes
    }

    // ✅ For protected routes, require authentication
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized access');
    }

    return user;
  }
}