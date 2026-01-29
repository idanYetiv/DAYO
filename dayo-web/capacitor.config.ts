import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.dayo.web',
  appName: 'DAYO',
  webDir: 'dist',
  server: {
    // For development - allows live reload
    // url: 'http://localhost:5173',
    // cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: false
  }
};

export default config;
