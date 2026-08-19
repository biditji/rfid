const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://backend.indiarfidshop.com/api';

const isServer = typeof window === 'undefined';

/**
 * How long the server may reuse a cached response for a public read.
 * The backend's /products endpoint intermittently takes 20-30s to answer, so
 * without this every single visitor pays that cost. With it, one unlucky
 * request warms the cache and everyone else is served instantly.
 */
export const REVALIDATE = {
  products: 300,
  categories: 600,
} as const;

/** Abort a read that hangs, instead of blocking a render indefinitely. */
const READ_TIMEOUT_MS = 45_000;

type ReadOptions = {
  /** Seconds the Next.js server may serve this response from cache. */
  revalidate?: number;
  /** Cache tags, so an admin mutation can flush the public cache on demand. */
  tags?: string[];
  timeoutMs?: number;
  retries?: number;
};

/**
 * GET a public endpoint with a hard timeout and one retry.
 *
 * On the server the response is cached for `revalidate` seconds. In the browser
 * (the admin panel) it always goes to the network, so admins never see stale data.
 */
async function readJson<T>(
  path: string,
  { revalidate = 0, tags, timeoutMs = READ_TIMEOUT_MS, retries = 1 }: ReadOptions = {}
): Promise<T> {
  const init: RequestInit = isServer
    ? { next: { revalidate, ...(tags ? { tags } : {}) } }
    : { cache: 'no-store' };

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (res.status === 404) {
        const notFound = new Error(`Not found: ${path}`);
        (notFound as any).status = 404;
        throw notFound;
      }

      // Retry 5xx (backend restart / cold start), but not 4xx.
      if (!res.ok) {
        const err = new Error(`Request failed: ${path} -> ${res.status}`);
        (err as any).status = res.status;
        if (res.status < 500 || attempt === retries) throw err;
        lastError = err;
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }

      return (await res.json()) as T;
    } catch (error) {
      if ((error as any)?.status === 404) throw error;
      lastError = error;
      if (attempt === retries) break;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Request failed: ${path}`);
}


/**
 * Catalog fetch that reports failure instead of hiding it behind an empty array.
 * A caller that prerenders needs to tell "the shop has no products" apart from
 * "the backend didn't answer in time" — caching the latter as a static page
 * leaves the site showing "No products available" until the next revalidation.
 */
export async function fetchProductsResult(): Promise<{ products: any[]; ok: boolean }> {
  try {
    const data = await readJson<any>('/products', {
      revalidate: REVALIDATE.products,
      tags: ['products'],
      retries: 2,
    });
    const products = data?.products ?? data;
    return { products: Array.isArray(products) ? products : [], ok: true };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], ok: false };
  }
}

export async function fetchProducts() {
  return (await fetchProductsResult()).products;
}

export async function fetchProductBySlug(slug: string) {
  try {
    return await readJson<any>(`/products/slug/${encodeURIComponent(slug)}`, {
      revalidate: REVALIDATE.products,
      tags: ['products', `product:${slug}`],
    });
  } catch (error) {
    if ((error as any)?.status === 404) return null;
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/** Category fetch that reports failure — see `fetchProductsResult`. */
export async function fetchCategoriesResult(filters?: {
  name?: string;
  status?: string;
}): Promise<{ categories: any[]; ok: boolean }> {
  try {
    const params = new URLSearchParams();
    if (filters?.name) params.set('name', filters.name);
    if (filters?.status !== undefined && filters?.status !== '') params.set('status', filters.status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await readJson<any>(`/categories${query}`, {
      revalidate: REVALIDATE.categories,
      tags: ['categories'],
    });
    const categories = data?.categories ?? data;
    return { categories: Array.isArray(categories) ? categories : [], ok: true };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [], ok: false };
  }
}

export async function fetchCategories(filters?: { name?: string; status?: string }) {
  return (await fetchCategoriesResult(filters)).categories;
}

export async function fetchCategoryById(id: string) {
  try {
    return await readJson<any>(`/categories/${id}`);
  } catch (error) {
    if ((error as any)?.status === 404) return null;
    throw error;
  }
}

export async function createCategory(data: any, token: string) {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create category');
  }
  
  return await res.json();
}

export async function updateCategory(id: string, data: any, token: string) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update category');
  }
  
  return await res.json();
}

export async function deleteCategory(id: string, token: string) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete category');
  }
  
  return await res.json();
}

export async function deleteCategoriesBulk(ids: string[], token: string) {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids }),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete categories');
  }
  
  return await res.json();
}

export async function createProduct(data: any, token: string) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create product');
  }
  
  return await res.json();
}

export async function fetchProductById(id: string) {
  try {
    return await readJson<any>(`/products/${id}`);
  } catch (error) {
    if ((error as any)?.status === 404) return null;
    throw error;
  }
}

export async function updateProduct(id: string, data: any, token: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update product');
  }
  
  return await res.json();
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete product');
  }
  
  return await res.json();
}

export async function deleteProductsBulk(ids: string[], token: string) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids }),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete products');
  }
  
  return await res.json();
}

export async function fetchCart(token: string) {
  const res = await fetch(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return await res.json();
}

export async function addToCart(productId: string, quantity: number, token: string) {
  const res = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return await res.json();
}

export async function removeFromCart(productId: string, token: string) {
  const res = await fetch(`${API_URL}/cart/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error('Failed to remove from cart');
  return await res.json();
}

export async function updateCartQuantity(productId: string, quantity: number, token: string) {
  const res = await fetch(`${API_URL}/cart/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to update cart quantity');
  return await res.json();
}

export async function createOrder(
  shippingAddress: string,
  phoneNumber: string,
  token?: string
) {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shippingAddress, phoneNumber }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create order');
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function verifyRazorpayPayment(data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }, token: string) {
  const res = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Payment verification failed');
  return await res.json();
}

export async function fetchMyOrders(token: string) {
  const res = await fetch(`${API_URL}/orders/myorders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.orders || data;
}

export async function fetchAllOrders(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch all orders');
  const data = await res.json();
  return data.orders || data;
}

export async function uploadImage(file: File, token: string) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    try {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to upload image');
    } catch {
      throw new Error('Failed to upload image');
    }
  }

  const path = await res.json(); // Returns the path string
  return path as string;
}

export async function uploadImages(files: File[], token: string) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  const res = await fetch(`${API_URL}/upload/multiple`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    try {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to upload images');
    } catch {
      throw new Error('Failed to upload images');
    }
  }

  return await res.json(); // Returns array of path strings
}

export async function fetchDashboardStats(token: string) {
  const res = await fetch(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return await res.json();
}

export async function fetchCustomers(token: string) {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch customers');
  const data = await res.json();
  return data.users || data;
}

export async function updateOrderStatus(orderId: string, status: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
}

export async function updateUserRole(userId: string, role: string, token: string) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update user role');
  return await res.json();
}
