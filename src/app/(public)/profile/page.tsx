"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { fetchMyOrders } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";
import { ActionLink, SectionHeader } from "@/components/shared/section-header";
import { OrderCard, type CustomerOrder } from "@/components/shared/order-card";

export default function ProfilePage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
      return;
    }

    async function loadOrders() {
      try {
        setOrders(await fetchMyOrders());
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) loadOrders();
  }, [user, authLoading, router]);

  const busy = loading || authLoading;

  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <SectionHeader
        as="h1"
        eyebrow="Account"
        title="My profile"
        description="Your account details and recent orders."
      />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="rounded-card border border-border bg-card p-6 lg:sticky lg:top-24">
            {busy ? (
              <div className="space-y-3">
                <Skeleton className="size-12 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              <>
                <div
                  aria-hidden
                  className="flex size-12 items-center justify-center rounded-full bg-primary text-h3 text-primary-foreground"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <p className="mt-4 text-h3">{user?.name}</p>
                <p className="mt-1 text-small break-all text-muted-foreground">{user?.email}</p>
              </>
            )}

            <dl className="mt-6 border-t border-border">
              <div className="flex justify-between border-b border-border py-3 text-small">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium capitalize">{busy ? "—" : user?.role}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-3 text-small">
                <dt className="text-muted-foreground">Orders</dt>
                <dd className="font-medium tabular-nums">{busy ? "—" : orders.length}</dd>
              </div>
            </dl>

            <Button variant="outline" className="mt-6 w-full" onClick={logout} startIcon={<LogOut />}>
              Sign out
            </Button>
          </div>
        </aside>

        <section aria-labelledby="recent-orders" className="lg:col-span-8">
          <div className="flex items-end justify-between gap-4">
            <h2 id="recent-orders" className="text-h3">
              Recent orders
            </h2>
            {orders.length > 0 && <ActionLink href="/orders">All orders</ActionLink>}
          </div>

          <div className="mt-6 space-y-6">
            {busy ? (
              <Skeleton className="h-56 rounded-card" />
            ) : orders.length === 0 ? (
              <div className="bg-grid flex flex-col items-start rounded-card border border-border bg-surface px-6 py-12 sm:px-10">
                <p className="text-h3">No orders yet</p>
                <p className="mt-2 text-small text-muted-foreground">You haven&apos;t placed any orders.</p>
                <ButtonLink href="/products" className="mt-6">
                  Browse products
                </ButtonLink>
              </div>
            ) : (
              orders.slice(0, 3).map((order) => <OrderCard key={order._id} order={order} />)
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
