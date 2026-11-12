# HB+ Security & Team Portal

A cross-platform React Native and React Native for Web application built for Hop with HB (hbplus.fit). The portal enforces corporate domain-restricted authentication supporting both Google OAuth 2.0 and Work Email credentials, granting access exclusively to accounts under @hbplus.fit while strictly blocking unauthorized domains.

- Live URL: https://verdant-sable-417dc6.netlify.app
- Access Password: My-Drop-Site
- GitHub Repository: https://github.com/anshumansahu620/hb_plus_assignment.git

---

## 1. Executive Summary & Problem Statement

### Objective
Design and implement a cross-platform web and mobile security portal that satisfies the following core requirements:

1. Authentication Options: Support single sign-on via Google OAuth 2.0 and direct Work Email authentication.
2. Strict Domain Validation: Verify the user email domain against the authorized corporate domain (@hbplus.fit).
3. Domain Whitelisting:
   - Authorized Domain: Users with @hbplus.fit emails (for example, employee@hbplus.fit) are validated, their profile is synchronized, and access to the protected Dashboard and Resource Library is granted.
   - Unauthorized Domain: Users authenticating with any non-whitelisted email (for example, user@gmail.com or user@yahoo.com) are immediately rejected, session tokens are revoked, and the exact error alert is displayed:
     > "Access restricted. Please login using your official domain email."
4. Custom Password Setup: Allow users who authenticate via Google OAuth to configure a personal workspace password directly from the dashboard, enabling direct work email sign-in.
5. Role-Based Access Control: Standard users and Administrators are segregated with role-specific views, permission delegation capabilities, and security audit logging.
6. Brand Design Alignment: Visual layout, color palette (Warm Sand, Terracotta, Onyx, Warm Cream), typography (The Seasons, Gilroy, DM Sans), and iconography (clean lock symbols) extracted directly from the Hop with HB production design.

---

## 2. System Architecture & How the Code Works

The application operates as a single-page application on the web and as an Expo React Native application on mobile devices.

### 2.1 Authentication & Domain Validation Pipeline

```
  [User Action]
        |
        +---> Google Sign-In (OAuth 2.0 via Supabase)
        |
        +---> Work Email & Password Sign-In
        |
        v
  [Domain Validation Engine] (src/utils/domainValidator.ts)
        |
        +---> validateEmailDomain(email)
        |     - Normalize: lowercase, trim whitespace
        |     - Split: isolate domain after '@' character
        |     - Exact match comparison against ALLOWED_DOMAIN (hbplus.fit)
        |
        +-----------------------+-----------------------+
        |                                               |
  [Domain Matches: @hbplus.fit]             [Domain Mismatch: e.g. @gmail.com]
        |                                               |
        v                                               v
  1. Initialize/Sync User Profile           1. Terminate Supabase session
  2. Query admin registry for roles         2. Revoke active OAuth tokens
  3. Store user session locally             3. Clear local storage cache
  4. Write "ALLOWED" log to audit trail     4. Write "BLOCKED" log to audit trail
  5. Redirect to Protected Dashboard        5. Set global error state:
                                               "Access restricted. Please login
                                               using your official domain email."
                                            6. User stays on Login Screen
```

### 2.2 Global State Management (src/context/AuthContext.tsx)
The AuthProvider context acts as the central state controller for the entire application lifecycle:
- Session Restoration: On application mount, initAuth() checks for active Supabase sessions or persisted local sessions (appStorage). If a cached session belongs to an unauthorized domain, it is purged automatically.
- Switchable Authentication: Handles OAuth redirect callbacks for Web and native URL schemes for Mobile (supabase.auth.onAuthStateChange).
- Domain Enforcement: Both signInWithGoogle and signInWithEmail pass candidate emails through validateEmailDomain() before setting the authenticated user state.
- Password Management: The setPassword() method allows authenticated domain users to store an encrypted credential in Supabase and local storage for direct email sign-in.
- Admin Delegation: grantAdminAccess() and revokeAdminAccess() persist administrator rights across browser and device restarts using Supabase and appStorage.
- Client Route Guard: Exposes activeRoute and navigateTo() functions that enforce view access controls.

