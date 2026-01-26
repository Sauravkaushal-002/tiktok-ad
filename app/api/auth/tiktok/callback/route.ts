import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, parseApiError } from "@/lib/tiktok";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Get the base URL for redirects
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Check for errors from TikTok
  if (error) {
    const errorMessage = encodeURIComponent(error);
    return NextResponse.redirect(`${baseUrl}?error=${errorMessage}`);
  }

  // Validate required parameters
  if (!code) {
    const errorMessage = encodeURIComponent("Authorization code is missing. Please try again.");
    return NextResponse.redirect(`${baseUrl}?error=${errorMessage}`);
  }

  // Validate state to prevent CSRF attacks
  const cookieStore = await cookies();
  const savedState = cookieStore.get("tiktok_oauth_state")?.value;
  console.log(savedState,'savedState');
  console.log(state,'state');
  if (!state || state !== savedState) {
    const errorMessage = encodeURIComponent("Invalid request. Please try connecting again.");
    return NextResponse.redirect(`${baseUrl}?error=${errorMessage}`);
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/tiktok/callback`;
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    const response = NextResponse.redirect(`${baseUrl}?connected=true`);
    
    response.cookies.set("tiktok_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in,
      path: "/",
    });

    if (tokens.open_id) {
      response.cookies.set("tiktok_open_id", tokens.open_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokens.expires_in,
        path: "/",
      });
    }

    if (tokens.advertiser_id) {
      response.cookies.set("tiktok_advertiser_id", tokens.advertiser_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokens.expires_in,
        path: "/",
      });
    }

    if (tokens.refresh_token) {
      response.cookies.set("tiktok_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    // Clear the OAuth state cookie
    response.cookies.delete("tiktok_oauth_state");

    return response;
  } catch (error) {
    const errorMessage = encodeURIComponent(parseApiError(error));
    return NextResponse.redirect(`${baseUrl}?error=${errorMessage}`);
  }
}
// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const code = searchParams.get('code');

//   if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

//   const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({
//       client_key: process.env.TIKTOK_CLIENT_ID!,
//       client_secret: process.env.TIKTOK_CLIENT_SECRET!,
//       code,
//       grant_type: 'authorization_code',
//       redirect_uri: 'https://reindeer-winning-teal.ngrok-free.app/api/auth/tiktok/callback',
//     }),
//   });

//   const data = await tokenResponse.json();
  
//   if (data.error) return NextResponse.json(data, { status: 400 });

//   // data contains access_token, open_id, and refresh_token
//   // Store these in a secure cookie or database here
//   return NextResponse.redirect(new URL('/dashboard', request.url));
// }