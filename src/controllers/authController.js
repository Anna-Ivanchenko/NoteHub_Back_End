import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import { User } from '../models/user.js';
import {
  createSession,
  setSessionCookies,
  clearSessionCookies,
} from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  let user;
  try {
    user = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(400, 'Email in use');
    }
    throw error;
  }

  const newSession = await createSession(user._id);

  setSessionCookies(res, newSession);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);

  setSessionCookies(res, newSession);

  res.status(200).json({ user });
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId) {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  }

  clearSessionCookies(res);

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await session.deleteOne();
    clearSessionCookies(res);
    throw createHttpError(401, 'Session token expired');
  }

  await session.deleteOne();

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

export const checkSession = async (req, res) => {
  const { sessionId, accessToken, refreshToken } = req.cookies;

  if (!sessionId) {
    return res.status(200).json(null);
  }

  if (accessToken) {
    const activeSession = await Session.findOne({
      _id: sessionId,
      accessToken,
    });
    if (activeSession && activeSession.accessTokenValidUntil > new Date()) {
      const user = await User.findById(activeSession.userId);
      if (user) {
        return res.status(200).json(user);
      }
    }
  }

  if (refreshToken) {
    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (session && session.refreshTokenValidUntil > new Date()) {
      await session.deleteOne();
      const newSession = await createSession(session.userId);
      setSessionCookies(res, newSession);

      const user = await User.findById(newSession.userId);
      return res.status(200).json(user);
    }
  }

  clearSessionCookies(res);
  return res.status(200).json(null);
};

//!-----------------------------------------
export const requestResetEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(200).json({
      message: 'If this email exists, a reset link has been sent',
    });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: req.body.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const templatePath = path.resolve('src/templates/reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: req.body.email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.status(200).json({
    message: 'Password reset email sent successfully',
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const user = await User.findOne({ _id: payload.sub, email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    message: 'Password reset successfully',
  });
};
