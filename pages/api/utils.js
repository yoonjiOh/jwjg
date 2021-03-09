import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export const APP_SECRET = 'jwjg-best-luck34';

function getTokenPayload(token) {
  try {
    return jwt.verify(token, APP_SECRET);
  } catch (e) {
    // TODO(jurampark): leaves log for posterity.
    throw new AuthenticationError('Failed to verify jwt.');
  }
}

export function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error('Not authenticated');
}
