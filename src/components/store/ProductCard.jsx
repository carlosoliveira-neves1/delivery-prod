import React from "react";
import { Plus } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  if (!product.is_available) return null;

  return (
    <div
      className="flex gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md cursor-pointer group"
      onClick={() => onAdd(product)}
    >
      {/* Text Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            R$ {product.price?.toFixed(2).replace(".", ",")}
          </span>
          <button
            className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 active:scale-90 shadow-lg shadow-gray-900/20"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image */}
      {product.image_url && (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}