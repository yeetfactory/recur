const normalize = (value?: string) => (value ?? '').trim();

export const APP_STORE_URL_IOS = normalize(process.env.EXPO_PUBLIC_APP_STORE_URL);
export const PLAY_STORE_URL_ANDROID = normalize(process.env.EXPO_PUBLIC_PLAY_STORE_URL);
export const APP_WEBSITE_URL = normalize(process.env.EXPO_PUBLIC_APP_WEBSITE_URL);
export const DISCORD_INVITE_URL = normalize(process.env.EXPO_PUBLIC_DISCORD_INVITE_URL);

export const getAppStoreUrl = (platform: string) => {
  if (platform === 'ios') return APP_STORE_URL_IOS;
  if (platform === 'android') return PLAY_STORE_URL_ANDROID;
  return APP_WEBSITE_URL || APP_STORE_URL_IOS || PLAY_STORE_URL_ANDROID;
};

export const getShareUrl = (platform: string) => {
  return APP_WEBSITE_URL || getAppStoreUrl(platform);
};
