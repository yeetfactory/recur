// Privacy Policy and Terms content - Single source of truth
// Used by both onboarding and settings policy screens

export const PRIVACY_CONTENT = {
  title: 'Privacy Policy',
  lastUpdated: 'December 2025',
  version: '0.0.1 (Alpha)',
  sections: [
    {
      title: 'Overview',
      content:
        "Recur is a subscription tracking application. We are committed to protecting your privacy.\n\nThe short version: We don't collect, store, or share any of your personal data. Everything stays on your device.",
    },
    {
      title: 'Information We Collect',
      content:
        'None. The App does not collect, transmit, or store any personal information on external servers. All data you enter is stored locally on your device only.',
    },
    {
      title: 'Data Storage',
      content:
        'All information you provide is stored exclusively on your device using local storage. This includes:\n\n• Your name\n• Your currency preference\n• Subscription information you enter\n• App preferences\n\nWe do not have access to this data. It never leaves your device.',
    },
    {
      title: 'Third-Party Services',
      content:
        'The App uses the following third-party service:\\n\\n• Brandfetch API - Used to fetch company logos and brand information when you search for subscriptions. When you search, the search query is sent to Brandfetch to retrieve brand data. No personal information is shared.\\n\\nThe App does not integrate with any analytics, advertising, or tracking services.',
    },
    {
      title: 'Permissions',
      content:
        'The App does not require or request any special device permissions (such as camera, contacts, location, etc.).',
    },
    {
      title: 'International Compliance',
      content:
        'Since all data remains on your device and we collect nothing, no cross-border data transfers occur. This approach is compliant with:\n\n• GDPR (European Union)\n• CCPA (California, USA)\n• LGPD (Brazil)\n• POPIA (South Africa)\n• PDPA (Singapore, Thailand)\n• DPDP Act (India)\n• Other applicable data protection regulations',
    },
  ],
};

export const TERMS_CONTENT = {
  title: 'Terms & Conditions',
  lastUpdated: 'December 2025',
  version: '0.0.1 (Alpha)',
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
      title: '3. Alpha Version Disclaimer',
      content:
        'This is an Alpha release (v0.0.1). The App is provided for testing and early access purposes. Features may be incomplete, change without notice, or contain bugs.',
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
