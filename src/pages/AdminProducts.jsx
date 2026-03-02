import React, { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchCategories, fetchProducts, updateProductAvailability } from "@/lib/mockApi";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }) => updateProductAvailability(id, isAvailable),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Produto atualizado",
        description: `${variables.name} agora está ${variables.isAvailable ? "disponível" : "indisponível"}.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar produto",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const searchQuery = searchParams.get("q")?.toLowerCase() ?? "";

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description?.toLowerCase().includes(searchQuery)
    );
  }, [products, searchQuery]);

  const isLoading = isLoadingCategories || isLoadingProducts;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  const categoriesMap = categories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de produtos</CardTitle>
          <CardDescription>
            Gerencie disponibilidade e informações do cardápio em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              name="search"
              placeholder="Buscar por nome ou descrição"
              defaultValue={searchQuery}
              onChange={(event) => {
                const value = event.target.value;
                const params = new URLSearchParams(window.location.search);
                if (value) {
                  params.set("q", value);
                } else {
                  params.delete("q");
                }
                window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
              }}
              className="max-w-md"
            />
            <Button type="button" variant="outline" onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.delete("q");
              window.history.replaceState(null, "", window.location.pathname);
              window.dispatchEvent(new Event("popstate"));
            }}>
              Limpar busca
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos cadastrados</CardTitle>
          <CardDescription>
            Ative ou pause produtos conforme a disponibilidade da cozinha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Disponível</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const category = categoriesMap[product.category_id];
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="hidden sm:block w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {category?.name ?? "Sem categoria"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.is_available}
                            onCheckedChange={(checked) =>
                              availabilityMutation.mutate({ id: product.id, isAvailable: checked, name: product.name })
                            }
                          />
                          <span className="text-sm text-gray-500">
                            {product.is_available ? "Disponível" : "Indisponível"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-500">
                Nenhum produto encontrado com o filtro aplicado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
