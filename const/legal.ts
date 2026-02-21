import Constants from 'expo-constants';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

const PRIVACY_CONTENT = {
  title: 'Privacy Policy',
  lastUpdated: 'February 5, 2026',
  version: APP_VERSION,
  sections: [
    {
      title: 'Overview',
      content:
        "Recur is a subscription tracking app that works fully on your device. We don't run accounts or servers for your subscription data.",
    },
    {
      title: 'Information We Collect',
      content:
        'We do not collect, sell, or share personal data. The app does not send your subscription data to any server.',
    },
    {
      title: 'Data Storage',
      content:
        'All information you provide is stored locally on your device. This includes your name, currency preference, subscriptions you add, and app preferences.',
    },
    {
      title: 'Third-Party Services',
      content: 'We do not integrate analytics, advertising, or tracking SDKs.',
    },
    {
      title: 'Permissions',
      content:
        'The App does not require or request any special device permissions (such as camera, contacts, location, etc.).',
    },
  ],
};

const TERMS_CONTENT = {
  title: 'Terms & Conditions',
  lastUpdated: 'February 5, 2026',
  version: APP_VERSION,
  sections: [
    {
      title: '1. Agreement to Terms',
      content:
        'By downloading, installing, or using Recur, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not use the App.',
    },
    {
      title: '2. Description of Service',
      content:
        'Recur is a subscription tracking application that helps you manage and monitor your recurring payments. The App stores all data locally on your device.',
    },
    {
      title: '3. Pre-Release Notice',
      content:
        'Recur may be in active development. Features can change or improve over time, and you should keep backups of important information.',
    },
    {
      title: '4. User Responsibilities',
      content:
        'When using the App, you agree to:\n\n• Provide accurate information for your own personal use\n• Use the App only for lawful purposes\n• Not attempt to reverse engineer, modify, or distribute the App without permission\n• Not use the App for any fraudulent or harmful activities',
    },
    {
      title: '5. Data and Privacy',
      content:
        'All data you enter into the App is stored locally on your device. We do not collect, access, or store any of your personal information.',
    },
    {
      title: '6. No Warranty',
      content:
        'The App is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.',
    },
    {
      title: '7. Limitation of Liability',
      content:
        'To the maximum extent permitted by applicable law, YeetFactory shall not be liable for any indirect, incidental, special, consequential, or punitive damages.',
    },
  ],
};

// Helper to get content by type
export const getPolicyContent = (type: 'privacy' | 'terms') => {
  return type === 'privacy' ? PRIVACY_CONTENT : TERMS_CONTENT;
};
