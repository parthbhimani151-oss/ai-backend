import config from '../config/index.js';
import logger from '../services/logger.js';

class AppError extends Error {
    constructor(message, statusCode, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error
    logger.error('Error occurred', {
        error: err.message,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
        stack: config.nodeEnv === 'development' ? err.stack : undefined,
    });

    if (config.nodeEnv === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            code: err.code,
            stack: err.stack,
            error: err,
        });
    }

    // Production error response
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            code: err.code,
        });
    }

    // Programming or unknown errors: don't leak error details
    logger.error('UNEXPECTED ERROR', { error: err });
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
    });
};

const notFound = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
    next(error);
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { AppError, errorHandler, notFound, asyncHandler };
