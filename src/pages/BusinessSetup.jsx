import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Pizza, 
  Croissant, 
  ShoppingCart, 
  Coffee, 
  UtensilsCrossed, 
  IceCream, 
  Cake, 
  Store,
  ArrowRight,
  Check,
  ChevronLeft,
  Sparkles,
  Upload,
  Clock,
  MapPin,
  Globe
} from "lucide-react";

export default function BusinessSetup() {
  const [step, setStep] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessData, setBusinessData] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    type: "",
    logo_url: "",
    banner_url: "",
    website: "",
    opening_hours: "",
    min_order: "",
    delivery_fee: ""
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const businessTypes = [
    {
      id: "pizzaria",
      name: "Pizzaria",
      icon: Pizza,
      description: "Pizzas tradicionais e especiais",
      color: "from-red-500 to-orange-500",
      categories: ["Pizzas Doces", "Pizzas Salgadas", "Bebidas", "Sobremesas"],
      features: ["Cardápio de pizzas", "Tamanhos (P/M/G)", "Ingredientes extras", "Combos"],
      template: {
        colors: { primary: "#dc2626", secondary: "#ea580c" },
        layout: "pizza_focused",
        defaultCategories: ["pizzas", "bebidas", "sobremesas"]
      }
    },
    {
      id: "padaria",
      name: "Padaria",
      icon: Croissant,
      description: "Pães frescos e produtos de padaria",
      color: "from-amber-500 to-yellow-500",
      categories: ["Pães", "Doces", "Salgados", "Bolos", "Bebidas"],
      features: ["Produtos frescos", "Horário matinal", "Encomendas", "Produtos por peso"],
      template: {
        colors: { primary: "#f59e0b", secondary: "#eab308" },
        layout: "bakery_grid",
        defaultCategories: ["padaria", "doces", "bebidas"]
      }
    },
    {
      id: "mercado",
      name: "Mercadinho",
      icon: ShoppingCart,
      description: "Produtos básicos e conveniência",
      color: "from-green-500 to-emerald-500",
      categories: ["Hortifrúti", "Laticínios", "Carnes", "Higiene", "Limpeza"],
      features: ["Produtos por categoria", "Lista de compras", "Promoções", "Produtos em falta"],
      template: {
        colors: { primary: "#10b981", secondary: "#059669" },
        layout: "market_categories",
        defaultCategories: ["mercado", "bebidas", "farmacia"]
      }
    },
    {
      id: "lanchonete",
      name: "Lanchonete",
      icon: Coffee,
      description: "Lanches rápidos e bebidas",
      color: "from-blue-500 to-cyan-500",
      categories: ["Hambúrgueres", "Sanduíches", "Batatas", "Bebidas", "Sobremesas"],
      features: ["Lanches rápidos", "Combos", "Personalização", "Delivery rápido"],
      template: {
        colors: { primary: "#3b82f6", secondary: "#06b6d4" },
        layout: "fast_food",
        defaultCategories: ["lanchonete", "bebidas", "doces"]
      }
    },
    {
      id: "restaurante",
      name: "Restaurante",
      icon: UtensilsCrossed,
      description: "Refeições completas e pratos executivos",
      color: "from-purple-500 to-pink-500",
      categories: ["Pratos Executivos", "À la Carte", "Entradas", "Sobremesas", "Bebidas"],
      features: ["Pratos elaborados", "Menu degustação", "Reservas", "Pratos do dia"],
      template: {
        colors: { primary: "#8b5cf6", secondary: "#ec4899" },
        layout: "restaurant_elegant",
        defaultCategories: ["restaurante", "bebidas", "doces"]
      }
    },
    {
      id: "sorveteria",
      name: "Sorveteria",
      icon: IceCream,
      description: "Sorvetes, açaí e gelados",
      color: "from-pink-500 to-rose-500",
      categories: ["Sorvetes", "Açaí", "Milk-shakes", "Picolés", "Sundaes"],
      features: ["Sabores variados", "Açaí personalizado", "Toppings", "Tamanhos"],
      template: {
        colors: { primary: "#ec4899", secondary: "#f43f5e" },
        layout: "ice_cream_colorful",
        defaultCategories: ["acai", "doces", "bebidas"]
      }
    },
    {
      id: "confeitaria",
      name: "Confeitaria",
      icon: Cake,
      description: "Bolos, doces e produtos artesanais",
      color: "from-indigo-500 to-purple-500",
      categories: ["Bolos", "Tortas", "Brigadeiros", "Cupcakes", "Salgadinhos"],
      features: ["Produtos artesanais", "Encomendas", "Personalização", "Eventos"],
      template: {
        colors: { primary: "#6366f1", secondary: "#8b5cf6" },
        layout: "confectionery_elegant",
        defaultCategories: ["doces", "padaria", "bebidas"]
      }
    },
    {
      id: "multi",
      name: "Multi-Segmento",
      icon: Store,
      description: "Diversos tipos de produtos",
      color: "from-gray-600 to-slate-600",
      categories: ["Todas as categorias disponíveis"],
      features: ["Flexibilidade total", "Múltiplas categorias", "Personalização completa"],
      template: {
        colors: { primary: "#4b5563", secondary: "#64748b" },
        layout: "multi_category",
        defaultCategories: ["featured", "pizzas", "padaria", "mercado", "lanchonete", "restaurante", "acai", "doces", "bebidas"]
      }
    }
  ];

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    setBusinessData(prev => ({ ...prev, type: business.id }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setBusinessData(prev => ({ ...prev, logo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
        setBusinessData(prev => ({ ...prev, banner_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedBusiness) {
      setStep(2);
    } else if (step === 2 && businessData.name && businessData.phone) {
      setStep(3);
    }
  };

  const handleFinish = async () => {
    try {
      // Aplicar template baseado no tipo de negócio
      const template = selectedBusiness.template;
      
      // Importar serviço de usuário
      const { getUserService } = await import("@/lib/userService");
      const userService = getUserService();
      await userService.initialize();
      
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        alert("Erro: Usuário não encontrado. Faça login novamente.");
        window.location.href = "/Login";
        return;
      }

      // Criar negócio no banco/localStorage
      const businessConfig = {
        name: businessData.name,
        type: selectedBusiness.id,
        description: businessData.description,
        phone: businessData.phone,
        address: businessData.address,
        logo_url: businessData.logo_url,
        banner_url: businessData.banner_url,
        website: businessData.website,
        opening_hours: businessData.opening_hours,
        min_order: businessData.min_order,
        delivery_fee: businessData.delivery_fee,
        template: template
      };

      await userService.createUserBusiness(currentUser.id, businessConfig);
      
      // Salvar configuração local para uso imediato
      localStorage.setItem('userBusinessConfig', JSON.stringify(businessConfig));
      localStorage.setItem('businessConfigured', 'true');
      
      alert(`🎉 Negócio configurado com sucesso!\n\n✅ Tipo: ${selectedBusiness.name}\n✅ Nome: ${businessData.name}\n✅ Template aplicado!\n\nRedirecionando para o painel administrativo...`);
      
      // Redirecionar para o painel admin
      setTimeout(() => {
        window.location.href = "/AdminDashboard";
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao configurar negócio:", error);
      alert("Erro ao configurar negócio. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-purple-600 bg-clip-text text-transparent">
              Configuração do Negócio
            </h1>
          </div>
          <p className="text-gray-600">Configure sua loja em poucos passos e comece a vender</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 3 ? <Check className="w-4 h-4" /> : '3'}
            </div>
          </div>
        </div>

        {/* Step 1: Business Type Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Qual é o seu tipo de negócio?</h2>
              <p className="text-gray-600">Selecione o tipo que melhor representa sua loja</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessTypes.map((business) => {
                const IconComponent = business.icon;
                const isSelected = selectedBusiness?.id === business.id;
                
                return (
                  <Card 
                    key={business.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleBusinessSelect(business)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{business.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{business.description}</p>
                        </div>

                        <div className="w-full">
                          <p className="text-xs font-medium text-gray-700 mb-2">Categorias incluídas:</p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {business.categories.slice(0, 3).map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {business.categories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{business.categories.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-full pt-2 border-t">
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Selecionado</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedBusiness && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-blue-900 mb-3">
                    Recursos incluídos para {selectedBusiness.name}:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-blue-800 mb-2">Funcionalidades:</p>
                      <ul className="space-y-1">
                        {selectedBusiness.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-blue-700">
                            <Check className="w-3 h-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 mb-2">Template personalizado:</p>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Cores otimizadas para o segmento
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Layout especializado
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3 h-3" />
                          Categorias pré-configuradas
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={handleNext}
                disabled={!selectedBusiness}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Business Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações do seu negócio</h2>
              <p className="text-gray-600">Preencha os dados básicos da sua {selectedBusiness.name.toLowerCase()}</p>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6 space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nome do estabelecimento *</Label>
                      <Input
                        id="businessName"
                        placeholder={`Ex: ${selectedBusiness.id === 'pizzaria' ? 'Pizzaria Bella Vista' : 
                                           selectedBusiness.id === 'padaria' ? 'Padaria Pão Dourado' :
                                           selectedBusiness.id === 'mercado' ? 'Mercadinho São José' :
                                           `${selectedBusiness.name} Central`}`}
                        value={businessData.name}
                        onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Descrição</Label>
                      <Textarea
                        id="businessDescription"
                        placeholder={`Descreva sua ${selectedBusiness.name.toLowerCase()}...`}
                        value={businessData.description}
                        onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessPhone">Telefone *</Label>
                        <Input
                          id="businessPhone"
                          placeholder="(11) 99999-9999"
                          value={businessData.phone}
                          onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessAddress">Endereço</Label>
                        <Input
                          id="businessAddress"
                          placeholder="Rua, número - Bairro"
                          value={businessData.address}
                          onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uploads de Imagens */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagens da Loja</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="logoUpload">Logo da Loja (Opcional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                          id="logoUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <label htmlFor="logoUpload" className="cursor-pointer block">
                          {logoPreview ? (
                            <div className="space-y-2">
                              <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-cover mx-auto rounded" />
                              <p className="text-sm text-blue-600 font-medium">Clique para alterar</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Clique para fazer upload do logo</p>
                              <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="bannerUpload">Banner da Loja (Opcional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                          id="bannerUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <label htmlFor="bannerUpload" className="cursor-pointer block">
                          {bannerPreview ? (
                            <div className="space-y-2">
                              <img src={bannerPreview} alt="Banner preview" className="w-full h-20 object-cover rounded" />
                              <p className="text-sm text-blue-600 font-medium">Clique para alterar</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Clique para fazer upload do banner</p>
                              <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opções Adicionais */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Opções Adicionais (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        placeholder="https://seusite.com.br"
                        value={businessData.website}
                        onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openingHours" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Horário de Funcionamento
                      </Label>
                      <Input
                        id="openingHours"
                        placeholder="Ex: 09:00 - 22:00"
                        value={businessData.opening_hours}
                        onChange={(e) => setBusinessData({...businessData, opening_hours: e.target.value})}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minOrder">Pedido Mínimo (R$)</Label>
                      <Input
                        id="minOrder"
                        type="number"
                        placeholder="Ex: 15.00"
                        value={businessData.min_order}
                        onChange={(e) => setBusinessData({...businessData, min_order: e.target.value})}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                      <Input
                        id="deliveryFee"
                        type="number"
                        placeholder="Ex: 4.99"
                        value={businessData.delivery_fee}
                        onChange={(e) => setBusinessData({...businessData, delivery_fee: e.target.value})}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between max-w-4xl mx-auto">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!businessData.name || !businessData.phone}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Finish */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Revisão e finalização</h2>
              <p className="text-gray-600">Confirme os dados e finalize a configuração</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Business Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedBusiness.color} flex items-center justify-center`}>
                      <selectedBusiness.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl">{businessData.name}</div>
                      <div className="text-sm text-gray-500 font-normal">{selectedBusiness.name}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Telefone:</span>
                      <p className="text-gray-600">{businessData.phone}</p>
                    </div>
                    {businessData.address && (
                      <div>
                        <span className="font-medium text-gray-700">Endereço:</span>
                        <p className="text-gray-600">{businessData.address}</p>
                      </div>
                    )}
                  </div>
                  {businessData.description && (
                    <div>
                      <span className="font-medium text-gray-700">Descrição:</span>
                      <p className="text-gray-600 text-sm mt-1">{businessData.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Template Preview */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">🎨 Template Personalizado</CardTitle>
                  <CardDescription className="text-green-700">
                    Seu template foi configurado automaticamente para o segmento {selectedBusiness.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-green-800 mb-2">Categorias ativadas:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBusiness.template.defaultCategories.map((cat, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 border-green-300">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-green-800 mb-2">Recursos incluídos:</p>
                      <ul className="space-y-1">
                        {selectedBusiness.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-green-700">
                            <Check className="w-3 h-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between max-w-2xl mx-auto">
              <Button 
                variant="outline"
                onClick={() => setStep(2)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={handleFinish}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Finalizar Configuração
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
