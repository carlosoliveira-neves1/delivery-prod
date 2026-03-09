import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
 DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  deliveryFee = 0,
}) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (cart.length > 0 ? deliveryFee : 0);

  const handleOpenChange = (open) => {
    if (!open) onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg font-semibold">Seu carrinho</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              Seu carrinho está vazio. Adicione itens do cardápio para continuar.
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-xl p-3 flex items-start gap-3"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDecrease(item.id)}
                          aria-label={`Diminuir quantidade de ${item.name}`}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onIncrease(item.id)}
                          aria-label={`Aumentar quantidade de ${item.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DrawerFooter className="space-y-3">
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Entrega</span>
              <span>{cart.length > 0 ? formatCurrency(deliveryFee) : formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button
            className="w-full h-12 rounded-xl"
            disabled={cart.length === 0}
            onClick={() => {
              onCheckout();
              onClose();
            }}
          >
            Ir para checkout
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full h-12 rounded-xl">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
