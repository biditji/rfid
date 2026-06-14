"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if not logged in
        router.push("/login?redirect=" + encodeURIComponent(pathname));
      } else if (user.role !== "admin") {
        // Redirect to home if logged in but not admin
        router.push("/");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
          <p className="text-sm font-medium text-zinc-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
