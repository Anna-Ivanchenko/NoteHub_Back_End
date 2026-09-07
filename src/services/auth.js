import crypto from 'node:crypto';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  return Session.create({
    userId: userId,
    accessToken: crypto.randomUUID(),
    refreshToken: crypto.randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
};

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('sessionId', cookieOptions);
};
