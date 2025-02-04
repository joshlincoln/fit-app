import { Controller, Post, Body, Route, Tags } from 'tsoa';
import User,  { UserDocument } from '../models/user';
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
  @Post('google')
  public async googleSignIn(@Body() body: GoogleAuthRequest): Promise<{ token: string; user: UserDocument }> {
    const decoded = jwt.decode(body.idToken) as any;
    if (!decoded || !decoded.email || !decoded.sub || !decoded.name) {
      this.setStatus(400);
      throw new Error('Invalid Google token');
    }
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = new User({
        email: decoded.email,
        name: decoded.name,
        provider: 'google',
        providerId: decoded.sub,
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }

  @Post('apple')
  public async appleSignIn(@Body() body: AppleAuthRequest): Promise<{ token: string; user: UserDocument }> {
    const decoded = jwt.decode(body.identityToken) as any;
    if (!decoded || !decoded.email || !decoded.sub || !decoded.name) {
      this.setStatus(400);
      throw new Error('Invalid Apple token');
    }
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = new User({
        email: decoded.email,
        name: decoded.name,
        provider: 'apple',
        providerId: decoded.sub,
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  }
}
