export interface User {
  _id: string;
  email: string;
  name: string;
  provider: 'apple' | 'google';
  providerId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface AppleAuthRequest {
  identityToken: string;
}
