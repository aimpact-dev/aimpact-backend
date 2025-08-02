import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export default class FinalExceptionFilter implements ExceptionFilter {
  private static parseError(exception: Error): HttpException {
    return exception instanceof HttpException
      ? exception
      : new InternalServerErrorException(exception.message, { cause: exception });
  }

  public catch(originException: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpException = FinalExceptionFilter.parseError(originException);

    if (httpException.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const httpResponse = httpException.getResponse();
      const response =
        typeof httpException === 'string'
          ? {
              response: httpResponse,
            }
          : (httpResponse as object);

      Sentry.captureException(httpException, {
        level: 'error',
        user: {
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        },
        extra: {
          message: `Failed to process request: ${request?.method} ${request?.url}`,
          ...response,
        },
      });
    }

    Logger.error(originException.stack);

    return response.status(httpException.getStatus()).json(httpException.getResponse());
  }
}
