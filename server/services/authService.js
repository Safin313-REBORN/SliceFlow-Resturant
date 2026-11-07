import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import emailService from './emailService.js';

class AuthService {
  generateToken(id, role) {
    return jwt.sign(
      { id, role },
      process.env.JWT_SECRET || 'sliceflow_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  setTokenCookie(res, token) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    };

    res.cookie('jwt', token, cookieOptions);
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register({ name, email, password }) {
    const existing = await User.findOne({ email });
    if (existing) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    // Generate unhashed verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = this.hashToken(verificationToken);
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      role: 'customer',
      isEmailVerified: false,
      verificationTokenHash,
      verificationTokenExpiry,
    });

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
  }

  async login({ email, password, res, expectedRole = null }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    if (expectedRole && user.role !== expectedRole) {
      const error = new Error('Access denied. Insufficient administrative privileges.');
      error.statusCode = 403;
      throw error;
    }

    const token = this.generateToken(user._id, user.role);
    if (res) {
      this.setTokenCookie(res, token);
    }

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async verifyEmail(token) {
    if (!token) {
      const error = new Error('Verification token is required.');
      error.statusCode = 400;
      throw error;
    }

    const verificationTokenHash = this.hashToken(token);
    const user = await User.findOne({
      verificationTokenHash,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error('Verification token is invalid or has expired.');
      error.statusCode = 400;
      throw error;
    }

    user.isEmailVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return { success: true, message: 'Email successfully verified.' };
  }

  async resendVerification(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal email existence
      return { success: true, message: 'If this email exists, a verification link has been dispatched.' };
    }

    if (user.isEmailVerified) {
      return { success: true, message: 'This email is already verified. You can log in directly.' };
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationTokenHash = this.hashToken(verificationToken);
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
    return { success: true, message: 'A fresh verification email has been dispatched.' };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 to prevent user enumeration
      return { success: true, message: 'If that email exists, password reset instructions have been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetTokenHash = this.hashToken(resetToken);
    user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, resetToken);
    return { success: true, message: 'If that email exists, password reset instructions have been dispatched.' };
  }

  async resetPassword({ token, newPassword }) {
    if (!token || !newPassword) {
      const error = new Error('Token and new password are required.');
      error.statusCode = 400;
      throw error;
    }

    const passwordResetTokenHash = this.hashToken(token);
    const user = await User.findOne({
      passwordResetTokenHash,
      passwordResetExpiry: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error('Password reset token is invalid or has expired.');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    return { success: true, message: 'Password reset successful. You may now log in.' };
  }
}

export default new AuthService();

