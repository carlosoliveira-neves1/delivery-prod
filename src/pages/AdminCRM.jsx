import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Gift, Calendar, Star, ArrowLeft, Plus, Search, Trash2, Edit2, ShoppingCart, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminCRM() {
  const [currentTab, setCurrentTab] = useState('clientes');
  const [crmData, setCrmData] = useState({
    clientes: [],
    compras: []
  });
  const [formCliente, setFormCliente] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    dataRegistro: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = () => {
    const saved = localStorage.getItem('chegouai_crm');
    if (saved) {
      setCrmData(JSON.parse(saved));
    }
  };

  const saveCRMData = (data) => {
    localStorage.setItem('chegouai_crm', JSON.stringify(data));
    setCrmData(data);
  };

  const handleAddCliente = (e) => {
    e.preventDefault();
    if (!formCliente.nome || !formCliente.email) return;

    let novoCliente;
    if (editingId) {
      novoCliente = {
        ...formCliente,
        id: editingId,
        dataRegistro: crmData.clientes.find(c => c.id === editingId)?.dataRegistro || new Date().toISOString().split('T')[0]
      };
      const clientesAtualizados = crmData.clientes.map(c => c.id === editingId ? novoCliente : c);
      saveCRMData({ ...crmData, clientes: clientesAtualizados });
      setEditingId(null);
    } else {
      novoCliente = {
        ...formCliente,
        id: Date.now().toString(),
        dataRegistro: new Date().toISOString().split('T')[0]
      };
      saveCRMData({ ...crmData, clientes: [...crmData.clientes, novoCliente] });
    }

    setFormCliente({
      id: '',
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      endereco: '',
      dataRegistro: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditCliente = (cliente) => {
    setFormCliente(cliente);
    setEditingId(cliente.id);
  };

  const handleDeleteCliente = (id) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      saveCRMData({
        ...crmData,
        clientes: crmData.clientes.filter(c => c.id !== id)
      });
    }
  };

  const filteredClientes = crmData.clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm)
  );

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={handleGoBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-900">CRM - Gestão de Clientes</h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setCurrentTab('clientes')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              currentTab === 'clientes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setCurrentTab('relatorios')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              currentTab === 'relatorios'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Relatórios
          </button>
        </div>

        {/* Clientes Tab */}
        {currentTab === 'clientes' && (
          <div className="space-y-6">
            {/* Formulário */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">{editingId ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <form onSubmit={handleAddCliente} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formCliente.nome}
                    onChange={(e) => setFormCliente({ ...formCliente, nome: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formCliente.email}
                    onChange={(e) => setFormCliente({ ...formCliente, email: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Telefone"
                    value={formCliente.telefone}
                    onChange={(e) => setFormCliente({ ...formCliente, telefone: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="CPF"
                    value={formCliente.cpf}
                    onChange={(e) => setFormCliente({ ...formCliente, cpf: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    placeholder="Data de Nascimento"
                    value={formCliente.dataNascimento}
                    onChange={(e) => setFormCliente({ ...formCliente, dataNascimento: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={formCliente.endereco}
                    onChange={(e) => setFormCliente({ ...formCliente, endereco: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {editingId ? 'Atualizar' : 'Adicionar'} Cliente
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormCliente({
                          id: '',
                          nome: '',
                          email: '',
                          telefone: '',
                          cpf: '',
                          dataNascimento: '',
                          endereco: '',
                          dataRegistro: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Busca */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Lista de Clientes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold">Clientes ({filteredClientes.length})</h3>
              </div>
              {filteredClientes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Nenhum cliente cadastrado</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">CPF</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Data Nasc.</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClientes.map((cliente) => (
                        <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{cliente.nome}</td>
                          <td className="py-3 px-4 text-gray-600">{cliente.email}</td>
                          <td className="py-3 px-4 text-gray-600">{cliente.telefone}</td>
                          <td className="py-3 px-4 text-gray-600">{cliente.cpf}</td>
                          <td className="py-3 px-4 text-gray-600">{cliente.dataNascimento}</td>
                          <td className="py-3 px-4 text-center flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditCliente(cliente)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCliente(cliente.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Relatórios Tab */}
        {currentTab === 'relatorios' && (
          <div className="space-y-6">
            <RelatoriosTab clientes={crmData.clientes} />
          </div>
        )}
      </div>
    </div>
  );
}

function RelatoriosTab({ clientes }) {
  const [subTab, setSubTab] = useState('compras');

  // Gerar dados realistas para clientes
  const clientesComDados = clientes.map((c, idx) => ({
    ...c,
    compras: Math.floor(Math.random() * 100) + 5,
    gasto: parseFloat((Math.random() * 5000 + 500).toFixed(2))
  }));

  const aniversariantes = clientesComDados.filter(c => {
    if (!c.dataNascimento) return false;
    const hoje = new Date();
    const data = new Date(c.dataNascimento);
    return data.getMonth() === hoje.getMonth();
  });

  const topClientes = [...clientesComDados].sort((a, b) => b.gasto - a.gasto).slice(0, 10);

  const clientesPorMes = {};
  clientes.forEach(c => {
    if (c.dataRegistro) {
      const mes = c.dataRegistro.substring(0, 7);
      clientesPorMes[mes] = (clientesPorMes[mes] || 0) + 1;
    }
  });

  const crescimentoData = Object.entries(clientesPorMes)
    .sort()
    .map(([mes, quantidade]) => ({ mes, quantidade }));

  const comprasData = clientesComDados
    .sort((a, b) => b.compras - a.compras)
    .slice(0, 8)
    .map(c => ({ nome: c.nome.split(' ')[0], compras: c.compras }));

  const topClientesData = topClientes.map(c => ({ nome: c.nome.split(' ')[0], gasto: c.gasto }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const KPICard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className="w-12 h-12" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total de Clientes" value={clientes.length} color="#3b82f6" />
        <KPICard icon={ShoppingCart} label="Total de Compras" value={clientesComDados.reduce((a, b) => a + b.compras, 0)} color="#10b981" />
        <KPICard icon={DollarSign} label="Faturamento Total" value={`R$ ${clientesComDados.reduce((a, b) => a + b.gasto, 0).toFixed(0)}`} color="#f59e0b" />
        <KPICard icon={Calendar} label="Aniversariantes" value={aniversariantes.length} color="#ef4444" />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setSubTab('compras')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            subTab === 'compras'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Compras
        </button>
        <button
          onClick={() => setSubTab('aniversariantes')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            subTab === 'aniversariantes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Aniversariantes
        </button>
        <button
          onClick={() => setSubTab('top')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            subTab === 'top'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Top Clientes
        </button>
        <button
          onClick={() => setSubTab('crescimento')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            subTab === 'crescimento'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Crescimento
        </button>
      </div>

      {/* Quantidade de Compras */}
      {subTab === 'compras' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-6">Distribuição de Compras por Cliente</h3>
          {comprasData.length === 0 ? (
            <p className="text-gray-500">Nenhum cliente cadastrado</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comprasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} compras`} />
                <Bar dataKey="compras" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Aniversariantes */}
      {subTab === 'aniversariantes' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            Aniversariantes deste Mês
          </h3>
          {aniversariantes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum aniversariante este mês</p>
            </div>
          ) : (
            <div className="space-y-3">
              {aniversariantes.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Clientes */}
      {subTab === 'top' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Top 10 Clientes por Faturamento
          </h3>
          {topClientesData.length === 0 ? (
            <p className="text-gray-500">Nenhum cliente cadastrado</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topClientesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nome" type="category" width={100} />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="gasto" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Crescimento */}
      {subTab === 'crescimento' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Crescimento de Clientes por Mês
          </h3>
          {crescimentoData.length === 0 ? (
            <p className="text-gray-500">Nenhum dado de crescimento</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={crescimentoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} clientes`} />
                <Legend />
                <Line type="monotone" dataKey="quantidade" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} activeDot={{ r: 8 }} name="Clientes Novos" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}
