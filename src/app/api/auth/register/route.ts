import { register } from "@/lib/api";
import {
  authErrorResponse,
  forbiddenResponse,
  readCredentials,
  sessionResponse,
} from "@/lib/auth-server";
import { isSameOrigin } from "@/lib/same-origin";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenResponse();

  const details = await readCredentials(request, ["name", "email", "password"] as const);
  if (!details) {
    return Response.json({ message: "Name, email and password are required" }, { status: 400 });
  }

  try {
    return await sessionResponse(await register(details.name, details.email, details.password));
  } catch (error) {
    return authErrorResponse(error, "Registration failed");
  }
}
