// src/config.ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// OAuth credentials for Google and Apple (replace these with your real credentials)
export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
export const APPLE_CLIENT_ID = process.env.EXPO_PUBLIC_APPLE_CLIENT_ID || 'YOUR_APPLE_CLIENT_ID';

// Redirect URIs for your app (set in your Google/Apple developer consoles)
export const GOOGLE_REDIRECT_URI =
  process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI || 'YOUR_GOOGLE_REDIRECT_URI';
export const APPLE_REDIRECT_URI =
  process.env.EXPO_PUBLIC_APPLE_REDIRECT_URI || 'YOUR_APPLE_REDIRECT_URI';
