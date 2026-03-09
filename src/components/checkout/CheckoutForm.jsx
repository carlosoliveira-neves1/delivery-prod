import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Banknote, QrCode, MapPin, Bike, Store } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutForm({ cart, deliveryFee, store, onSubmit, onBack, isSubmitting }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_complement: "",
    payment_method: "pix",
    delivery_type: "delivery",
    change_for: "",
    notes: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = form.delivery_type === "delivery" ? (deliveryFee || 0) : 0;
  const total = subtotal + fee;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, subtotal, delivery_fee: fee, total });
  };

  const paymentMethods = [
    { id: "pix", label: "PIX", icon: QrCode, show: store?.accepts_pix !== false },
    { id: "card", label: "Cartão", icon: CreditCard, show: store?.accepts_card !== false },
    { id: "cash", label: "Dinheiro", icon: Banknote, show: store?.accepts_cash !== false },
  ].filter((m) => m.show);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-bold">Finalizar pedido</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto pb-32">
        {/* Delivery Type */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Tipo de entrega</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "delivery", label: "Entrega", icon: Bike },
              { id: "pickup", label: "Retirada", icon: Store },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChange("delivery_type", opt.id)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                  form.delivery_type === opt.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Seus dados</Label>
          <Input
            placeholder="Seu nome"
            value={form.customer_name}
            onChange={(e) => handleChange("customer_name", e.target.value)}
            required
            className="h-12 rounded-xl border-gray-200"
          />
          <Input
            placeholder="WhatsApp (11) 99999-9999"
            value={form.customer_phone}
            onChange={(e) => handleChange("customer_phone", e.target.value)}
            required
            className="h-12 rounded-xl border-gray-200"
          />
        </div>

        {/* Address (only for delivery) */}
        {form.delivery_type === "delivery" && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Endereço de entrega
            </Label>
            <Input
              placeholder="Rua, número - Bairro"
              value={form.customer_address}
              onChange={(e) => handleChange("customer_address", e.target.value)}
              required
              className="h-12 rounded-xl border-gray-200"
            />
            <Input
              placeholder="Complemento (apt, bloco...)"
              value={form.customer_complement}
              onChange={(e) => handleChange("customer_complement", e.target.value)}
              className="h-12 rounded-xl border-gray-200"
            />
          </div>
        )}

        {/* Payment */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Forma de pagamento</Label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handleChange("payment_method", method.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-xs font-medium ${
                  form.payment_method === method.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <method.icon className="w-5 h-5" />
                {method.label}
              </button>
            ))}
          </div>
          {form.payment_method === "cash" && (
            <Input
              placeholder="Troco para R$..."
              type="number"
              value={form.change_for}
              onChange={(e) => handleChange("change_for", e.target.value)}
              className="h-12 rounded-xl border-gray-200"
            />
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Observações</Label>
          <Textarea
            placeholder="Alguma observação? (opcional)"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="rounded-xl border-gray-200 resize-none"
            rows={3}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2">
          <h3 className="font-semibold text-sm mb-3">Resumo do pedido</h3>
          {cart.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            {form.delivery_type === "delivery" && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Entrega</span>
                <span>R$ {fee.toFixed(2).replace(".", ",")}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-lg mx-auto h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-xl shadow-emerald-600/20 flex"
          >
            {isSubmitting ? "Enviando..." : `Enviar pedido • R$ ${total.toFixed(2).replace(".", ",")}`}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}