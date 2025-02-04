import { Controller, Post, Body, Route, Tags } from 'tsoa';
import User, { UserDocument } from '../models/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface GoogleAuthRequest {
  idToken: string;
}

interface AppleAuthRequest {
  identityToken: string;
}

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  /**
   * Stubbed Sign In with Google.
   * This endpoint ignores the provided token and returns a default user.
   */
  @Post('google')
  public async googleSignIn(
    @Body() body: GoogleAuthRequest,
  ): Promise<{ token: string; user: UserDocument }> {
    const defaultUserData = {
      email: 'test@example.com',
      name: 'Test User',
      provider: 'google' as const,
      providerId: 'default_google_id',
    };
    let user = await User.findOne({ email: defaultUserData.email });
    if (!user) {
      user = new User(defaultUserData);
      await user.save();
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }

  /**
   * Stubbed Sign In with Apple.
   * This endpoint ignores the provided token and returns a default user.
   */
  @Post('apple')
  public async appleSignIn(
    @Body() body: AppleAuthRequest,
  ): Promise<{ token: string; user: UserDocument }> {
    const defaultUserData = {
      email: 'test@example.com',
      name: 'Test User',
      provider: 'apple' as const,
      providerId: 'default_apple_id',
    };
    let user = await User.findOne({ email: defaultUserData.email });
    if (!user) {
      user = new User(defaultUserData);
      await user.save();
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }
}
