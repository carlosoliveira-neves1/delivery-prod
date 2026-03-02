import React from "react";
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function OrderSuccess({ order, store, onNewOrder }) {
  const statusLabels = {
    pending: "Aguardando confirmação",
    confirmed: "Confirmado",
    preparing: "Preparando",
    delivering: "Saiu para entrega",
    delivered: "Entregue",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, damping: 12 }}
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </motion.div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido enviado!</h1>
          <p className="text-gray-500 mt-2">
            Seu pedido foi recebido com sucesso. Acompanhe o status abaixo.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-left space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
              {statusLabels[order?.status] || "Pendente"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="font-bold">R$ {order?.total?.toFixed(2).replace(".", ",")}</span>
          </div>
          {store?.estimated_delivery_time && order?.delivery_type === "delivery" && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Previsão: {store.estimated_delivery_time}</span>
            </div>
          )}
          {store?.phone && (
            <a
              href={`https://wa.me/55${store.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Phone className="w-4 h-4" />
              Falar com a loja no WhatsApp
            </a>
          )}
        </div>

        <Button
          onClick={onNewOrder}
          variant="outline"
          className="w-full h-12 rounded-xl"
        >
          Fazer novo pedido
        </Button>
      </div>
    </motion.div>
  );
}