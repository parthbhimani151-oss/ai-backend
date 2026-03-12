import { Router } from 'express';
import { getHealth, pingRedis, getSystemInfo } from '../controllers/healthController.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Get basic health status
 * @access  Public
 */
router.get('/', getHealth);

/**
 * @route   GET /api/health/redis
 * @desc    Check Redis connection status
 * @access  Public
 */
router.get('/redis', pingRedis);

/**
 * @route   GET /api/health/system
 * @desc    Get detailed system information
 * @access  Public
 */
router.get('/system', getSystemInfo);

export default router;
