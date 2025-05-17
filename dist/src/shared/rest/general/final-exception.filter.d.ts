import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export default class FinalExceptionFilter implements ExceptionFilter {
    private static parseError;
    catch(originException: Error, host: ArgumentsHost): void;
}
