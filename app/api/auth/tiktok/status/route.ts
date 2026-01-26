import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tiktok_access_token")?.value;
  const advertiserId = cookieStore.get("tiktok_advertiser_id")?.value;

  return NextResponse.json({
    connected: !!accessToken,
    advertiserId: advertiserId || null,
  });
}
