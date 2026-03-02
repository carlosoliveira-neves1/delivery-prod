import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, Gift, Menu, X } from 'lucide-react';

export default function Fidelidade() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loyaltyData, setLoyaltyData] = useState({
    clientes: [],
    visitas: [],
    resgates: []
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const saved = localStorage.getItem('chegouai_fidelidade');
    if (saved) {
      setLoyaltyData(JSON.parse(saved));
    }
  };

  const saveData = (data) => {
    localStorage.setItem('chegouai_fidelidade', JSON.stringify(data));
    setLoyaltyData(data);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'visitas', label: 'Visitas', icon: TrendingUp },
    { id: 'resgates', label: 'Resgates', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm">Fidelidade</span>
        <div className="w-5" />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white shadow-xl flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <span className="font-bold">Menu</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setCurrentTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-56 flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-30">
          <div className="p-5 border-b border-gray-100">
            <h1 className="font-bold text-lg text-red-600">Fidelidade</h1>
            <p className="text-xs text-gray-500 mt-1">ChegouAí</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-56 p-6">
          {currentTab === 'dashboard' && <Dashboard data={loyaltyData} />}
          {currentTab === 'clientes' && <Clientes data={loyaltyData} onSave={saveData} />}
          {currentTab === 'visitas' && <Visitas data={loyaltyData} onSave={saveData} />}
          {currentTab === 'resgates' && <Resgates data={loyaltyData} onSave={saveData} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ data }) {
  const totalClientes = data.clientes.length;
  const totalVisitas = data.visitas.length;
  const totalResgates = data.resgates.length;
  const visitasUltimos30d = data.visitas.filter(v => {
    const date = new Date(v.data);
    const now = new Date();
    return (now - date) < 30 * 24 * 60 * 60 * 1000;
  }).length;
  const resgatesUltimos30d = data.resgates.filter(r => {
    const date = new Date(r.data);
    const now = new Date();
    return (now - date) < 30 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="max-w-6xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Visitas (30d)</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{visitasUltimos30d}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Clientes</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalClientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Resgates (30d)</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">{resgatesUltimos30d}</p>
        </div>
      </div>
    </div>
  );
}

function Clientes({ data, onSave }) {
  const [form, setForm] = useState({ name: '', cpf: '', phone: '', email: '', birthday: '' });
  const [searchCpf, setSearchCpf] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCliente = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString()
    };
    onSave({ ...data, clientes: [...data.clientes, newCliente] });
    setForm({ name: '', cpf: '', phone: '', email: '', birthday: '' });
  };

  const filteredClientes = searchCpf
    ? data.clientes.filter(c => c.cpf.includes(searchCpf))
    : data.clientes;

  return (
    <div className="max-w-6xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Clientes</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Cadastrar Cliente</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="CPF"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              placeholder="Nascimento"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
            Cadastrar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Buscar por CPF</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="000.000.000-00"
            value={searchCpf}
            onChange={(e) => setSearchCpf(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">CPF</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nasc.</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{cliente.name}</td>
                <td className="py-3 px-4">{cliente.cpf}</td>
                <td className="py-3 px-4">{cliente.phone}</td>
                <td className="py-3 px-4">{cliente.email}</td>
                <td className="py-3 px-4">{cliente.birthday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Visitas({ data, onSave }) {
  const [cpf, setCpf] = useState('');
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);

  const registrar = () => {
    setErr(null);
    setResp(null);
    const cliente = data.clientes.find(c => c.cpf === cpf);
    if (!cliente) {
      setErr('Cliente não encontrado');
      return;
    }
    const novaVisita = {
      id: Date.now().toString(),
      clienteId: cliente.id,
      clienteName: cliente.name,
      cpf: cliente.cpf,
      data: new Date().toISOString()
    };
    onSave({ ...data, visitas: [...data.visitas, novaVisita] });
    setResp({ cliente, visitasCount: data.visitas.filter(v => v.clienteId === cliente.id).length + 1 });
    setCpf('');
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Registrar Visita</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              placeholder="CPF do cliente"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={registrar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Registrar
          </button>
          {err && <p className="text-red-600 font-semibold">{err}</p>}
          {resp && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p><strong>Cliente:</strong> {resp.cliente.name} — {resp.cliente.cpf}</p>
              <p><strong>Visitas:</strong> {resp.visitasCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Resgates({ data, onSave }) {
  const [cpf, setCpf] = useState('');
  const [gift, setGift] = useState('Brinde');
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);

  const resgatar = () => {
    setErr(null);
    setResp(null);
    const cliente = data.clientes.find(c => c.cpf === cpf);
    if (!cliente) {
      setErr('Cliente não encontrado');
      return;
    }
    const novoResgate = {
      id: Date.now().toString(),
      clienteId: cliente.id,
      clienteName: cliente.name,
      cpf: cliente.cpf,
      giftName: gift,
      data: new Date().toISOString()
    };
    onSave({ ...data, resgates: [...data.resgates, novoResgate] });
    setResp(novoResgate);
    setCpf('');
    setGift('Brinde');
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Resgatar Brinde</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              placeholder="CPF do cliente"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brinde</label>
            <input
              type="text"
              placeholder="Descrição do brinde"
              value={gift}
              onChange={(e) => setGift(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={resgatar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Resgatar
          </button>
          {err && <p className="text-red-600 font-semibold">{err}</p>}
          {resp && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p><strong>Resgate #{resp.id}</strong></p>
              <p><strong>Brinde:</strong> {resp.giftName}</p>
              <p><strong>Cliente:</strong> {resp.clienteName}</p>
              <p><strong>Quando:</strong> {new Date(resp.data).toLocaleString('pt-BR')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
