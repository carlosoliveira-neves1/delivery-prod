import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Componentes de gráfico simplificados (sem recharts)
const SimpleBarChart = ({ data, height = 300 }) => (
  <div className="flex items-end justify-center gap-4 h-64 p-4 bg-gray-50 rounded-lg">
    {data.map((item, index) => (
      <div key={index} className="flex flex-col items-center gap-2">
        <div 
          className="bg-blue-500 rounded-t-md min-w-8"
          style={{ height: `${(item.vendas / 4000) * 200}px` }}
        ></div>
        <span className="text-xs text-gray-600">{item.name}</span>
      </div>
    ))}
  </div>
);

const SimpleLineChart = ({ data, height = 300 }) => (
  <div className="h-64 p-4 bg-gray-50 rounded-lg flex items-center justify-center">
    <div className="text-gray-500">Gráfico de linha - Dados: {data.length} pontos</div>
  </div>
);

const SimplePieChart = ({ data, height = 300 }) => (
  <div className="h-64 p-4 bg-gray-50 rounded-lg">
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
          <span className="text-sm">{item.name}</span>
          <span className="font-medium">{item.value}%</span>
        </div>
      ))}
    </div>
  </div>
);
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ShoppingBag,
  Package,
  Truck,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  FileText
} from "lucide-react";

export default function AdminReports() {
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  // Mock data para relatórios
  const salesData = [
    { name: 'Jan', vendas: 4000, lucro: 2400, pedidos: 240 },
    { name: 'Fev', vendas: 3000, lucro: 1398, pedidos: 221 },
    { name: 'Mar', vendas: 2000, lucro: 9800, pedidos: 229 },
    { name: 'Abr', vendas: 2780, lucro: 3908, pedidos: 200 },
    { name: 'Mai', vendas: 1890, lucro: 4800, pedidos: 218 },
    { name: 'Jun', vendas: 2390, lucro: 3800, pedidos: 250 },
  ];

  const deliveryData = [
    { name: 'Entregue', value: 68, count: 340 },
    { name: 'Em rota', value: 15, count: 75 },
    { name: 'Preparando', value: 12, count: 60 },
    { name: 'Cancelado', value: 5, count: 25 },
  ];

  const topProducts = [
    { name: 'Pizza Margherita', vendas: 156, receita: 5140.40 },
    { name: 'Hambúrguer Artesanal', vendas: 134, receita: 3819.00 },
    { name: 'Pizza Calabresa', vendas: 98, receita: 3234.20 },
    { name: 'Batata Frita', vendas: 87, receita: 1305.00 },
    { name: 'Refrigerante', vendas: 203, receita: 1116.50 },
  ];

  const recentOrders = [
    { id: 'ORD-001', cliente: 'João Silva', total: 45.90, status: 'entregue', data: '2024-03-01 14:30' },
    { id: 'ORD-002', cliente: 'Maria Santos', total: 32.50, status: 'preparando', data: '2024-03-01 14:25' },
    { id: 'ORD-003', cliente: 'Pedro Costa', total: 67.80, status: 'em_rota', data: '2024-03-01 14:20' },
    { id: 'ORD-004', cliente: 'Ana Oliveira', total: 28.90, status: 'entregue', data: '2024-03-01 14:15' },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  const getStatusBadge = (status) => {
    const variants = {
      entregue: "bg-green-100 text-green-800",
      preparando: "bg-yellow-100 text-yellow-800",
      em_rota: "bg-blue-100 text-blue-800",
      cancelado: "bg-red-100 text-red-800"
    };
    
    const labels = {
      entregue: "Entregue",
      preparando: "Preparando",
      em_rota: "Em Rota",
      cancelado: "Cancelado"
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const exportReport = (type) => {
    alert(`Exportando relatório: ${type}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-900 to-purple-600 bg-clip-text text-transparent">
            Relatórios & Analytics
          </h1>
          <p className="text-gray-600">Análise completa de vendas, entregas e performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Faturamento</p>
                <p className="text-2xl font-bold">R$ 24.580</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs text-green-100">+12.5%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pedidos</p>
                <p className="text-2xl font-bold">1.247</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs text-blue-100">+8.2%</span>
                </div>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Lucro Líquido</p>
                <p className="text-2xl font-bold">R$ 8.940</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs text-purple-100">+15.3%</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Entregas</p>
                <p className="text-2xl font-bold">1.156</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-xs text-orange-100">-2.1%</span>
                </div>
              </div>
              <Truck className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
            Vendas
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
            Produtos
          </TabsTrigger>
          <TabsTrigger value="deliveries" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
            Entregas
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
            Financeiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Vendas */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Evolução de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart data={salesData} />
              </CardContent>
            </Card>

            {/* Status das Entregas */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Status das Entregas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={deliveryData} />
              </CardContent>
            </Card>
          </div>

          {/* Pedidos Recentes */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Pedidos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{order.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análise de Vendas Detalhada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={salesData} height={400} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produtos Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Participação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.vendas} unidades</TableCell>
                      <TableCell className="font-medium text-green-600">
                        R$ {product.receita.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${(product.vendas / 203) * 100}%` }}
                          ></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Tempo Médio de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">28min</div>
                  <p className="text-gray-500">Tempo médio atual</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm">3min mais rápido que ontem</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Taxa de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">96.2%</div>
                  <p className="text-gray-500">Entregas bem-sucedidas</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+1.2% vs mês anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Receita Bruta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R$ 24.580,00</div>
                <p className="text-sm text-gray-500 mt-1">Últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Custos Operacionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">R$ 15.640,00</div>
                <p className="text-sm text-gray-500 mt-1">Últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Margem de Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">36.4%</div>
                <p className="text-sm text-gray-500 mt-1">Margem líquida</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Exportar Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={() => exportReport('vendas')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Relatório de Vendas
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportReport('financeiro')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Relatório Financeiro
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportReport('produtos')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Relatório de Produtos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportReport('entregas')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Relatório de Entregas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