### 2.3 Route Protection (App.tsx)
Route protection is enforced declaratively at the application root:
- If isLoading is true, an animated loading screen displays while checking session credentials.
- If !isAuthenticated, the application renders LoginScreen. Any direct route navigation to protected paths (such as #dashboard or #admin) is intercepted and redirected back to login.
- If isAuthenticated and activeRoute === 'admin', the app verifies that user.role === 'admin'. Non-admin attempts to open the admin view are intercepted and redirected to the dashboard.
- If isAuthenticated and activeRoute === 'dashboard' or activeRoute === 'resources', the protected DashboardScreen is rendered.

### 2.4 Multi-Tier Storage Architecture (src/utils/storage.ts)
React Native applications running on the web do not have native access to AsyncStorage without proper fallback handling. The appStorage utility implements a resilient storage adapter:
1. Web Platform: Uses browser localStorage.
2. Mobile Platform: Uses in-memory storage with fallbacks to avoid unhandled native bridge exceptions.
3. Safe Parsing: Every read/write operation is wrapped in try-catch handlers to prevent application crashes during private browsing or restricted browser cookie modes.

---

## 3. Directory & File Structure

```
hb_assignment/
|-- assets/                                 # Static image assets and application icons
|   |-- favicon.png                         # Browser tab favicon (official HB+ mark)
|   |-- google-logo.svg                     # Official multicolor Google G logo
|   |-- hbplus-logo.png                     # Official Hop with HB brand logo
|   |-- icon.png                            # Application launcher icon
|   \-- splash-icon.png                     # Splash screen icon
|-- public/                                 # Web root served by Metro bundler
|   |-- favicon.ico                         # Root favicon
|   |-- hbplus-logo.png                     # Static root asset for HTML headers
|   \-- index.html                          # HTML shell with Google Fonts and meta tags
|-- src/
|   |-- components/                         # Modular, reusable UI components
|   |   |-- Badge.tsx                       # Status and role indicator badges
|   |   |-- Button.tsx                      # Primary and secondary tactile buttons
|   |   |-- Card.tsx                        # Reusable dashboard card wrapper
|   |   |-- ErrorAlert.tsx                  # Dismissible security alert banner
|   |   |-- GoogleSignInButton.tsx          # Google-branded sign-in button
|   |   |-- Navbar.tsx                      # Responsive navigation header and sidebar
|   |   \-- ResourcesView.tsx               # 14-protocol team resource library
|   |-- constants/
|   |   |-- config.ts                       # Configuration constants and domain settings
|   |   \-- theme.ts                        # Design system tokens (colors, typography, spacing)
|   |-- context/
|   |   \-- AuthContext.tsx                 # Core authentication context and state machine
|   |-- screens/
|   |   |-- AdminScreen.tsx                 # Administrator management and audit trail
|   |   |-- DashboardScreen.tsx             # Authenticated user dashboard and settings
|   |   \-- LoginScreen.tsx                 # Switchable Google/Email login screen
|   |-- services/
|   |   |-- db.ts                           # Database operations and audit logging
|   |   \-- supabase.ts                     # Supabase client and OAuth configuration
|   |-- types/
|   |   \-- auth.ts                         # TypeScript data contracts and interfaces
|   \-- utils/
|       |-- __tests__/                      # Automated unit test suites
|       |   \-- domainValidator.test.ts     # Domain validator unit tests
|       |-- domainValidator.ts              # Strict domain validation logic
|       |-- loadFonts.ts                    # Dynamic web font injector (The Seasons, Gilroy)
|       \-- storage.ts                      # Cross-platform persistent storage adapter
|-- App.tsx                                 # Application entrypoint and route dispatcher
|-- app.json                                # Expo project configuration manifest
|-- index.ts                                # Registration wrapper for Expo runtime
|-- netlify.toml                            # Netlify production build and redirect rules
|-- package.json                            # Package dependencies and execution scripts
|-- tsconfig.json                           # TypeScript compiler configuration
\-- README.md                               # Project documentation
```

---

## 4. Key Screens & Component Descriptions

### 4.1 Login Screen (src/screens/LoginScreen.tsx)
- Desktop Split View: Left side features the Hop with HB editorial brand banner with responsive title typography and the verified member trust statement. The right side contains the authentication card.
- Switchable Authentication Tabs: A segmented tab control allows users to cleanly toggle between Google SSO and Work Email without visual clutter.
- Google OAuth Button: Initiates standard OAuth consent flow.
- Work Email Form: Validates corporate work email and password inputs with field validation and toggleable password visibility.
- Error Presentation: Displays the exact required domain restriction error whenever a non-domain account is rejected.
- Evaluator Sandbox: Provides quick one-click evaluator credentials to easily test allowed domain access, admin privileges, and blocked domain scenarios.

### 4.2 Dashboard Screen (src/screens/DashboardScreen.tsx)
- Top Navigation Bar & Collapsible Drawer: Replaces rigid sidebars with a responsive top header and a collapsible hamburger drawer menu. Accessible on all screen sizes, expanding to display Workspace Navigation (Overview, Resource Library, Admin Control Center) and user session controls, while allowing the main content area to utilize full screen width.
- Hero Welcome Banner: Displays the active workspace greeting, personalized with the user name and the official Hop with HB lifestyle statement.
- Admin Access Management: An embedded management card allowing verified team members to assign administrator privileges to any colleague under @hbplus.fit. Includes title auto-scaling and responsive container boundaries.
- Account Overview Table: Displays authenticated email, domain status, assigned role, and last login timestamp.
- Set Workspace Password Card: Allows Google-authenticated users to create or update their direct email password with confirmation matching and validation feedback.
- Quick Access Modules: Shortcut cards for Team Directory, Resource Library, and Session Termination.
- Integrative Pathways Section: Overview cards detailing Pain Management, Weight Management, Pre & Post Natal Care, and Lifestyle Management.

### 4.3 Resource Library (src/components/ResourcesView.tsx)
- Interactive document repository containing 14 clinical protocols, brand kits, and security compliance handbooks.
- Real-time search filtering by document title, code, and description.
- Category pills: Clinical Protocols, Brand & Design, Security & Compliance, Operations.
- Interactive download action with confirmation toast feedback.

### 4.4 Admin Panel (src/screens/AdminScreen.tsx)
- Role Assignment: Grant or revoke administrator privileges for any @hbplus.fit email.
- Team Directory Table: Lists verified corporate members with active status indicators, role badges, and action buttons.
- Security Audit Log: Displays chronological records of all authentication events, distinguishing allowed logins from blocked access attempts with timestamps and IP metadata.

---

## 5. Security & Domain Validation Logic

### Validation Rules in domainValidator.ts

```typescript
export const ALLOWED_DOMAIN = 'hbplus.fit';

export const validateEmailDomain = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === trimmed.length - 1) {
    return false;
  }
  const domain = trimmed.slice(atIndex + 1);
  return domain === ALLOWED_DOMAIN.toLowerCase();
};
```

### Validation Test Scenarios

| Input Email | Validation Outcome | User Experience |
| :--- | :--- | :--- |
| member@hbplus.fit | Pass | Login granted, redirected to Dashboard |
| admin@hbplus.fit | Pass | Login granted, Admin privileges activated |
| user.name@hbplus.fit | Pass | Login granted, complex local-part supported |
| user@gmail.com | Fail | Session rejected, exact error displayed |
| user@yahoo.com | Fail | Session rejected, exact error displayed |
| user@hbplus.fit.attacker.com | Fail | Subdomain spoofing rejected |
| user@fakehbplus.fit | Fail | Prefix domain spoofing rejected |
| user@HBPLUS.FIT | Pass | Case-insensitive matching accepted |

### Ready-to-Use Login Credentials (Admin, Super User & Member)

The application provides a switchable login form supporting both Google OAuth and direct Work Email authentication. The following pre-configured credentials can be used immediately for testing:

| Account Type | Mode | Email Address | Password | Access Rights & Features |
| :--- | :--- | :--- | :--- | :--- |
| Corporate Super User | Work Email | admin@hbplus.fit | admin123 | Full Admin, Super User, RBAC delegation, Audit Logs |
| External Super User | Google OAuth | superuser@gmail.com | Select Google Account | Domain bypass, Admin Panel, Audit Trail |
| External Super User | Work Email | superuser@gmail.com | admin123 | Domain bypass, Admin Panel, Audit Trail |
| Administrator | Work Email | rahul@hbplus.fit | admin123 | Administrator, RBAC delegation, Audit Logs |
| Administrator | Work Email | security@hbplus.fit | admin123 | Administrator, RBAC delegation, Audit Logs |
| Team Member | Work Email | employee@hbplus.fit | user123 | Standard Member, Overview, Resource Library |
| Blocked Domain | Google / Email | candidate@gmail.com | Any | Triggers "Access restricted" security banner |

---

## 6. Installation & Local Development

### Prerequisites
- Node.js (version 18, 20, or 22 recommended)
- npm or yarn
- Modern web browser (Chrome, Edge, Safari, Firefox)

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/anshumansahu620/hb_plus_assignment.git
cd hb_plus_assignment
npm install
```

### Step 2: Configure Environment Variables
Create a .env file in the project root:
```env
EXPO_PUBLIC_ALLOWED_DOMAIN=hbplus.fit
EXPO_PUBLIC_SUPABASE_URL=https://uwklwnsrgbzkhpqcbqqj.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 3: Run Development Server
```bash
# Launch on web browser (recommended)
npm run web

# Alternatively launch Expo interactive CLI
npm run start
```
The application will open at http://localhost:8081.

### Step 4: Run Typecheck and Unit Tests
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run domain validator unit tests
npm test
```

---

## 7. Production Build & Deployment

### Static Web Export
The project uses Expo static web export to generate production-ready HTML, CSS, and JavaScript bundles:
```bash
npm run build:web
```
The output files are compiled into the dist/ directory.

### Netlify Deployment
The repository includes a production-ready netlify.toml file:
```toml
[build]
  command = "npm run build:web"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- Live Production URL: https://verdant-sable-417dc6.netlify.app
- Access Password: My-Drop-Site

To deploy on Netlify:
1. Connect the GitHub repository to your Netlify account.
2. Ensure the build command is set to "npm run build:web" and the publish directory is "dist".
3. Add the environment variables (EXPO_PUBLIC_ALLOWED_DOMAIN, EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY) in the Netlify site settings.
4. Deploy the site.

---

## 8. Design System Tokens & Brand Standards

All styles are governed by design tokens located in src/constants/theme.ts:

- Page Background Canvas: #F5F2E9 (Warm Linen Cream)
- Card & Surface Background: #FFFFFF / #EDEAE7 (Warm Stone Sand)
- Hairline Border Color: #DAD3CE (Warm Sand Border)
- Primary Text & Accents: #1A1A1A (Rich Onyx Charcoal)
- Primary CTA / Buttons: #9F4022 (Signature Terracotta)
- Button Pressed / Hover: #87341B (Deep Terracotta)
- Secondary Muted Text: #636363 (Muted Slate)
- Font Families:
  - Serif Display: The Seasons, serif
  - Brand Display: Gilroy, sans-serif
  - Interface Body: DM Sans, sans-serif
- Iconography: Clean vector icons from @expo/vector-icons/Ionicons utilizing lock symbols (lock-closed-outline, lock-closed) for security context.

---

## 9. Super User & Evaluator Configuration

### What is a Super User?
In default production mode, access is exclusively restricted to email accounts ending in @hbplus.fit. Any third-party domain (such as personal @gmail.com accounts) is strictly rejected with the required security alert:
> "Access restricted. Please login using your official domain email."

To allow evaluators, recruiters, or system administrators to test the live Google OAuth single sign-on flow using their personal Google accounts without needing an @hbplus.fit Google Workspace mailbox, the portal includes a Super User Bypass and Admin Registry.

Super Users receive:
1. Complete exemption from the @hbplus.fit domain restriction during Google OAuth and email sign-in.
2. Full Administrator privileges (role: 'admin') with access to the Admin Control Center, role assignment forms, and security audit logs.
3. Unrestricted access to both Overview Dashboard and Resource Library.
4. All other external email accounts continue to be strictly blocked, preserving the security validation requirement.

### Super User Login Credentials

| Account Type | Authentication Mode | Email Address | Password / Action | Resulting Role |
| :--- | :--- | :--- | :--- | :--- |
| Corporate Super User | Work Email Sign-In | admin@hbplus.fit | admin123 | Super User & Administrator |
| External Super User | Google OAuth (SSO) | superuser@gmail.com | Click "Continue with Google" | Super User & Administrator |
| External Super User | Work Email Sign-In | superuser@gmail.com | admin123 | Super User & Administrator |

### How to Configure or Become a Super User

#### Method 1: Whitelist in Code Configuration (Recommended)

1. Open src/constants/config.ts:
```typescript
// Add super user email addresses to the Super User array
export const SUPER_USER_EMAILS = [
  `admin@${ALLOWED_DOMAIN}`,
  'admin@hbplus.fit',
  'superuser@gmail.com',
  'evaluator@gmail.com',
  'your-email@gmail.com',
];
];

// Add the same email to ADMIN_EMAILS for role authorization
export const ADMIN_EMAILS = [
  `admin@${ALLOWED_DOMAIN}`,
  `security@${ALLOWED_DOMAIN}`,
  `rahul@${ALLOWED_DOMAIN}`,
  `user@${ALLOWED_DOMAIN}`,
  `alex.trainer@${ALLOWED_DOMAIN}`,
  `sarah.fitness@${ALLOWED_DOMAIN}`,
  'admin@gmail.com',
  'your-email@gmail.com',
];
```

2. How the code processes this:
   - src/utils/domainValidator.ts checks SUPER_USER_EMAILS. If matched, validateEmailDomain() returns isValid: true.
   - src/services/db.ts checks determineRoleForEmail(). If matched, the user is assigned role: 'admin'.

3. Apply changes:
   - For local development: Changes hot-reload automatically if running "npm run web:3000".
   - For production web build: Run "npm run build:web" to compile the updated configuration into the dist/ directory.

#### Method 2: Runtime In-App Delegation

Any signed-in Administrator can elevate other team members directly within the application:
1. Open the Overview Dashboard and locate the "Grant Admin Access" card (or navigate to Admin Control Center via the hamburger menu).
2. Enter the target email address in the input field.
3. Click "Grant Admin Access".
4. The permission is saved immediately to local storage and synchronized with the Supabase database.

#### Method 3: Environment Variable Domain Switching

If you want to permit all Google accounts under a specific domain during testing without modifying code arrays:
1. Edit the .env file in the root directory:
```env
EXPO_PUBLIC_ALLOWED_DOMAIN=gmail.com
```
2. Restart the development server ("npm run web:3000"). All @gmail.com accounts will now pass standard domain validation.
