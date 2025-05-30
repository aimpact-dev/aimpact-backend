import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const AUTH_ALLOWED_KEY = 'authAllowed';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const AuthAllowed = () => SetMetadata(AUTH_ALLOWED_KEY, true);
