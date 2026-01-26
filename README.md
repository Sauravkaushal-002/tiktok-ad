# TikTok Ad Creation Platform

A Next.js web application for creating TikTok ads with OAuth authentication integration.

## How to Run the Project

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- A TikTok Developer account

### Installation Steps

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd tik-tok-ad
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   Or if using npm:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   TIKTOK_CLIENT_ID=your_client_key_here
   TIKTOK_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_BASE_URL= 
   NODE_ENV=development
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```
   Or:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` to see the application.


## OAuth Setup Steps

To set up TikTok OAuth authentication:

1. **Register Your App on TikTok Developer Portal**:
   - Go to [https://developers.tiktok.com](https://developers.tiktok.com)
   - Sign in or create a developer account
   - Navigate to "Manage Apps" and create a new app
   - Select "Login Kit" as the product

2. **Get Your Credentials**:
   - After creating the app, you'll receive:
     - `Client Key` (this is your `TIKTOK_CLIENT_ID`)
     - `Client Secret` (this is your `TIKTOK_CLIENT_SECRET`)

3. **Configure Redirect URI**:
   - In your TikTok app settings, add your redirect URI
   - For local development: `http://localhost:3000/api/auth/tiktok/callback`
   - For production: `https://yourdomain.com/api/auth/tiktok/callback`
   - **Important**: The redirect URI must:
     - Start with `https://` (or `http://` for localhost)
     - Be an absolute URL
     - Not include query parameters or fragments
     - Match exactly what you use in your code

4. **Set Environment Variables**:
   - Add your `TIKTOK_CLIENT_ID` and `TIKTOK_CLIENT_SECRET` to `.env.local`
   - Make sure these match the credentials from your TikTok Developer Portal

5. **Test the OAuth Flow**:
   - Click "Connect with TikTok" button in the app
   - You'll be redirected to TikTok's authorization page
   - After authorizing, you'll be redirected back to your app
   - The connection status should update automatically

## Assumptions and Shortcuts

### Key Assumptions

**Ad Creation API Limitation**: 
For using the TikTok Ad Creation API or any other marketing APIs, you need a TikTok Business account with company email and business verification details. Since these business credentials are not available, the ad creation functionality has been implemented as a **dummy/mock implementation**. The form collects ad creation data and simulates the submission process, but it does not actually create ads on TikTok's platform.

### Other Assumptions

1. **OAuth Scope**: The app uses `user.info.basic` scope, which provides basic user information. This is sufficient for authentication but may not provide access to all TikTok features.

2. **Local Development**: The app is configured to work with localhost for development. For production, you'll need to update the redirect URI in both the code and TikTok Developer Portal.

3. **Cookie Storage**: Tokens are stored in HTTP-only cookies for security. The app assumes cookies are supported and enabled in the browser.

4. **State Management**: OAuth state is stored in cookies with a 10-minute expiration to prevent CSRF attacks.

5. **Error Handling**: The app includes basic error handling for OAuth flows, but some edge cases may not be fully covered.

### Shortcuts Taken


2. **Simplified Error Messages**: Error messages are user-friendly but may not always provide detailed technical information for debugging.

3. **Mock Ad Creation**: As mentioned above, ad creation is simulated rather than using the actual TikTok Marketing API.




