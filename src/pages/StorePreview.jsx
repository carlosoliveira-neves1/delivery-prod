import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StoreHeader from "@/components/store/StoreHeader";
import StoreInfo from "@/components/store/StoreInfo";
import CategoryNav from "@/components/store/CategoryNav";
import ProductCard from "@/components/store/ProductCard";
import CartBar from "@/components/store/CartBar";
import CartDrawer from "@/components/store/CartDrawer";
import { ArrowLeft, Eye, ExternalLink } from "lucide-react";
import { fetchStore, fetchCategories, fetchProducts } from "@/lib/mockApi";

export default function StorePreview() {
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchStore(),
      fetchCategories(),
      fetchProducts()
    ]).then(([storeData, categoriesData, productsData]) => {
      setStore(storeData);
      setCategories(categoriesData);
      setProducts(productsData);
    });
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category_id === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.product_id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product_id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão de voltar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link to="/AdminSettings">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Admin
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Visualização do Cliente</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Preview
          </Badge>
        </div>
      </div>

      {/* Aviso de Preview */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm text-blue-700">
            <Eye className="w-4 h-4 inline mr-1" />
            Esta é a visualização que seus clientes verão no app de delivery
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto bg-white min-h-screen">
        {/* Store Header */}
        <StoreHeader store={store} />
        
        {/* Store Info */}
        <StoreInfo store={store} />

        {/* Category Navigation */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        <div className="p-4 space-y-3 pb-24">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onAdd={addToCart}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto encontrado nesta categoria</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Bar */}
      <CartBar 
        itemCount={cartCount} 
        total={cartTotal} 
        onClick={() => setCartOpen(true)} 
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateItem={updateCartItem}
        deliveryFee={store?.delivery_fee || 0}
        onCheckout={() => {
          alert("Checkout simulado! Em produção, redirecionaria para o formulário de pedido.");
          setCartOpen(false);
        }}
      />

      {/* Floating Action - Link para loja real */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button 
          className="rounded-full w-14 h-14 shadow-xl bg-green-600 hover:bg-green-700"
          onClick={() => window.open("/Home", "_blank")}
        >
          <ExternalLink className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
