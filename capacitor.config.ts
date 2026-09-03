import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'jp.yoka.app',
  appName: 'YOKA',
  webDir: 'dist',
  ios: { contentInset: 'never' },
  server: { iosScheme: 'https' },
};

export default config;
