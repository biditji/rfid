import { login } from "@/lib/api";
import {
  authErrorResponse,
  forbiddenResponse,
  readCredentials,
  sessionResponse,
} from "@/lib/auth-server";
import { isSameOrigin } from "@/lib/same-origin";

export async function POST(request: Request) {
  // Without this, another site could sign a visitor into an account the
  // attacker controls (login CSRF).
  if (!isSameOrigin(request)) return forbiddenResponse();

  const credentials = await readCredentials(request, ["email", "password"] as const);
  if (!credentials) {
    return Response.json({ message: "Email and password are required" }, { status: 400 });
  }

  try {
    return await sessionResponse(await login(credentials.email, credentials.password));
  } catch (error) {
    return authErrorResponse(error, "sign-in");
  }
}
