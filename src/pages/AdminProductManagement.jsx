import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Package,
  DollarSign,
  Weight,
  Tag,
  Image as ImageIcon,
  Save,
  X
} from "lucide-react";

export default function AdminProductManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Pizza Margherita",
      description: "Molho de tomate, mussarela, manjericão fresco",
      price: 32.90,
      weight: 450,
      category: "pizzas",
      categoryName: "Pizzas",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
      available: true,
      sku: "PIZ001",
      preparationTime: 25,
      ingredients: ["Massa", "Molho de tomate", "Mussarela", "Manjericão"],
      allergens: ["Glúten", "Lactose"]
    },
    {
      id: 2,
      name: "Hambúrguer Artesanal",
      description: "Pão brioche, blend 180g, queijo cheddar, alface, tomate",
      price: 28.50,
      weight: 320,
      category: "hamburgers",
      categoryName: "Hambúrgueres",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
      available: true,
      sku: "HAM001",
      preparationTime: 15,
      ingredients: ["Pão brioche", "Carne bovina", "Queijo cheddar", "Alface", "Tomate"],
      allergens: ["Glúten", "Lactose"]
    }
  ]);

  const [categories] = useState([
    { id: "pizzas", name: "Pizzas" },
    { id: "hamburgers", name: "Hambúrgueres" },
    { id: "bebidas", name: "Bebidas" },
    { id: "sobremesas", name: "Sobremesas" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
    image: "",
    sku: "",
    preparationTime: "",
    ingredients: "",
    allergens: "",
    available: true
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      const product = {
        id: products.length + 1,
        ...newProduct,
        price: parseFloat(newProduct.price),
        weight: parseFloat(newProduct.weight) || 0,
        preparationTime: parseInt(newProduct.preparationTime) || 0,
        ingredients: newProduct.ingredients.split(",").map(i => i.trim()).filter(i => i),
        allergens: newProduct.allergens.split(",").map(a => a.trim()).filter(a => a),
        categoryName: categories.find(c => c.id === newProduct.category)?.name || ""
      };
      setProducts([...products, product]);
      setNewProduct({
        name: "", description: "", price: "", weight: "", category: "",
        image: "", sku: "", preparationTime: "", ingredients: "", allergens: "", available: true
      });
      setShowAddProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      ingredients: product.ingredients?.join(", ") || "",
      allergens: product.allergens?.join(", ") || ""
    });
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        weight: parseFloat(editingProduct.weight) || 0,
        preparationTime: parseInt(editingProduct.preparationTime) || 0,
        ingredients: editingProduct.ingredients.split(",").map(i => i.trim()).filter(i => i),
        allergens: editingProduct.allergens.split(",").map(a => a.trim()).filter(a => a),
        categoryName: categories.find(c => c.id === editingProduct.category)?.name || ""
      };
      
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    }
  };

  const deleteProduct = (productId) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const toggleAvailability = (productId) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, available: !p.available } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-3 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gerenciar Produtos</h1>
        <p className="text-sm sm:text-base text-gray-600">Cadastre e gerencie o cardápio do seu estabelecimento</p>
      </div>

      {/* Action Button */}
      {!showAddProduct && !editingProduct && (
        <div className="mb-4 sm:mb-6">
          <Button 
            onClick={() => setShowAddProduct(true)} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Total de Produtos</p>
                <p className="text-xl sm:text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Produtos Ativos</p>
                <p className="text-xl sm:text-2xl font-bold">{products.filter(p => p.available).length}</p>
              </div>
              <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Categorias</p>
                <p className="text-xl sm:text-2xl font-bold">{categories.length}</p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm">Preço Médio</p>
                <p className="text-xl sm:text-2xl font-bold">
                  R$ {(products.reduce((sum, p) => sum + p.price, 0) / products.length || 0).toFixed(0)}
                </p>
              </div>
              <Weight className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Product Form */}
      {(showAddProduct || editingProduct) && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
            </CardTitle>
            <CardDescription>
              {editingProduct ? "Atualize as informações do produto" : "Preencha os dados do novo produto"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do produto *</Label>
                  <Input
                    placeholder="Ex: Pizza Margherita"
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, name: e.target.value})
                      : setNewProduct({...newProduct, name: e.target.value})
                    }
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Descreva os ingredientes e características"
                    rows={3}
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, description: e.target.value})
                      : setNewProduct({...newProduct, description: e.target.value})
                    }
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preço (R$) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={editingProduct ? editingProduct.price : newProduct.price}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, price: e.target.value})
                        : setNewProduct({...newProduct, price: e.target.value})
                      }
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Peso (g)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 450"
                      value={editingProduct ? editingProduct.weight : newProduct.weight}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, weight: e.target.value})
                        : setNewProduct({...newProduct, weight: e.target.value})
                      }
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select 
                    value={editingProduct ? editingProduct.category : newProduct.category} 
                    onValueChange={(value) => editingProduct 
                      ? setEditingProduct({...editingProduct, category: value})
                      : setNewProduct({...newProduct, category: value})
                    }
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      placeholder="Ex: PIZ001"
                      value={editingProduct ? editingProduct.sku : newProduct.sku}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, sku: e.target.value})
                        : setNewProduct({...newProduct, sku: e.target.value})
                      }
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tempo preparo (min)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 25"
                      value={editingProduct ? editingProduct.preparationTime : newProduct.preparationTime}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, preparationTime: e.target.value})
                        : setNewProduct({...newProduct, preparationTime: e.target.value})
                      }
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL da Imagem</Label>
                  <Input
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={editingProduct ? editingProduct.image : newProduct.image}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({...editingProduct, image: e.target.value})
                      : setNewProduct({...newProduct, image: e.target.value})
                    }
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ingredientes (separados por vírgula)</Label>
                <Input
                  placeholder="Ex: Massa, Molho de tomate, Mussarela"
                  value={editingProduct ? editingProduct.ingredients : newProduct.ingredients}
                  onChange={(e) => editingProduct 
                    ? setEditingProduct({...editingProduct, ingredients: e.target.value})
                    : setNewProduct({...newProduct, ingredients: e.target.value})
                  }
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Alérgenos (separados por vírgula)</Label>
                <Input
                  placeholder="Ex: Glúten, Lactose"
                  value={editingProduct ? editingProduct.allergens : newProduct.allergens}
                  onChange={(e) => editingProduct 
                    ? setEditingProduct({...editingProduct, allergens: e.target.value})
                    : setNewProduct({...newProduct, allergens: e.target.value})
                  }
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              {editingProduct ? (
                <>
                  <Button onClick={handleUpdateProduct} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-xs sm:text-sm min-w-[200px]">Produto</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[120px]">Categoria</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[80px]">Preço</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[60px]">Peso</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[150px]">Status</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm min-w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-blue-50/50">
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                          {product.sku && (
                            <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {product.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-600 text-xs sm:text-sm">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs sm:text-sm">
                      {product.weight ? `${product.weight}g` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.available}
                          onCheckedChange={() => toggleAvailability(product.id)}
                          className="scale-75 sm:scale-100"
                        />
                        <Badge className={`text-xs ${product.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {product.available ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 sm:p-2"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
    </div>
  );
}
