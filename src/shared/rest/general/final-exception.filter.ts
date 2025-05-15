import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Catch()
export default class FinalExceptionFilter implements ExceptionFilter {
  private static parseError(exception: Error): HttpException {
    return exception instanceof HttpException ? exception : new InternalServerErrorException(exception.message);
  }

  public catch(originException: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpException = FinalExceptionFilter.parseError(originException);

    // if (httpException.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR) {
    Logger.error(originException.stack);
    // }

    return response.status(httpException.getStatus()).json(httpException.getResponse());
  }
}
