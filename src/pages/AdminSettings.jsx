import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchStore, updateStoreSettings } from "@/lib/mockApi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const formatNumber = (value) => (value ?? "").toString();

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: store, isLoading } = useQuery({ queryKey: ["store"], queryFn: fetchStore });

  const [form, setForm] = useState({
    store_name: "",
    description: "",
    phone: "",
    min_order: "",
    delivery_fee: "",
    accepts_pix: true,
    accepts_card: true,
    accepts_cash: true,
  });

  useEffect(() => {
    if (store) {
      setForm({
        store_name: store.store_name ?? "",
        description: store.description ?? "",
        phone: store.phone ?? "",
        min_order: formatNumber(store.min_order),
        delivery_fee: formatNumber(store.delivery_fee),
        accepts_pix: Boolean(store.accepts_pix),
        accepts_card: Boolean(store.accepts_card),
        accepts_cash: Boolean(store.accepts_cash),
      });
    }
  }, [store]);

  const updateMutation = useMutation({
    mutationFn: updateStoreSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast({
        title: "Configurações salvas",
        description: "As informações da loja foram atualizadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field) => (event) => {
    const value = event.target ? event.target.value : event;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => (checked) => {
    setForm((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      min_order: parseFloat(form.min_order) || 0,
      delivery_fee: parseFloat(form.delivery_fee) || 0,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading || !store) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da loja</CardTitle>
          <CardDescription>Atualize o que seus clientes veem no cardápio público.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="store_name">Nome da loja</Label>
                <Input
                  id="store_name"
                  value={form.store_name}
                  onChange={handleChange("store_name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone de contato</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="11999999999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_order">Pedido mínimo (R$)</Label>
                <Input
                  id="min_order"
                  type="number"
                  step="0.5"
                  min="0"
                  value={form.min_order}
                  onChange={handleChange("min_order")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_fee">Taxa de entrega (R$)</Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.5"
                  min="0"
                  value={form.delivery_fee}
                  onChange={handleChange("delivery_fee")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={handleChange("description")}
                rows={4}
                placeholder="Fale sobre os diferenciais da sua loja"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Formas de pagamento</CardTitle>
                <CardDescription>Controle o que aparece disponível no checkout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">PIX</p>
                    <p className="text-sm text-gray-500">Exibe opção de pagamento via PIX.</p>
                  </div>
                  <Switch checked={form.accepts_pix} onCheckedChange={handleToggle("accepts_pix")} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cartão</p>
                    <p className="text-sm text-gray-500">Aceita cartões na entrega ou retirada.</p>
                  </div>
                  <Switch checked={form.accepts_card} onCheckedChange={handleToggle("accepts_card")} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dinheiro</p>
                    <p className="text-sm text-gray-500">Permite pagamento em dinheiro.</p>
                  </div>
                  <Switch checked={form.accepts_cash} onCheckedChange={handleToggle("accepts_cash")} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setForm({
                store_name: store.store_name ?? "",
                description: store.description ?? "",
                phone: store.phone ?? "",
                min_order: formatNumber(store.min_order),
                delivery_fee: formatNumber(store.delivery_fee),
                accepts_pix: Boolean(store.accepts_pix),
                accepts_card: Boolean(store.accepts_card),
                accepts_cash: Boolean(store.accepts_cash),
              })}>
                Cancelar
              </Button>
              <Link to="/StorePreview">
                <Button type="button" variant="outline" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Visualizar Loja
                </Button>
              </Link>
              <Button type="submit" disabled={updateMutation.isLoading}>
                {updateMutation.isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
