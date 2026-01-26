
const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";

export interface TikTokTokens {
  access_token: string;
  open_id: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
  advertiser_id?: string; 
}

export interface TikTokError {
  code: number;
  message: string;
}

export function getTikTokAuthUrl(redirectUri: string, state: string): string {
  const clientId = process.env.TIKTOK_CLIENT_ID;
  
  if (!clientId) {
    throw new Error("TikTok Client ID is not configured");
  }

  const params = new URLSearchParams({
    client_key: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: "user.info.basic",
    response_type: "code",
  });

  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<TikTokTokens> {
  const clientId = process.env.TIKTOK_CLIENT_ID;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("TikTok credentials are not configured");
  }

  const params = new URLSearchParams({
    client_key: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`TikTok API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || data.error || "Failed to exchange code for tokens");
  }

  return {
    access_token: data.access_token,
    open_id: data.open_id || "",
    expires_in: data.expires_in || 86400,
    refresh_token: data.refresh_token,
    token_type: data.token_type || "Bearer",
    advertiser_id: data.advertiser_id || undefined,
  };
}

export function parseApiError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose raw error messages - return user-friendly versions
    const message = error.message.toLowerCase();
    
    if (message.includes("network") || message.includes("fetch")) {
      return "Unable to connect to TikTok. Please check your internet connection and try again.";
    }
    
    if (message.includes("unauthorized") || message.includes("401")) {
      return "Your TikTok session has expired. Please reconnect your account.";
    }
    
    if (message.includes("forbidden") || message.includes("403")) {
      return "You don't have permission to perform this action. Please check your TikTok account permissions.";
    }
    
    if (message.includes("rate limit") || message.includes("429")) {
      return "Too many requests. Please wait a moment and try again.";
    }
    
    if (message.includes("invalid") && message.includes("token")) {
      return "Your authentication has expired. Please reconnect your TikTok account.";
    }

    // For any other errors, return a generic message
    return "Something went wrong. Please try again or contact support if the issue persists.";
  }
  
  return "An unexpected error occurred. Please try again.";
}
