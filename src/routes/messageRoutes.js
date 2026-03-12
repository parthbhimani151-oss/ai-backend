import { Router } from 'express';
import { storeMessage, getMessages, getLatestMessage } from '../controllers/messageController.js';
import { validate, messageValidation } from '../middleware/validator.js';

const router = Router();

/**
 * @route   POST /api/messages
 * @desc    Store a new message
 * @access  Public
 */
router.post('/', validate(messageValidation), storeMessage);

/**
 * @route   GET /api/messages
 * @desc    Get paginated list of messages
 * @access  Public
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 */
router.get('/', getMessages);

/**
 * @route   GET /api/messages/latest
 * @desc    Get the latest message
 * @access  Public
 */
router.get('/latest', getLatestMessage);

export default router;
