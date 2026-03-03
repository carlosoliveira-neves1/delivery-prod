import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Gift, Calendar, Star, ArrowLeft, Plus, Search, Trash2, Edit2 } from 'lucide-react';

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

  const aniversariantes = clientes.filter(c => {
    if (!c.dataNascimento) return false;
    const hoje = new Date();
    const data = new Date(c.dataNascimento);
    return data.getMonth() === hoje.getMonth();
  });

  const topClientes = [...clientes].sort((a, b) => {
    const comprasA = Math.floor(Math.random() * 100);
    const comprasB = Math.floor(Math.random() * 100);
    return comprasB - comprasA;
  }).slice(0, 10);

  const clientesPorMes = {};
  clientes.forEach(c => {
    if (c.dataRegistro) {
      const mes = c.dataRegistro.substring(0, 7);
      clientesPorMes[mes] = (clientesPorMes[mes] || 0) + 1;
    }
  });

  return (
    <div>
      {/* Sub Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setSubTab('compras')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            subTab === 'compras'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Quantidade de Compras
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
          <h3 className="text-lg font-bold mb-6">Quantidade de Compras por Cliente</h3>
          <div className="space-y-3">
            {clientes.length === 0 ? (
              <p className="text-gray-500">Nenhum cliente cadastrado</p>
            ) : (
              clientes.map((cliente, idx) => {
                const compras = Math.floor(Math.random() * 50) + 1;
                return (
                  <div key={cliente.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{cliente.nome}</p>
                        <p className="text-sm text-gray-500">{cliente.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{compras}</p>
                      <p className="text-xs text-gray-500">compras</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
            <p className="text-gray-500">Nenhum aniversariante este mês</p>
          ) : (
            <div className="space-y-3">
              {aniversariantes.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-semibold text-gray-900">{cliente.nome}</p>
                    <p className="text-sm text-gray-600">{cliente.email}</p>
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
            Top 10 Clientes
          </h3>
          {topClientes.length === 0 ? (
            <p className="text-gray-500">Nenhum cliente cadastrado</p>
          ) : (
            <div className="space-y-3">
              {topClientes.map((cliente, idx) => {
                const compras = Math.floor(Math.random() * 100) + 50;
                const gasto = (compras * (Math.random() * 200 + 50)).toFixed(2);
                return (
                  <div key={cliente.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{cliente.nome}</p>
                        <p className="text-sm text-gray-600">{compras} compras</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-600">R$ {gasto}</p>
                      <p className="text-xs text-gray-500">gasto total</p>
                    </div>
                  </div>
                );
              })}
            </div>
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
          {Object.keys(clientesPorMes).length === 0 ? (
            <p className="text-gray-500">Nenhum dado de crescimento</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(clientesPorMes)
                .sort()
                .map(([mes, quantidade]) => {
                  const maxClientes = Math.max(...Object.values(clientesPorMes));
                  const percentual = (quantidade / maxClientes) * 100;
                  return (
                    <div key={mes} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-semibold text-gray-600">{mes}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-green-600 h-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
                          style={{ width: `${percentual}%` }}
                        >
                          {percentual > 20 && quantidade}
                        </div>
                      </div>
                      <div className="w-12 text-right font-semibold text-gray-900">{quantidade}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
