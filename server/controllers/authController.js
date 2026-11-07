import authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for the verification link.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password, res });
    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password, res, expectedRole: 'admin' });
    res.status(200).json({
      success: true,
      message: 'Administrator authentication verified.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const result = await authService.verifyEmail(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword({ token, newPassword });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

