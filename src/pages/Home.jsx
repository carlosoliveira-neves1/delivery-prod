import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import StoreHeader from "@/components/store/StoreHeader";
import StoreInfo from "@/components/store/StoreInfo";
import CategoryNav from "@/components/store/CategoryNav";
import ProductCard from "@/components/store/ProductCard";
import CartBar from "@/components/store/CartBar";
import CartDrawer from "@/components/store/CartDrawer";
import Chatbot from "@/components/Chatbot";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSuccess from "@/components/checkout/OrderSuccess";
import { Button } from "@/components/ui/button";
import { fetchCategories, fetchProducts, fetchStore, submitOrder } from "@/lib/mockApi";
import { scrollToSelector } from "@/utils";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu"); // menu | checkout | success
  const [isCartOpen, setCartOpen] = useState(false);

  const [order, setOrder] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    data: store,
    isLoading: isLoadingStore,
    error: storeError,
  } = useQuery({ queryKey: ["store"], queryFn: fetchStore });
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const isLoading = isLoadingStore || isLoadingCategories || isLoadingProducts;
  const error = storeError || categoriesError || productsError;

  useEffect(() => {
    if (activeCategory !== "all") {
      scrollToSelector(`#category-${activeCategory}`);
    }
  }, [activeCategory]);

  const productsByCategory = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => map.set(category.id, []));
    products.forEach((product) => {
      if (!product.is_available) return;
      if (!map.has(product.category_id)) {
        map.set(product.category_id, []);
      }
      map.get(product.category_id).push(product);
    });
    return map;
  }, [categories, products]);

  const visibleCategories = useMemo(() => {
    if (activeCategory === "all") return categories;
    return categories.filter((category) => category.id === activeCategory);
  }, [categories, activeCategory]);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.category_id === "featured" && product.is_available),
    [products]
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleDecreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleIncreaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleRemove = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleSubmitOrder = async (formData) => {
    try {
      setSubmitting(true);
      const newOrder = await submitOrder({
        ...formData,
        items: cart.map(({ id, name, price, quantity }) => ({
          product_id: id,
          name,
          price,
          quantity,
        })),
      });
      setOrder(newOrder);
      setCart([]);
      setView("success");
      setCartOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    setOrder(null);
    setView("menu");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center space-y-3">
        <p className="text-gray-600">Não foi possível carregar o cardápio.</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  if (view === "checkout") {
    return (
      <CheckoutForm
        cart={cart}
        deliveryFee={store?.delivery_fee}
        store={store}
        onSubmit={handleSubmitOrder}
        onBack={() => setView("menu")}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (view === "success") {
    return <OrderSuccess order={order} store={store} onNewOrder={handleNewOrder} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <StoreHeader store={store} />
      <StoreInfo store={store} />
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {activeCategory === "all" && featuredProducts.length > 0 && (
        <section className="px-4 pt-6 space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              ⭐ Destaques
            </h2>
            <p className="text-sm text-gray-500">Escolhas especiais da casa.</p>
          </div>
          <div className="space-y-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
            ))}
          </div>
        </section>
      )}

      <div className="px-4 pt-6 space-y-6">
        {visibleCategories.map((category) => {
          const items = productsByCategory.get(category.id) || [];
          if (!items.length) return null;
          return (
            <section key={category.id} id={`category-${category.id}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}
                </div>
                {activeCategory !== category.id && (
                  <Button variant="ghost" size="sm" onClick={() => setActiveCategory(category.id)}>
                    Ver categoria
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
                ))}
              </div>
            </section>
          );
        })}

        {!products.length && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Cardápio em breve</p>
            <p className="text-sm mt-1">Os produtos serão adicionados em breve.</p>
          </div>
        )}
      </div>

      <CartBar itemCount={cartCount} total={cartTotal} onClick={() => setCartOpen(true)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onDecrease={handleDecreaseQuantity}
        onIncrease={handleIncreaseQuantity}
        onRemove={handleRemove}
        deliveryFee={store?.delivery_fee}
        onCheckout={() => setView("checkout")}
      />
      <Chatbot />
    </div>
  );
}