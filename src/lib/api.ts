const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchProducts() {
  try {
    // Note: cache: 'no-store' ensures it fetches fresh data every time for development
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/slug/${slug}`, { 
      cache: 'no-store' // Disable aggressive cache during development
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch product: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
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

export async function createOrder(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to create order');
  return await res.json();
}

export async function fetchMyOrders(token: string) {
  const res = await fetch(`${API_URL}/orders/myorders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return await res.json();
}

export async function fetchAllOrders(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch all orders');
  return await res.json();
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
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to upload image');
  }

  return await res.text(); // Returns the path string
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
  return await res.json();
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
