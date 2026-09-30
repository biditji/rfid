"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { redirectFromLocation } from "@/lib/redirect";
import { useSlowHint } from "@/lib/use-slow-hint";
import { warmBackend } from "@/lib/warm-backend";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const slow = useSlowHint(isLoading);

  // Start the backend waking up while the visitor types their password.
  useEffect(warmBackend, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn(email, password);
      // Back to the page that sent them here (e.g. /admin), if any.
      router.push(redirectFromLocation());
    } catch (err) {
      // An ApiError carries the backend's own message ("Invalid email or
      // password"); anything else is a network failure.
      setError(err instanceof ApiError ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-h2">Sign in</h1>
      <p className="mt-2 text-small text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
          Create an account
        </Link>
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className="rounded-control bg-danger/10 px-4 py-3 text-small text-danger">
            {error}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="email-address">Email address</Label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isLoading} loadingText="Signing in…">
          Sign in
        </Button>
        <p aria-live="polite" className="min-h-5 text-small text-muted-foreground">
          {slow && "Still signing you in — the server is waking up, which can take up to a minute."}
        </p>
      </form>
    </>
  );
}
