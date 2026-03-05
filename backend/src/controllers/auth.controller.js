const authService = require('../services/auth.service');
const inviteService = require('../services/invite.service');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    const tokens = await authService.refreshAccessToken(refreshToken);
    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

const acceptInvite = async (req, res, next) => {
  try {
    const { token, password, name } = req.body;

    const result = await inviteService.acceptInvite({
      token,
      password,
      name,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  acceptInvite,
};

