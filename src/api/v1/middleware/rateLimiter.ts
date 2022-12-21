import rateLimit from 'express-rate-limit';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 60 * 1000, // 1 minute in milliseconds
  max: 60,
  message: 'Please try again later', 
  headers: true,
});