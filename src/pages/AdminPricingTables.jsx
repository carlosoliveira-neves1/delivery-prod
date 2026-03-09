import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  Users,
  Tag,
  Package,
  Save,
  X,
  Copy,
  Settings
} from "lucide-react";

export default function AdminPricingTables() {
  const [pricingTables, setPricingTables] = useState([
    {
      id: 1,
      name: "Tabela Padrão",
      description: "Preços padrão para todos os clientes",
      type: "default",
      active: true,
      appliedTo: "all",
      rules: [
        { productId: 1, productName: "Pizza Margherita", basePrice: 32.90, newPrice: 32.90, discount: 0 },
        { productId: 2, productName: "Hambúrguer Artesanal", basePrice: 28.50, newPrice: 28.50, discount: 0 }
      ],
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Desconto VIP",
      description: "15% de desconto para clientes VIP",
      type: "customer",
      active: true,
      appliedTo: "vip_customers",
      rules: [
        { productId: 1, productName: "Pizza Margherita", basePrice: 32.90, newPrice: 27.97, discount: 15 },
        { productId: 2, productName: "Hambúrguer Artesanal", basePrice: 28.50, newPrice: 24.23, discount: 15 }
      ],
      createdAt: "2024-02-01"
    },
    {
      id: 3,
      name: "Promoção Pizzas",
      description: "Desconto especial na categoria pizzas",
      type: "category",
      active: true,
      appliedTo: "pizzas",
      rules: [
        { productId: 1, productName: "Pizza Margherita", basePrice: 32.90, newPrice: 29.90, discount: 9.1 }
      ],
      createdAt: "2024-02-10"
    }
  ]);

  const [customers] = useState([
    { id: "all", name: "Todos os clientes" },
    { id: "vip_customers", name: "Clientes VIP" },
    { id: "new_customers", name: "Novos clientes" },
    { id: "corporate", name: "Clientes corporativos" }
  ]);

  const [categories] = useState([
    { id: "all", name: "Todas as categorias" },
    { id: "pizzas", name: "Pizzas" },
    { id: "hamburgers", name: "Hambúrgueres" },
    { id: "bebidas", name: "Bebidas" },
    { id: "sobremesas", name: "Sobremesas" }
  ]);

  const [products] = useState([
    { id: 1, name: "Pizza Margherita", price: 32.90, category: "pizzas" },
    { id: 2, name: "Hambúrguer Artesanal", price: 28.50, category: "hamburgers" },
    { id: 3, name: "Coca-Cola 350ml", price: 5.50, category: "bebidas" },
    { id: 4, name: "Pudim de Leite", price: 8.90, category: "sobremesas" }
  ]);

  const [showAddTable, setShowAddTable] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedTable, setSelectedTable] = useState(pricingTables[0]);

  const [newTable, setNewTable] = useState({
    name: "",
    description: "",
    type: "default",
    appliedTo: "all",
    active: true,
    rules: []
  });

  const handleAddTable = () => {
    if (newTable.name) {
      const table = {
        id: pricingTables.length + 1,
        ...newTable,
        rules: products.map(product => ({
          productId: product.id,
          productName: product.name,
          basePrice: product.price,
          newPrice: product.price,
          discount: 0
        })),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPricingTables([...pricingTables, table]);
      setNewTable({ name: "", description: "", type: "default", appliedTo: "all", active: true, rules: [] });
      setShowAddTable(false);
    }
  };

  const handleEditTable = (table) => {
    setEditingTable({ ...table });
  };

  const handleUpdateTable = () => {
    if (editingTable) {
      setPricingTables(pricingTables.map(t => t.id === editingTable.id ? editingTable : t));
      setEditingTable(null);
    }
  };

  const deleteTable = (tableId) => {
    if (confirm("Tem certeza que deseja excluir esta tabela de preços?")) {
      setPricingTables(pricingTables.filter(t => t.id !== tableId));
    }
  };

  const toggleTableStatus = (tableId) => {
    setPricingTables(pricingTables.map(t =>
      t.id === tableId ? { ...t, active: !t.active } : t
    ));
  };

  const updatePriceRule = (ruleIndex, field, value) => {
    if (editingTable) {
      const updatedRules = [...editingTable.rules];
      updatedRules[ruleIndex] = { ...updatedRules[ruleIndex], [field]: value };
      
      if (field === 'newPrice') {
        const basePrice = updatedRules[ruleIndex].basePrice;
        const discount = ((basePrice - value) / basePrice) * 100;
        updatedRules[ruleIndex].discount = Math.max(0, discount);
      } else if (field === 'discount') {
        const basePrice = updatedRules[ruleIndex].basePrice;
        const newPrice = basePrice * (1 - value / 100);
        updatedRules[ruleIndex].newPrice = Math.max(0, newPrice);
      }
      
      setEditingTable({ ...editingTable, rules: updatedRules });
    }
  };

  const duplicateTable = (table) => {
    const duplicated = {
      ...table,
      id: pricingTables.length + 1,
      name: `${table.name} (Cópia)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPricingTables([...pricingTables, duplicated]);
  };

  const getTypeLabel = (type) => {
    const types = {
      default: "Padrão",
      customer: "Por Cliente",
      category: "Por Categoria",
      product: "Por Produto"
    };
    return types[type] || type;
  };

  const getAppliedToLabel = (appliedTo, type) => {
    if (type === "customer") {
      return customers.find(c => c.id === appliedTo)?.name || appliedTo;
    } else if (type === "category") {
      return categories.find(c => c.id === appliedTo)?.name || appliedTo;
    }
    return "Todos";
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
            Tabelas de Preços
          </h1>
          <p className="text-gray-600">Configure preços diferenciados por cliente, categoria ou produto</p>
        </div>
        <Button 
          onClick={() => setShowAddTable(true)} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Tabela
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total de Tabelas</p>
                <p className="text-2xl font-bold">{pricingTables.length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Tabelas Ativas</p>
                <p className="text-2xl font-bold">{pricingTables.filter(t => t.active).length}</p>
              </div>
              <Settings className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Por Cliente</p>
                <p className="text-2xl font-bold">{pricingTables.filter(t => t.type === 'customer').length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Por Categoria</p>
                <p className="text-2xl font-bold">{pricingTables.filter(t => t.type === 'category').length}</p>
              </div>
              <Tag className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
          <TabsTrigger value="tables" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
            Gerenciar Tabelas
          </TabsTrigger>
          <TabsTrigger value="editor" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
            Editor de Preços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          {/* Add/Edit Table Form */}
          {(showAddTable || editingTable) && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {editingTable ? "Editar Tabela de Preços" : "Nova Tabela de Preços"}
                </CardTitle>
                <CardDescription>
                  {editingTable ? "Atualize as configurações da tabela" : "Configure uma nova tabela de preços"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da tabela *</Label>
                    <Input
                      placeholder="Ex: Desconto VIP"
                      value={editingTable ? editingTable.name : newTable.name}
                      onChange={(e) => editingTable 
                        ? setEditingTable({...editingTable, name: e.target.value})
                        : setNewTable({...newTable, name: e.target.value})
                      }
                      className="border-gray-200 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de aplicação</Label>
                    <Select 
                      value={editingTable ? editingTable.type : newTable.type} 
                      onValueChange={(value) => editingTable 
                        ? setEditingTable({...editingTable, type: value})
                        : setNewTable({...newTable, type: value})
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão (todos)</SelectItem>
                        <SelectItem value="customer">Por tipo de cliente</SelectItem>
                        <SelectItem value="category">Por categoria</SelectItem>
                        <SelectItem value="product">Por produto específico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Descreva quando esta tabela deve ser aplicada"
                    value={editingTable ? editingTable.description : newTable.description}
                    onChange={(e) => editingTable 
                      ? setEditingTable({...editingTable, description: e.target.value})
                      : setNewTable({...newTable, description: e.target.value})
                    }
                    className="border-gray-200 focus:border-purple-500"
                  />
                </div>

                {((editingTable && editingTable.type !== 'default') || (newTable.type !== 'default')) && (
                  <div className="space-y-2">
                    <Label>Aplicar para</Label>
                    <Select 
                      value={editingTable ? editingTable.appliedTo : newTable.appliedTo} 
                      onValueChange={(value) => editingTable 
                        ? setEditingTable({...editingTable, appliedTo: value})
                        : setNewTable({...newTable, appliedTo: value})
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {((editingTable && editingTable.type === 'customer') || newTable.type === 'customer') && 
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))
                        }
                        {((editingTable && editingTable.type === 'category') || newTable.type === 'category') && 
                          categories.filter(c => c.id !== 'all').map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  {editingTable ? (
                    <>
                      <Button onClick={handleUpdateTable} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                      <Button variant="outline" onClick={() => setEditingTable(null)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleAddTable} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Tabela
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddTable(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tables List */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tabelas de Preços ({pricingTables.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Aplicado para</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingTables.map((table) => (
                      <TableRow key={table.id} className="hover:bg-purple-50/50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{table.name}</div>
                            <div className="text-sm text-gray-500">{table.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {getTypeLabel(table.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {getAppliedToLabel(table.appliedTo, table.type)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={table.active}
                              onCheckedChange={() => toggleTableStatus(table.id)}
                            />
                            <Badge className={table.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {table.active ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {new Date(table.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedTable(table)}
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => duplicateTable(table)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditTable(table)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteTable(table.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {/* Price Editor */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Editor de Preços - {selectedTable?.name}
                  </CardTitle>
                  <CardDescription>
                    Ajuste os preços individuais para cada produto nesta tabela
                  </CardDescription>
                </div>
                <Select value={selectedTable?.id.toString()} onValueChange={(value) => {
                  const table = pricingTables.find(t => t.id === parseInt(value));
                  if (table) setSelectedTable(table);
                }}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingTables.map((table) => (
                      <SelectItem key={table.id} value={table.id.toString()}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTable && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead>Produto</TableHead>
                        <TableHead>Preço Base</TableHead>
                        <TableHead>Novo Preço</TableHead>
                        <TableHead>Desconto (%)</TableHead>
                        <TableHead>Economia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTable.rules.map((rule, index) => (
                        <TableRow key={rule.productId} className="hover:bg-purple-50/50">
                          <TableCell className="font-medium">
                            {rule.productName}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            R$ {rule.basePrice.toFixed(2).replace(".", ",")}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={rule.newPrice}
                              onChange={(e) => updatePriceRule(index, 'newPrice', parseFloat(e.target.value) || 0)}
                              className="w-24 border-gray-200 focus:border-purple-500"
                              disabled={!editingTable || editingTable.id !== selectedTable.id}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.1"
                              value={rule.discount.toFixed(1)}
                              onChange={(e) => updatePriceRule(index, 'discount', parseFloat(e.target.value) || 0)}
                              className="w-20 border-gray-200 focus:border-purple-500"
                              disabled={!editingTable || editingTable.id !== selectedTable.id}
                            />
                          </TableCell>
                          <TableCell>
                            <span className={rule.discount > 0 ? "text-green-600 font-medium" : "text-gray-400"}>
                              R$ {(rule.basePrice - rule.newPrice).toFixed(2).replace(".", ",")}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t">
                {editingTable && editingTable.id === selectedTable?.id ? (
                  <>
                    <Button onClick={handleUpdateTable} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Preços
                    </Button>
                    <Button variant="outline" onClick={() => setEditingTable(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleEditTable(selectedTable)} className="bg-purple-600 hover:bg-purple-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Preços
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
