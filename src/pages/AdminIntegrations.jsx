import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plug, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Settings, 
  ExternalLink,
  Truck,
  Store,
  CreditCard,
  Smartphone
} from "lucide-react";

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState([
    {
      id: "ifood-entrega-facil",
      name: "Entrega Fácil - iFood",
      description: "Integração com o sistema de entrega do iFood",
      status: "disconnected",
      type: "delivery",
      config: {
        apiKey: "",
        storeId: "",
        webhookUrl: "",
        autoAcceptOrders: false,
        syncMenu: true
      }
    },
    {
      id: "rappi",
      name: "Rappi",
      description: "Integração com marketplace Rappi",
      status: "connected",
      type: "marketplace",
      config: {
        apiKey: "rp_live_***********",
        storeId: "12345",
        webhookUrl: "https://app.com/webhook/rappi",
        autoAcceptOrders: true,
        syncMenu: true
      }
    },
    {
      id: "uber-eats",
      name: "Uber Eats",
      description: "Integração com Uber Eats",
      status: "error",
      type: "marketplace",
      config: {
        apiKey: "ue_live_***********",
        storeId: "67890",
        webhookUrl: "https://app.com/webhook/uber",
        autoAcceptOrders: false,
        syncMenu: false
      }
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState(integrations[0]);
  const [isConnecting, setIsConnecting] = useState(false);

  const getStatusBadge = (status) => {
    const variants = {
      connected: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      disconnected: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      error: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      connecting: { color: "bg-yellow-100 text-yellow-800", icon: RefreshCw }
    };

    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <Badge className={variant.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status === "connected" ? "Conectado" : 
         status === "disconnected" ? "Desconectado" :
         status === "error" ? "Erro" : "Conectando"}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      delivery: Truck,
      marketplace: Store,
      payment: CreditCard,
      app: Smartphone
    };
    return icons[type] || Plug;
  };

  const handleConnect = async (integrationId) => {
    setIsConnecting(true);
    
    // Simular conexão
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: "connected" }
        : integration
    ));
    
    setIsConnecting(false);
  };

  const handleDisconnect = (integrationId) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: "disconnected" }
        : integration
    ));
  };

  const handleConfigChange = (field, value) => {
    setSelectedIntegration(prev => ({
      ...prev,
      config: { ...prev.config, [field]: value }
    }));
  };

  const saveConfig = () => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === selectedIntegration.id
        ? selectedIntegration
        : integration
    ));
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
          <p className="text-gray-500 mt-1">Gerencie suas integrações com marketplaces e serviços</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plug className="w-4 h-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integrations List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Integrações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations.map((integration) => {
                const TypeIcon = getTypeIcon(integration.type);
                return (
                  <div
                    key={integration.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedIntegration.id === integration.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedIntegration(integration)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{integration.name}</h3>
                          {getStatusBadge(integration.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{integration.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Integration Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    {React.createElement(getTypeIcon(selectedIntegration.type), { className: "w-6 h-6 text-gray-600" })}
                  </div>
                  <div>
                    <CardTitle>{selectedIntegration.name}</CardTitle>
                    <CardDescription>{selectedIntegration.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedIntegration.status)}
                  {selectedIntegration.status === "connected" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(selectedIntegration.id)}
                    >
                      Desconectar
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleConnect(selectedIntegration.id)}
                      disabled={isConnecting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isConnecting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {isConnecting ? "Conectando..." : "Conectar"}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="config" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="config">Configuração</TabsTrigger>
                  <TabsTrigger value="settings">Opções</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="config" className="space-y-4 mt-6">
                  {selectedIntegration.id === "ifood-entrega-facil" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Integração com Entrega Fácil</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Para conectar com o Entrega Fácil do iFood, você precisa das credenciais fornecidas pelo iFood.
                              <a href="#" className="inline-flex items-center gap-1 ml-1 underline">
                                Saiba mais <ExternalLink className="w-3 h-3" />
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>API Key</Label>
                          <Input
                            placeholder="Sua chave da API do iFood"
                            value={selectedIntegration.config.apiKey}
                            onChange={(e) => handleConfigChange("apiKey", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Store ID</Label>
                          <Input
                            placeholder="ID da sua loja no iFood"
                            value={selectedIntegration.config.storeId}
                            onChange={(e) => handleConfigChange("storeId", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <Input
                          placeholder="https://seuapp.com/webhook/ifood"
                          value={selectedIntegration.config.webhookUrl}
                          onChange={(e) => handleConfigChange("webhookUrl", e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          URL que receberá as notificações de pedidos do iFood
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Aceitar pedidos automaticamente</h4>
                        <p className="text-sm text-gray-500">
                          Aceita automaticamente novos pedidos sem intervenção manual
                        </p>
                      </div>
                      <Switch
                        checked={selectedIntegration.config.autoAcceptOrders}
                        onCheckedChange={(checked) => handleConfigChange("autoAcceptOrders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Sincronizar cardápio</h4>
                        <p className="text-sm text-gray-500">
                          Mantém o cardápio sincronizado entre as plataformas
                        </p>
                      </div>
                      <Switch
                        checked={selectedIntegration.config.syncMenu}
                        onCheckedChange={(checked) => handleConfigChange("syncMenu", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logs" className="space-y-4 mt-6">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">✓ Pedido #1234 recebido</span>
                        <span className="text-gray-500">há 2 minutos</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600">→ Cardápio sincronizado</span>
                        <span className="text-gray-500">há 15 minutos</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-red-600">✗ Erro na conexão</span>
                        <span className="text-gray-500">há 1 hora</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-6 border-t">
                <Button onClick={saveConfig} className="bg-green-600 hover:bg-green-700">
                  Salvar Configurações
                </Button>
                <Button variant="outline">
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
