import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";

/** Sign-in and registration: a quiet frame with a way back to the store. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-grid flex min-h-screen flex-col bg-surface">
      <PageContainer className="flex h-16 items-center">
        <Link href="/" aria-label="Virtualsphere Technologies — home">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
          <img src="/logo.png" alt="" width={1024} height={216} className="h-8 w-auto" />
        </Link>
      </PageContainer>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-card border border-border bg-card p-8 shadow-card sm:p-10">{children}</div>
      </main>
    </div>
  );
}
