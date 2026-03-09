import React from "react";
import { ShoppingBag } from "lucide-react";

export default function CartBar({ itemCount, total, onClick }) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe">
      <button
        onClick={onClick}
        className="w-full max-w-lg mx-auto flex items-center justify-between
          bg-gray-900 text-white rounded-2xl px-5 py-4
          shadow-2xl shadow-gray-900/30 hover:bg-gray-800
          active:scale-[0.98] transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-semibold text-sm">Ver carrinho</span>
        </div>
        <span className="font-bold text-base">
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </button>
    </div>
  );
}