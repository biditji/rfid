import { NextResponse } from "next/server";
import { forbiddenResponse } from "@/lib/auth-server";
import { isSameOrigin } from "@/lib/same-origin";
import { SESSION_COOKIE } from "@/lib/session-token";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenResponse();

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
