import emailService from '../../services/email/templates/emailService';
import env from '../../env';
import {
  asyncHandler,
  logger,
  sendCookie,
  sendRedirect,
  sendResponse,
} from '../../handlers/handler';
import User, { accountType } from '../../models/authModels/user.model';
import jwtService from '../../services/auth/jwt.service';
import userService from '../../services/auth/user.service';
import { Request, Response } from 'express';
import commonService from '../../services/common.service';

export const getUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user) {
      return sendResponse(res, 200, 'User Info', { user: req.user });
    }
    return sendResponse(res, 401, 'User Info:', { message: 'Not logged in' });
  }
);

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  logger('INFO', 'Signup attempt:', email);

  const isExisting = await commonService.findInstance(User,"email",email);
  
  // [] means true in JS
  if (isExisting && isExisting.length > 0) {
    logger('ERROR', 'User already exists:', email);
    return sendResponse(res, 409, 'User with email already exists', {
      isExisting,
    });
  }

  const otp = await jwtService.generateOTP(email);

  // Email Verification
  await emailService.sendEmail({
    to: email,
    subject: 'Email Verification for Signup on Tierly',
    template: {
      type: 'email_otp',
      data: {
        to_username: name,
        otp,
      },
    },
  });

  return sendResponse(res, 200, 'An Otp is sent to email for verification.');
});


export const emailVerificationByOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, otp, password } = req.body;
    const email = otp.email;

    const isValidOtp = await jwtService.validateOTP(otp);
    if (!isValidOtp) {
      return sendResponse(res, 404, 'Invalid Otp');
    }

    const newUser = await userService.createUser({
      name,
      email: isValidOtp.email,
      password,
      accountType: accountType.Local,
    });

    const accessToken = await jwtService.signJwt(
      { id: newUser._id.toString() },
      env.ACCESS_SECRET,
      { expiresIn: env.ACCESS_SECRET_TTL }
    );

    sendCookie(res, 'accessToken', accessToken);
    newUser.access_token = accessToken;
    logger('INFO', 'User signed up successfully:', email);

    return sendResponse(res, 201, 'User signed up successfully', {
      user: newUser,
    });
  }
);

export const signinUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  logger('INFO', 'Signin attempt:', email);

  const user = await userService.findUser({ email });
  if (!user) {
    logger('ERROR', 'Signin failed. User not found:', email);
    return sendResponse(res, 400, 'User not signed up');
  }

  const accessToken = await jwtService.findandreissueToken(email);
  if (!accessToken) {
    logger('ERROR', 'Token reissue failed:', email);
    return sendResponse(res, 404, 'Access token not found');
  }

  sendCookie(res, 'accessToken', accessToken, { sameSite: 'lax' });

  logger('INFO', 'User signed in successfully:', email);

  return sendResponse(res, 200, 'User signed in successfully', {
    user,
    accessToken,
  });
});

export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  logger('INFO', 'Logout request received');

  sendCookie(res,'accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  logger('INFO', 'User logged out successfully');

  return sendResponse(res, 200, 'Logged out successfully');
});


export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body;

  if (!otp) {
    logger('ERROR', 'OTP missing in request');
    return sendResponse(res, 400, 'OTP is required');
  }

  const validOtp = await jwtService.validateOTP(otp);
  if (!validOtp) {
    logger('ERROR', 'Invalid OTP attempt');
    return sendResponse(res, 400, 'Invalid OTP');
  }

  const user = await userService.findUser({ email: validOtp.email });
  if (!user) {
    logger('ERROR', 'OTP verified but user not found:', validOtp.email);
    return sendResponse(res, 404, 'User no longer exists');
  }

  const accessToken = await jwtService.signJwt(
    { id: user._id.toString() },
    env.ACCESS_SECRET,
    { expiresIn: env.ACCESS_SECRET_TTL }
  );

  await jwtService.deleteOtp(validOtp);

  logger('INFO', 'OTP verified successfully:', user.email);

  return sendResponse(res, 200, 'OTP verified successfully', {
    user: {
      name: user.name,
      email: user.email,
      accessToken,
    },
  });
});


export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    logger('INFO', 'Forgot password request:', email);

    const user = await userService.findUser({ email });
    if (!user) {
      logger('ERROR', 'Forgot password user not found:', email);
      return sendResponse(res, 404, 'User not found');
    }

    const { token, resetLink } = await jwtService.generateResetTokenandLink();

    await jwtService.saveResetToken(user._id.toString(), token);

    await emailService.sendEmail({
      to: email,
      subject: 'Reset Password on E-Bucket',
      template: {
        type: 'forgot_password',
        data: {
          to_username: user.name,
          reset_link: resetLink,
        },
      },
    });

    logger('INFO', 'Password reset email sent:', email);

    return sendResponse(res, 200, 'Password reset link sent to email');
  }
);


export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    logger('INFO', 'Reset password attempt');

    const validToken = await jwtService.validateToken(token);
    if (!validToken) {
      logger('ERROR', 'Invalid or expired reset token');
      return sendResponse(res, 400, 'Invalid or expired reset token');
    }

    const user = await userService.findUser({
      id: validToken.userId.toString(),
    });

    if (!user) {
      logger('ERROR', 'Reset token valid but user not found');
      return sendResponse(res, 404, 'User not found');
    }

    user.password = password;

    await user.save();

    logger('INFO', 'Password reset successful:', user.email);

    return sendResponse(res, 200, 'Password reset successful');
  }
);


const jwtAuthController = {
  getUserStatus,
  signupUser,
  emailVerificationByOTP,
  signinUser,
  logoutUser,
  verifyOTP,
  forgotPassword,
  resetPassword,
};

export default jwtAuthController;
