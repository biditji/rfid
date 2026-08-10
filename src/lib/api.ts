const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchProducts() {
  try {
    // Note: cache: 'no-store' ensures it fetches fresh data every time for development
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    const data = await res.json();
    return data.products || data;
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

export async function fetchCategories(filters?: { name?: string; status?: string }) {
  try {
    const params = new URLSearchParams();
    if (filters?.name) params.set('name', filters.name);
    if (filters?.status !== undefined && filters?.status !== '') params.set('status', filters.status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_URL}/categories${query}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategoryById(id: string) {
  const res = await fetch(`${API_URL}/categories/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch category: ${res.status}`);
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
  const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch product: ${res.status}`);
  }
  return await res.json();
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
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to upload image');
  }

  return await res.text(); // Returns the path string
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
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to upload images');
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
