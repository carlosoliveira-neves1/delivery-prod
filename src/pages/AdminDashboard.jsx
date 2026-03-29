import React, { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchOrders, updateOrderStatus } from "@/lib/mockApi";
import { formatCurrency } from "@/utils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pendente", badge: "secondary" },
  { value: "confirmed", label: "Confirmado", badge: "default" },
  { value: "preparing", label: "Em preparo", badge: "default" },
  { value: "delivering", label: "Em rota", badge: "outline" },
  { value: "completed", label: "Concluído", badge: "default" },
  { value: "cancelled", label: "Cancelado", badge: "destructive" },
];

const STATUS_MAP = ORDER_STATUS_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option;
  return acc;
}, {});

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Status atualizado",
        description: `Pedido ${variables.id} agora está como ${
          STATUS_MAP[variables.status]?.label ?? variables.status
        }`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar pedido",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const { totalOrders, totalRevenue, activeDeliveries } = useMemo(() => {
    const total = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (order.total ?? 0), 0);
    const inProgress = orders.filter((order) =>
      ["pending", "confirmed", "preparing", "delivering"].includes(order.status)
    ).length;

    return {
      totalOrders: total,
      totalRevenue: revenue,
      activeDeliveries: inProgress,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Pedidos hoje</CardTitle>
            <CardDescription className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {totalOrders}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
              Faturamento estimado
            </CardTitle>
            <CardDescription className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {formatCurrency(totalRevenue)}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
              Pedidos em andamento
            </CardTitle>
            <CardDescription className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {activeDeliveries}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Pedidos recentes</CardTitle>
          <CardDescription className="text-sm">
            Acompanhe os pedidos do turno e atualize o status conforme o andamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px] text-xs sm:text-sm">Pedido</TableHead>
                  <TableHead className="min-w-[120px] text-xs sm:text-sm">Cliente</TableHead>
                  <TableHead className="min-w-[80px] text-xs sm:text-sm">Tipo</TableHead>
                  <TableHead className="min-w-[80px] text-xs sm:text-sm">Total</TableHead>
                  <TableHead className="min-w-[200px] text-xs sm:text-sm">Itens</TableHead>
                  <TableHead className="min-w-[150px] text-xs sm:text-sm">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const statusOption = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-gray-900 text-xs sm:text-sm">{order.id}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{order.customer_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-xs">
                          {order.delivery_type === "pickup" ? "Retirada" : "Entrega"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatCurrency(order.total ?? 0)}</TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {order.items?.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) =>
                            statusMutation.mutate({ id: order.id, status: value })
                          }
                        >
                          <SelectTrigger className="w-[130px] sm:w-[150px] text-xs sm:text-sm">
                            <SelectValue>
                              <Badge
                                variant={statusOption?.badge ?? "outline"}
                                className="w-full justify-center text-xs"
                              >
                                {statusOption?.label ?? order.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-xs sm:text-sm">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
