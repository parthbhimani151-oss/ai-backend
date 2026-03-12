import { body, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
            value: err.value,
        }));

        throw new AppError(
            'Validation failed',
            400,
            'VALIDATION_ERROR'
        );
    };
};

// Validation schemas
const messageValidation = [
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ max: 1000 })
        .withMessage('Message must not exceed 1000 characters'),
];

export { validate, messageValidation };
