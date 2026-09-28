"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyOrders } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { OrderCard, type CustomerOrder } from "@/components/shared/order-card";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders");
      return;
    }

    async function loadOrders() {
      try {
        setOrders(await fetchMyOrders());
      } catch (error) {
        console.error("Failed to load orders", error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }

    if (user) loadOrders();
  }, [user, authLoading, router]);

  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <SectionHeader as="h1" eyebrow="Account" title="Orders" />

      <div className="mt-10 space-y-6">
        {loading || authLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-card" />)
        ) : failed ? (
          <p className="text-small text-danger">We couldn&apos;t load your orders. Please refresh to try again.</p>
        ) : orders.length === 0 ? (
          <div className="bg-grid flex flex-col items-start rounded-card border border-border bg-surface px-6 py-14 sm:px-10">
            <p className="text-h3">No orders yet</p>
            <p className="mt-2 text-small text-muted-foreground">When you place an order, it will appear here.</p>
            <ButtonLink href="/products" className="mt-6">
              Browse products
            </ButtonLink>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </PageContainer>
  );
}
