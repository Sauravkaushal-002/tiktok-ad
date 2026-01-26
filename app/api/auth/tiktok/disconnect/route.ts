import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear all TikTok-related cookies
  cookieStore.delete("tiktok_access_token");
  cookieStore.delete("tiktok_advertiser_id");
  cookieStore.delete("tiktok_refresh_token");
  cookieStore.delete("tiktok_oauth_state");

  return NextResponse.json({ success: true });
}
