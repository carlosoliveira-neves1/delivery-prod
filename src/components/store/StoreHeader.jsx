import React from "react";
import { Clock, MapPin, Star, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StoreHeader({ store }) {
  if (!store) return null;

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-40 sm:h-56 w-full overflow-hidden">
        <img
          src={store.banner_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80"}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Store Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <div className="flex items-end gap-4">
          {/* Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-xl overflow-hidden flex-shrink-0 border-2 border-white">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.store_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 text-white text-2xl font-bold">
                {store.store_name?.[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              {store.store_name}
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <Badge
                className={`${store.is_open ? "bg-emerald-500/90" : "bg-red-500/90"} text-white border-0 text-xs`}
              >
                {store.is_open ? "Aberto agora" : "Fechado"}
              </Badge>
              {store.estimated_delivery_time && (
                <span className="flex items-center gap-1 text-white/80 text-xs sm:text-sm">
                  <Clock className="w-3 h-3" />
                  {store.estimated_delivery_time}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}