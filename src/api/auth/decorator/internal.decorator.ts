import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { InternalApiKeyGuard } from '../internal-api-key.guard';

export const IS_INTERNAL_KEY = 'isInternal';

/**
 * Decorator to mark internal-only endpoints.
 *
 * It attaches metadata and automatically adds the {@link InternalApiKeyGuard}
 * so that the request must include a valid `x-api-key` header matching
 * `INTERNAL_API_KEY` from the configuration.
 */
export const Internal = () =>
  applyDecorators(SetMetadata(IS_INTERNAL_KEY, true), UseGuards(InternalApiKeyGuard));
