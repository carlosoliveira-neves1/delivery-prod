import { categories, products, mockStore, orders } from "@/data/mockData";

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchStore() {
  await wait();
  return mockStore;
}

export async function fetchCategories() {
  await wait();
  return categories;
}

export async function fetchProducts() {
  await wait();
  return products;
}

export async function fetchOrders() {
  await wait();
  return orders;
}

export async function submitOrder(order) {
  await wait(800);
  const newOrder = {
    id: `ORD-${Date.now()}`,
    status: "pending",
    created_at: new Date().toISOString(),
    ...order,
  };
  orders.unshift(newOrder);
  return newOrder;
}

export async function updateProductAvailability(productId, isAvailable) {
  await wait(300);
  const product = products.find((item) => item.id === productId);
  if (!product) throw new Error("Produto não encontrado");
  product.is_available = isAvailable;
  return { ...product };
}

export async function updateOrderStatus(orderId, status) {
  await wait(300);
  const order = orders.find((item) => item.id === orderId);
  if (!order) throw new Error("Pedido não encontrado");
  order.status = status;
  return { ...order };
}

export async function updateStoreSettings(partialSettings) {
  await wait(300);
  Object.assign(storeConfig, partialSettings);
  return { ...storeConfig };
}
