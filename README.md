# Recur 💸

A local-first subscription tracker built with React Native and Expo. Track recurring expenses with a focused, offline-friendly UI.

![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-000020)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)

## ✨ Features

### 📊 **Dashboard Overview**

- View your total monthly or yearly subscription costs at a glance
- Beautiful, animated chart visualization
- Time-of-day personalized greeting

### 📝 **Subscription Management**

- Add subscriptions with custom names, icons (emoji), amounts, and frequencies
- Edit and delete existing subscriptions
- Drag-and-drop to reorder your subscriptions
- Support for both monthly and yearly billing cycles

### 📁 **List Organization**

- Organize subscriptions into custom lists (e.g., "Work", "Entertainment", "Personal")
- Filter subscriptions by list with chip-based filtering
- Create, edit, and delete lists from Settings

### 🌍 **Multi-Currency Support**

- Large built-in currency list with symbols
- Currency symbol displayed throughout the app
- Set once during onboarding (cannot be changed later)

### 🎨 **Beautiful Design**

- Light and dark mode support
- Custom Recoleta typography
- Smooth animations powered by React Native Reanimated
- Edge-to-edge design on supported devices

### 🔒 **Privacy-First**

- All data stored locally on-device using MMKV
- No cloud sync, no accounts, no tracking
- Your subscription data never leaves your device

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (recommended) or npm/yarn
- [Expo CLI](https://expo.dev/tools)
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yeetfactory/recur.git
   cd recur
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Start the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

4. **Run the app**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser
   - Scan QR code with [Expo Go](https://expo.dev/go) on your device

---

## 📱 App Structure

```
recur/
├── app/                    # Expo Router pages
│   ├── (tabs)/             # Tab-based navigation
│   │   ├── index.tsx       # Home/Dashboard screen
│   │   └── settings/       # Settings screens
│   │       ├── index.tsx   # Main settings
│   │       ├── manage-lists.tsx
│   │       ├── privacy.tsx
│   │       └── terms.tsx
│   └── onboarding/         # First-time user experience
│       ├── index.tsx       # Welcome screen
│       ├── details.tsx     # Name & currency setup
│       └── terms.tsx       # Terms acceptance
├── actions/                # Business logic & data operations
│   ├── subscription.ts     # CRUD for subscriptions
│   ├── list.ts             # CRUD for lists
│   ├── currency.ts         # Currency management
│   └── user.ts             # User preferences
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI primitives
│   ├── add-subscriptions-dialog.tsx
│   ├── edit-subscription-dialog.tsx
│   ├── subscription-avatar.tsx
│   └── emoji-picker.tsx
├── hooks/                  # Custom React hooks
│   └── use-lists.ts        # Lists state management
├── clients/                # External service clients
├── integrations/           # Third-party integrations
│   └── mmkv.ts             # Local storage client
├── lib/                    # Utility functions
├── types.ts                # TypeScript type definitions
└── const.ts                # App constants & currency data
```

---

## 🔧 Technical Details

### Tech Stack

| Technology                                                                                         | Purpose                          |
| -------------------------------------------------------------------------------------------------- | -------------------------------- |
| [Expo](https://expo.dev/)                                                                          | React Native framework & tooling |
| [Expo Router](https://expo.dev/router)                                                             | File-based routing               |
| [NativeWind](https://www.nativewind.dev/)                                                          | Tailwind CSS for React Native    |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)                     | Smooth animations                |
| [MMKV](https://github.com/mrousavy/react-native-mmkv)                                              | High-performance local storage   |
| [Zod](https://zod.dev/)                                                                            | Runtime type validation          |
| [Lucide Icons](https://lucide.dev/)                                                                | Beautiful icon set               |
| [React Native Draggable FlatList](https://github.com/computerjazz/react-native-draggable-flatlist) | Drag-and-drop reordering         |

### Data Models

#### Subscription

```typescript
{
  id: string;
  name: string;
  icon: string | null; // Emoji or null (falls back to initials)
  listId: string | null; // Associated list
  frequency: 'monthly' | 'yearly';
  amount: number;
  currency: Currency; // From CURRENCY_CODES
  startDate: Date;
}
```

#### List

```typescript
{
  id: string;
  name: string;
}
```

---

## 💡 Implementation Nuances

### Auto-Creating Default List

When a user adds their **first subscription** and no lists exist yet, the app automatically creates a "Default" list and assigns the subscription to it. This ensures every subscription always belongs to a list.

```typescript
// From add-subscriptions-dialog.tsx
if (!targetListId) {
  if (lists.length > 0) {
    targetListId = lists[0].id;
  } else {
    const newList = createList('Default'); // ← Auto-creates "Default" list
    targetListId = newList.id;
  }
}
```

### Currency Lock

The user's default currency is set during onboarding and **cannot be changed later**. This is intentional to maintain data consistency across all subscriptions.

### Subscription Card Ordering

- Drag-and-drop reordering is only available when viewing "All" subscriptions
- When filtering by a specific list, drag-and-drop is disabled to prevent confusion
- Order is persisted to local storage

### List Deletion Behavior

When a list is deleted, all subscriptions associated with that list have their `listId` set to `null`. The subscriptions are not deleted—they become "unassigned" and still appear in the "All" view.

### Validation

All data operations use [Zod](https://zod.dev/) for runtime validation, ensuring data integrity even when reading from local storage.

---

## 🎨 Theming

The app uses NativeWind (Tailwind CSS) with a custom color palette:

| Token                   | Description          |
| ----------------------- | -------------------- |
| `bg-background`         | Main background      |
| `bg-card`               | Card backgrounds     |
| `text-foreground`       | Primary text         |
| `text-muted-foreground` | Secondary text       |
| `bg-primary`            | Accent color buttons |
| `border-brand-brown`    | Custom brown border  |

Theme switching is available in Settings and persists across sessions.

---

## 🔗 Optional Links

Set these environment variables to enable external links in Settings:

- `EXPO_PUBLIC_APP_STORE_URL`
- `EXPO_PUBLIC_PLAY_STORE_URL`
- `EXPO_PUBLIC_APP_WEBSITE_URL` (used for sharing when available)
- `EXPO_PUBLIC_DISCORD_INVITE_URL`

---

## 📦 Available Scripts

| Command                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `bun dev`                 | Start Expo dev server (clears cache)             |
| `bun ios`                 | Build and run on iOS                             |
| `bun android`             | Build and run on Android                         |
| `bun web`                 | Start web development server                     |
| `bun clean`               | Remove `.expo` and `node_modules`                |
| `bun maestro:test`        | Run full Maestro suite (onboarding + app flows)  |
| `bun maestro:onboarding`  | Run onboarding flow only                         |
| `bun maestro:dashboard`   | Run dashboard/settings smoke flow                |
| `bun maestro:default-list` | Verify default list auto-creation path          |
| `bun maestro:lists`       | Run manage lists CRUD flow                       |
| `bun maestro:add-dialog-manage-lists` | Verify Add dialog -> Manage Lists navigation |
| `bun maestro:subscriptions` | Run subscription CRUD + view mode/filter flow  |
| `bun maestro:settings`    | Run legal/settings navigation flow               |
| `bun maestro:persistence` | Verify onboarding does not reappear after restart |

## 🧪 Maestro E2E Tests

Maestro flows are in `.maestro/` and target app id `com.yeetfactory.recur`.
Flows use `testID`-based selectors (`id`) for stable taps and reduced flakiness.

### Current Coverage

- Onboarding happy path (name + currency + terms/privacy acceptance)
- Onboarding policy links (terms/privacy detail screens and back navigation)
- First subscription auto-creates `Default` list
- List CRUD (create, edit, search, delete)
- Add Subscription dialog -> Manage Lists navigation
- Subscription CRUD (add, edit, delete)
- Emoji picker selection
- Home view mode toggle (monthly/yearly conversion checks)
- Home list filter chips
- Settings legal screens + theme toggle
- Persistence check (onboarding does not reappear after app relaunch)

### Prerequisites

- Install [Maestro](https://maestro.mobile.dev/getting-started/installing-maestro)
- Boot an iOS Simulator or Android Emulator
- Build and install the app once:
  - `bun ios` (for iOS Simulator)
  - `bun android` (for Android Emulator)

### Run

```bash
bun maestro:test
# or run individual flows
bun maestro:onboarding
bun maestro:dashboard
bun maestro:default-list
bun maestro:lists
bun maestro:add-dialog-manage-lists
bun maestro:subscriptions
bun maestro:settings
bun maestro:persistence
```

---

## 🛡️ Privacy & Data

- **100% Local Storage**: All data stored on-device using MMKV
- **No Analytics**: No tracking or telemetry
- **No Cloud Sync**: Your data stays on your device
- **No Account Required**: Start using immediately

---

## 🚢 Deployment

Deploy with [Expo Application Services (EAS)](https://expo.dev/eas):

- [EAS Build](https://docs.expo.dev/build/introduction/) - Build native apps
- [EAS Updates](https://docs.expo.dev/eas-update/introduction/) - Over-the-air updates
- [EAS Submit](https://docs.expo.dev/submit/introduction/) - App store submission

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🔗 Links

- [Join our Discord Community](https://discord.gg/recur)
- [Privacy Policy](<./app/(tabs)/settings/privacy.tsx>)
- [Terms of Service](<./app/(tabs)/settings/terms.tsx>)

---

<p align="center">
  Made with ❤️ by <a href="https://yeetfactory.com">YeetFactory</a>
</p>
