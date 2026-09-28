"use client";

import { useEffect, useState } from "react";
import { fetchMyOrders } from "@/lib/api";
import { formatCurrency, getServerUrl } from "@/lib/utils";
import { Package, CheckCircle2, Clock, User as UserIcon, Mail, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading, logout } = useAuth();
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

  return (
    <div className="bg-zinc-50 min-h-screen pb-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Profile</h1>
          <p className="mt-2 text-zinc-500">Manage your account and view your order history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sticky top-24">
              <div className="flex flex-col items-center text-center pb-6 border-b border-zinc-100">
                <div className="h-20 w-20 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-3xl font-bold mb-4">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-zinc-900">{user?.name}</h2>
                <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1 justify-center">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </p>
              </div>
              
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Role</span>
                  <span className="text-sm font-medium text-zinc-900 capitalize">{user?.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Total Orders</span>
                  <span className="text-sm font-medium text-zinc-900">{orders.length}</span>
                </div>
              </div>

              <Button 
                onClick={logout}
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Recent Orders</h2>
              {orders.length > 0 && (
                <Link href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Continue Shopping
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-12 text-center">
                <Package className="mx-auto h-16 w-16 text-zinc-300" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">No recent orders</h3>
                <p className="mt-2 text-sm text-zinc-500">You haven't placed any orders yet.</p>
                <Link href="/products" className="mt-6 inline-block">
                  <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Order Placed</p>
                          <p className="text-sm font-medium text-zinc-900 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Total</p>
                          <p className="text-sm font-medium text-zinc-900 mt-0.5">
                            {formatCurrency(order.totalPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Order #</p>
                          <p className="text-sm font-medium text-zinc-900 mt-0.5 font-mono">
                            {order._id.substring(order._id.length - 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === 'Processing' && <Clock className="h-4 w-4 text-amber-500" />}
                        {order.status === 'Shipped' && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                        {order.status === 'Delivered' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {order.status === 'Cancelled' && <Clock className="h-4 w-4 text-red-500" />}
                        <span className={`text-sm font-medium ${
                          order.status === 'Processing' ? 'text-amber-700' :
                          order.status === 'Shipped' ? 'text-blue-700' :
                          order.status === 'Delivered' ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-zinc-100">
                      {order.items.map((item: any) => {
                        const product = item.product;
                        if (!product) {
                          return (
                            <div key={item._id} className="p-6">
                              <p className="text-sm text-zinc-500">Product no longer available</p>
                            </div>
                          );
                        }
                        
                        const imageUrl = product.images?.[0] ? getServerUrl(product.images[0]) : "/placeholder.png";

                        return (
                          <div key={item._id} className="p-6 sm:flex sm:items-start sm:justify-between group">
                            <div className="flex gap-6">
                              <div className="shrink-0">
                                <img
                                  src={imageUrl}
                                  alt={product.name}
                                  className="h-20 w-20 rounded-xl object-cover border border-zinc-200 bg-white"
                                />
                              </div>
                              <div>
                                <h4 className="text-base font-semibold text-zinc-900">
                                  <Link href={`/products/${product.slug}`} className="hover:text-blue-600 transition-colors">
                                    {product.name}
                                  </Link>
                                </h4>
                                <p className="mt-1 text-sm text-zinc-500 line-clamp-1">{product.description || product.category?.name}</p>
                                <div className="mt-2 flex items-center gap-4">
                                  <p className="text-sm font-medium text-zinc-900">
                                    {formatCurrency(item.priceAtPurchase)}
                                  </p>
                                  <span className="text-sm text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">Qty: {item.quantity}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 flex gap-4">
                              <Link href={`/products/${product.slug}`}>
                                <Button variant="secondary" className="w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  Buy Again
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
