"use client";

import { useEffect, useState } from "react";
import { fetchMyOrders } from "@/lib/api";
import { formatCurrency, getStockStatus, getServerUrl } from "@/lib/utils";
import { Package, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    async function loadOrders() {
      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
        <Package className="mx-auto h-24 w-24 text-zinc-300" />
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900">No orders yet</h2>
        <p className="mt-4 text-zinc-500">When you place an order, it will appear here.</p>
        <Link href="/products" className="mt-8 inline-block">
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-8 py-6 text-lg font-medium">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen pb-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Past Orders</h1>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Order Placed</p>
                    <p className="text-sm font-medium text-zinc-900 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total</p>
                    <p className="text-sm font-medium text-zinc-900 mt-1">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Order #</p>
                    <p className="text-sm font-medium text-zinc-900 mt-1">
                      {order._id.substring(order._id.length - 8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === 'Processing' && <Clock className="h-5 w-5 text-amber-500" />}
                  {order.status === 'Shipped' && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
                  {order.status === 'Delivered' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  <span className={`text-sm font-medium ${
                    order.status === 'Processing' ? 'text-amber-600' :
                    order.status === 'Shipped' ? 'text-blue-600' :
                    order.status === 'Delivered' ? 'text-emerald-600' : 'text-zinc-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-zinc-200">
                {order.items.map((item: any) => {
                  const product = item.product;
                  // Handle case where product was deleted from DB
                  if (!product) {
                    return (
                       <div key={item._id} className="p-6 flex items-center justify-between">
                         <p className="text-sm text-zinc-500">Product no longer available</p>
                       </div>
                    );
                  }
                  
                  const imageUrl = product.images?.[0] ? getServerUrl(product.images[0]) : "/placeholder.png";

                  return (
                    <div key={item._id} className="p-6 sm:flex sm:items-start sm:justify-between">
                      <div className="flex gap-6">
                        <div className="shrink-0">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-20 w-20 rounded-lg object-cover border border-zinc-200"
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-zinc-900">
                            <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
                              {product.name}
                            </Link>
                          </h4>
                          <p className="mt-1 text-sm text-zinc-500">{product.category?.name}</p>
                          <p className="mt-1 text-sm font-medium text-zinc-900">
                            {formatCurrency(item.priceAtPurchase)} <span className="text-zinc-500 font-normal ml-2">Qty: {item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex gap-4">
                        <Link href={`/products/${product.slug}`}>
                          <Button variant="outline" className="w-full sm:w-auto">View Product</Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
