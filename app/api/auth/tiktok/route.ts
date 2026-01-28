import { NextRequest, NextResponse } from "next/server";
import { getTikTokAuthUrl, parseApiError } from "@/lib/tiktok";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUri = `${baseUrl}/api/auth/tiktok/callback`;
  
    // Generate a random state for CSRF protection
    const state = crypto.randomUUID();
    
    const authUrl = getTikTokAuthUrl(redirectUri, state);
    
    // Create response and set cookie on it before redirecting
    const response = NextResponse.redirect(authUrl);
    
    // Store state in a cookie for validation
    response.cookies.set("tiktok_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
    
    return response;
  } catch (error) {
    const errorMessage = parseApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
