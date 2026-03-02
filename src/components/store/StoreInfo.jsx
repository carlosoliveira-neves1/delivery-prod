import React from "react";
import { MapPin, Clock, Phone, CreditCard, Banknote, QrCode } from "lucide-react";

export default function StoreInfo({ store }) {
  if (!store) return null;

  return (
    <div className="px-4 py-3 flex items-center gap-4 overflow-x-auto text-xs text-gray-500 border-b border-gray-100"
      style={{ scrollbarWidth: "none" }}
    >
      {store.address && (
        <span className="flex items-center gap-1 whitespace-nowrap">
          <MapPin className="w-3 h-3" /> {store.address}
        </span>
      )}
      {store.opening_hours && (
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Clock className="w-3 h-3" /> {store.opening_hours}
        </span>
      )}
      {store.min_order > 0 && (
        <span className="flex items-center gap-1 whitespace-nowrap">
          Pedido mín. R$ {store.min_order?.toFixed(2).replace(".", ",")}
        </span>
      )}
      <span className="flex items-center gap-1 whitespace-nowrap">
        Entrega R$ {store.delivery_fee?.toFixed(2).replace(".", ",")}
      </span>
    </div>
  );
}