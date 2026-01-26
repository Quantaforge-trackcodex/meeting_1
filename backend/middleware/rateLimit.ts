/**
 * Rate Limiting Configuration
 * Defines rate limits for different authentication endpoints
 */

import { FastifyRequest, FastifyReply } from 'fastify';

// Rate limit configurations
export const rateLimitConfig = {
    // Login attempts: 5 per 15 minutes
    login: {
        max: 5,
        timeWindow: '15 minutes',
        errorResponseBuilder: () => ({
            error: 'Too Many Requests',
            message: 'Too many login attempts. Please try again in 15 minutes.',
            retryAfter: 900 // 15 minutes in seconds
        })
    },

    // Registration: 3 per hour
    register: {
        max: 3,
        timeWindow: '1 hour',
        errorResponseBuilder: () => ({
            error: 'Too Many Requests',
            message: 'Too many registration attempts. Please try again later.',
            retryAfter: 3600
        })
    },

    // OAuth: 10 per hour
    oauth: {
        max: 10,
        timeWindow: '1 hour',
        errorResponseBuilder: () => ({
            error: 'Too Many Requests',
            message: 'Too many OAuth attempts. Please try again later.',
            retryAfter: 3600
        })
    },

    // Password reset: 3 per hour per email
    passwordReset: {
        max: 3,
        timeWindow: '1 hour',
        errorResponseBuilder: () => ({
            error: 'Too Many Requests',
            message: 'Too many password reset requests. Please check your email.',
            retryAfter: 3600
        })
    },

    // OTP sending: 5 per hour
    otpSend: {
        max: 5,
        timeWindow: '1 hour',
        errorResponseBuilder: () => ({
            error: 'Too Many Requests',
            message: 'Too many OTP requests. Please try again later.',
            retryAfter: 3600
        })
    },

    // General API: 100 requests per 15 minutes
    general: {
        max: 100,
        timeWindow: '15 minutes',
        errorResponseBuilder: () => ({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please slow down.',
            retryAfter: 900
        })
    }
};

/**
 * Custom key generator for rate limiting
 * Uses IP address + user ID if authenticated
 */
export function rateLimitKeyGenerator(request: FastifyRequest): string {
    const ip = request.ip;
    const userId = (request as any).user?.userId;

    // Include user ID if authenticated to prevent one user from blocking others
    return userId ? `${ip}:${userId}` : ip;
}

/**
 * Add Retry-After header on rate limit
 */
export function rateLimitErrorHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.code(429);
    reply.header('Retry-After', '900'); // 15 minutes in seconds
}
